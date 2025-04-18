
import { BarChart3, ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";

// Sample data for charts
const monthlyData = [
  { name: "Jan", expense: 1200, income: 2400 },
  { name: "Feb", expense: 1800, income: 2100 },
  { name: "Mar", expense: 1400, income: 2400 },
  { name: "Apr", expense: 1900, income: 2600 },
  { name: "May", expense: 1300, income: 2000 },
  { name: "Jun", expense: 1500, income: 2400 },
];

const categoryData = [
  { name: "Housing", value: 1200 },
  { name: "Food", value: 800 },
  { name: "Transport", value: 600 },
  { name: "Entertainment", value: 400 },
  { name: "Utilities", value: 300 },
  { name: "Other", value: 200 },
];

const cryptoData = [
  { name: "Jan", btc: 5.2, eth: 3.8, xlm: 2.1 },
  { name: "Feb", btc: 4.8, eth: 4.1, xlm: 2.5 },
  { name: "Mar", btc: 5.5, eth: 4.5, xlm: 2.2 },
  { name: "Apr", btc: 6.2, eth: 5.0, xlm: 2.8 },
  { name: "May", btc: 5.8, eth: 4.7, xlm: 2.4 },
  { name: "Jun", btc: 6.5, eth: 5.2, xlm: 3.0 },
];

const Analytics = () => {
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
                <Bar dataKey="value" name="Amount ($)" fill="#F97316" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card className="p-4 bg-nebula-space-light border-nebula-purple/20 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <TrendingDown className="h-5 w-5 mr-2 text-nebula-purple" />
              Crypto Performance
            </h2>
            <div className="text-xs font-medium text-gray-400">Last 6 Months</div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={cryptoData}
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
              <Line type="monotone" dataKey="btc" name="Bitcoin" stroke="#F7931A" strokeWidth={2} />
              <Line type="monotone" dataKey="eth" name="Ethereum" stroke="#627EEA" strokeWidth={2} />
              <Line type="monotone" dataKey="xlm" name="Stellar" stroke="#9b87f5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-nebula-space-light border-nebula-blue/20">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Total Income</h3>
            <div className="text-2xl font-bold text-white">$13,900</div>
            <div className="text-xs text-green-400 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.2% from last month
            </div>
          </Card>
          
          <Card className="p-4 bg-nebula-space-light border-nebula-orange/20">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Total Expenses</h3>
            <div className="text-2xl font-bold text-white">$8,100</div>
            <div className="text-xs text-red-400 flex items-center mt-1">
              <TrendingDown className="h-3 w-3 mr-1" />
              +12.5% from last month
            </div>
          </Card>
          
          <Card className="p-4 bg-nebula-space-light border-nebula-purple/20">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Net Savings</h3>
            <div className="text-2xl font-bold text-white">$5,800</div>
            <div className="text-xs text-green-400 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2.7% from last month
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Analytics;
