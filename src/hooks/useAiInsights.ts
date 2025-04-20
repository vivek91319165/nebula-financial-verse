
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'sonner';

export const useAiInsights = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: insights, isLoading } = useQuery({
    queryKey: ['ai-insights'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const generateInsights = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('financial-insights', {
        body: { 
          user_id: user.id,
          type: 'insights'
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-insights'] });
      toast.success('New insights generated!');
    },
    onError: (error) => {
      console.error('Error generating insights:', error);
      toast.error('Failed to generate insights');
    },
  });

  const getChatResponse = useMutation({
    mutationFn: async (message: string) => {
      if (!user) throw new Error('User not authenticated');

      try {
        const { data, error } = await supabase.functions.invoke('financial-insights', {
          body: { 
            user_id: user.id,
            message,
            type: 'chat'
          },
        });

        if (error) throw error;
        if (!data || !data.message) {
          throw new Error('Invalid response from AI assistant');
        }
        return data;
      } catch (error: any) {
        console.error('Error getting chat response:', error);
        throw new Error(error.message || 'Failed to get chat response');
      }
    },
    onError: (error) => {
      console.error('Error in getChatResponse:', error);
      toast.error('Failed to get AI response');
    },
  });

  const markAsRead = useMutation({
    mutationFn: async (insightId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('ai_insights')
        .update({ is_read: true })
        .eq('id', insightId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-insights'] });
    },
  });

  return {
    insights,
    isLoading,
    generateInsights,
    getChatResponse,
    markAsRead,
  };
};
