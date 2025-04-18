
import { useEffect, useState } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { formatDistanceToNow } from 'date-fns';

interface Expense {
  id: string;
  amount: number;
  merchant: string | null;
  category: string;
  created_at: string;
  currency: string;
}

const ExpensesList = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('expenses')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        setExpenses(data || []);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [user]);

  if (loading) {
    return <div className="text-gray-400 text-sm">Loading expenses...</div>;
  }

  if (expenses.length === 0) {
    return <div className="text-gray-400 text-sm">No recent expenses</div>;
  }

  return (
    <div className="space-y-2">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="flex justify-between items-center p-3 bg-nebula-blue/5 rounded-lg border border-nebula-blue/10"
        >
          <div>
            <p className="font-medium text-sm">
              {expense.merchant || expense.category}
            </p>
            <p className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(expense.created_at), { addSuffix: true })}
            </p>
          </div>
          <div>
            <p className={`font-medium text-right text-red-400`}>
              -{expense.currency} {expense.amount.toFixed(2)}
            </p>
            <p className="text-xs text-gray-400 text-right">
              {expense.category}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpensesList;
