
import { BarChart3, ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { useMonthlyExpenses } from "@/hooks/useMonthlyExpenses";
import { useWallet } from "@/hooks/useWallet";
import { useBalance } from "@/hooks/useBalance";
import { useState, useEffect } from "react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { categoryColors } from '@/utils/categoryColors';
import { useExpensesByCategory } from "@/hooks/useExpensesByCategory";

const Analytics = () => {
  const { balance } = useBalance();
  const { data: monthlyExpenses } = useMonthlyExpenses();
  const { assets } = useWallet();
  const { user } = useAuth();
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const { data: categoryData = [] } = useExpensesByCategory();

  // Fetch monthly income/expense data
  useEffect(() => {
    const fetchMonthlyData = async () => {
      if (!user) return;

      const months = Array.from({length: 6}, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return date;
      }).reverse();

      const data = await Promise.all(months.map(async (date) => {
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const { data: expenses } = await supabase
          .from('expenses')
          .select('amount')
          .gte('created_at', startOfMonth.toISOString())
          .lte('created_at', endOfMonth.toISOString())
          .eq('user_id', user.id);

        const expense = expenses?.reduce((sum, exp) => sum + Number(exp.amount), 0) || 0;

        return {
          name: date.toLocaleString('default', { month: 'short' }),
          expense: expense,
          income: balance ? balance / 6 : 0,
        };
      }));

      setMonthlyData(data);
    };

    fetchMonthlyData();
  }, [user, balance]);

  // Calculate totals for summary cards
  const totalIncome = balance || 0;
  const totalExpenses = monthlyExpenses || 0;
  const netSavings = totalIncome - totalExpenses;
  const expensePercentage = totalIncome ? (totalExpenses / totalIncome) * 100 : 0;
  const savingsPercentage = totalIncome ? (netSavings / totalIncome) * 100 : 0;

  // Function to get category colors for the bar chart
  const getCategoryColor = (entry: any) => {
    return categoryColors[entry.name] || '#F97316';
  };

  return (
    <MainLayout>
      <div className="container px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="text-gray-400 mr-3">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="p-4 bg-nebula-space-light border-nebula-blue/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-nebula-blue" />
                Income vs Expenses
              </h2>
              <div className="text-xs font-medium text-gray-400">Last 6 Months</div>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={monthlyData}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#1E293B", 
                    borderColor: "#6B7280",
                    color: "#F9FAFB" 
                  }} 
                />
                <Legend />
                <Bar dataKey="income" name="Income" fill="#0EA5E9" />
                <Bar dataKey="expense" name="Expense" fill="#F97316" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-4 bg-nebula-space-light border-nebula-orange/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-nebula-orange" />
                Expenses by Category
              </h2>
              <div className="text-xs font-medium text-gray-400">Current Month</div>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={categoryData}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9CA3AF" />
                <YAxis dataKey="name" type="category" stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#1E293B", 
                    borderColor: "#6B7280",
                    color: "#F9FAFB" 
                  }} 
                />
                <Bar 
                  dataKey="value" 
                  name="Amount ($)"
                  fill={getCategoryColor}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-nebula-space-light border-nebula-blue/20">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Total Income</h3>
            <div className="text-2xl font-bold text-white">${totalIncome.toFixed(2)}</div>
            <div className="text-xs text-green-400 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Monthly average: ${(totalIncome / 6).toFixed(2)}
            </div>
          </Card>
          
          <Card className="p-4 bg-nebula-space-light border-nebula-orange/20">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Total Expenses</h3>
            <div className="text-2xl font-bold text-white">${totalExpenses.toFixed(2)}</div>
            <div className="text-xs text-red-400 flex items-center mt-1">
              <TrendingDown className="h-3 w-3 mr-1" />
              {expensePercentage.toFixed(1)}% of income
            </div>
          </Card>
          
          <Card className="p-4 bg-nebula-space-light border-nebula-purple/20">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Net Savings</h3>
            <div className="text-2xl font-bold text-white">${netSavings.toFixed(2)}</div>
            <div className="text-xs text-green-400 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              {savingsPercentage.toFixed(1)}% of income
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Analytics;
