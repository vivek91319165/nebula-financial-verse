
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'sonner';

export const useBalance = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: balance, isLoading } = useQuery({
    queryKey: ['balance'],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('balances')
        .select('total_balance')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data?.total_balance || 0;
    },
    enabled: !!user,
  });

  const updateBalance = useMutation({
    mutationFn: async (newBalance: number) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('balances')
        .upsert(
          { user_id: user.id, total_balance: newBalance },
          { onConflict: 'user_id' }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      toast.success('Balance updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update balance');
      console.error('Error updating balance:', error);
    },
  });

  return { balance, isLoading, updateBalance };
};
