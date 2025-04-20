
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';

export const useExpensesByCategory = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['expensesByCategory'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('expenses')
        .select('amount, category, created_at');

      if (error) throw error;
      
      const categoryTotals = data.reduce((acc: Record<string, number>, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount);
        return acc;
      }, {});

      return Object.entries(categoryTotals).map(([category, amount]) => ({
        name: category,
        value: amount
      }));
    },
    enabled: !!user,
  });
};
