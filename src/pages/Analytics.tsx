
import { BarChart3, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Title } from "@/components/ui/typography";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell } from "recharts";
import { useState, useEffect } from "react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { categoryColors, ExpenseCategory } from '@/utils/categoryColors';
import { useExpensesByCategory } from "@/hooks/useExpensesByCategory";
import { useBalance } from "@/hooks/useBalance";
import { useWallet } from "@/hooks/useWallet";

const Analytics = () => {
  const { balance } = useBalance();
  const { assets } = useWallet();
  const { user } = useAuth();
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const { data: categoryData = [] } = useExpensesByCategory();

  // Fetch monthly income/expense data
  useEffect(() => {
    const fetchMonthlyData = async () => {
      if (!user) return;

      // Get the last 6 months
      const months = Array.from({length: 6}, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return date;
      }).reverse();

      const promises = months.map(async (date) => {
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const { data: expenses } = await supabase
          .from('expenses')
          .select('amount')
          .gte('created_at', startOfMonth.toISOString())
          .lte('created_at', endOfMonth.toISOString())
          .eq('user_id', user.id);

        // Sum up expenses for the month
        const expense = expenses?.reduce((sum, exp) => sum + Number(exp.amount), 0) || 0;

        return {
          name: date.toLocaleString('default', { month: 'short' }),
          expense: expense,
          income: balance ? balance / 6 : 0,
        };
      });

      const results = await Promise.all(promises);
      setMonthlyData(results);
    };

    fetchMonthlyData();
  }, [user, balance]);

  return (
    <div className="container px-4 py-8">
      <Title>Analytics Dashboard</Title>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Monthly Income & Expense Chart */}
        <Card className="p-6 bg-nebula-space-light border-nebula-orange/20 h-[400px]">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <TrendingUp className="mr-2 text-nebula-orange" />
            Monthly Income & Expenses
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#0EA5E9" name="Income ($)" />
              <Bar dataKey="expense" fill="#F97316" name="Expenses ($)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Expenses by Category Chart */}
        <Card className="p-6 bg-nebula-space-light border-nebula-orange/20 h-[400px]">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <BarChart3 className="mr-2 text-nebula-orange" />
            Expenses by Category
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categoryData}
              margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
            >
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Amount ($)">
                {categoryData.map((entry, index) => {
                  const categoryKey = entry.name as ExpenseCategory;
                  const color = categoryColors[categoryKey] || '#F97316';
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
