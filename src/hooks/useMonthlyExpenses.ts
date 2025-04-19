
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';

export const useMonthlyExpenses = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['monthlyExpenses'],
    queryFn: async () => {
      if (!user) return 0;
      
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('expenses')
        .select('amount')
        .gte('created_at', startOfMonth.toISOString())
        .eq('user_id', user.id);

      if (error) throw error;
      
      return data.reduce((sum, expense) => sum + expense.amount, 0);
    },
    enabled: !!user,
  });
};
