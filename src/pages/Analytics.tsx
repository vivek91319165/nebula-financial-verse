
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useMonthlyExpenses } from "@/hooks/useMonthlyExpenses";
import { useExpensesByCategory } from "@/hooks/useExpensesByCategory";
import StatCard from "@/components/dashboard/StatCard";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { CircleDollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { categoryColors } from "@/utils/categoryColors";

const Analytics = () => {
  const { data: monthlyExpenses = [], isLoading: isLoadingMonthly } = useMonthlyExpenses();
  const { data: expensesByCategory = [], isLoading: isLoadingCategories } = useExpensesByCategory();

  const totalSpent = monthlyExpenses.reduce((sum, month) => sum + month.amount, 0);
  
  const currentMonth = monthlyExpenses[monthlyExpenses.length - 1]?.amount || 0;
  const previousMonth = monthlyExpenses[monthlyExpenses.length - 2]?.amount || 0;
  
  const monthlyChange = currentMonth - previousMonth;
  const monthlyChangePercent = previousMonth ? (monthlyChange / previousMonth) * 100 : 0;

  const highestCategory = [...expensesByCategory].sort((a, b) => b.amount - a.amount)[0];
  const lowestCategory = [...expensesByCategory].sort((a, b) => a.amount - b.amount)[0];

  return (
    <MainLayout>
      <div className="container px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Analytics</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard 
            title="Total Spent" 
            value={`$${totalSpent.toFixed(2)}`} 
            icon={<CircleDollarSign className="h-8 w-8 text-nebula-green" />}
            className="border-nebula-green/30 shadow-nebula-green/5"
          />
          
          <StatCard 
            title="Highest Category" 
            value={highestCategory?.category || 'N/A'} 
            subtitle={highestCategory ? `$${highestCategory.amount.toFixed(2)}` : ''}
            icon={<TrendingUp className="h-8 w-8 text-nebula-red" />}
            className="border-nebula-red/30 shadow-nebula-red/5"
          />
          
          <StatCard 
            title="Lowest Category" 
            value={lowestCategory?.category || 'N/A'} 
            subtitle={lowestCategory ? `$${lowestCategory.amount.toFixed(2)}` : ''}
            icon={<TrendingDown className="h-8 w-8 text-nebula-blue" />}
            className="border-nebula-blue/30 shadow-nebula-blue/5"
          />
        </div>
        
        <Tabs defaultValue="monthly" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="monthly">Monthly Trends</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="monthly" className="space-y-4">
            <Card className="p-4 bg-nebula-space-light">
              <h3 className="text-lg font-medium text-white mb-4">Monthly Expenses</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyExpenses}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: '#94a3b8' }}
                    />
                    <YAxis 
                      tick={{ fill: '#94a3b8' }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1c2a', 
                        borderColor: '#2e374a',
                        color: '#e2e8f0'
                      }} 
                      formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']}
                    />
                    <Bar 
                      dataKey="amount" 
                      name="Amount" 
                      fill="#3b82f6" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4">
                <p className="text-gray-300">
                  Month-to-month change: 
                  <span className={monthlyChange >= 0 ? 'text-red-400 ml-2' : 'text-green-400 ml-2'}>
                    {monthlyChange >= 0 ? '+' : ''}{monthlyChange.toFixed(2)} 
                    ({monthlyChangePercent.toFixed(1)}%)
                  </span>
                </p>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="categories" className="space-y-4">
            <Card className="p-4 bg-nebula-space-light">
              <h3 className="text-lg font-medium text-white mb-4">Expenses by Category</h3>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expensesByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="amount"
                        nameKey="category"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {expensesByCategory.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={categoryColors[entry.category] || '#8884d8'} 
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1a1c2a', 
                          borderColor: '#2e374a',
                          color: '#e2e8f0'
                        }} 
                        formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <div className="space-y-4">
                    {expensesByCategory.map((category) => (
                      <div key={category.category}>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">{category.category}</span>
                          <span className="text-gray-300">${category.amount.toFixed(2)}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-700 rounded-full mt-1 overflow-hidden">
                          <div 
                            className="h-full rounded-full" 
                            style={{ 
                              backgroundColor: categoryColors[category.category] || '#8884d8',
                              width: `${(category.amount / totalSpent) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Analytics;
