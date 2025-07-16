
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ConfirmPriceData {
  appointmentId: string;
  finalPrice: number;
  notes?: string;
}

export const usePriceConfirmation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ appointmentId, finalPrice, notes }: ConfirmPriceData) => {
      const { error } = await supabase
        .from('appointments')
        .update({
          final_price: finalPrice,
          price_confirmed_at: new Date().toISOString(),
          price_confirmed_by: 'admin', // TODO: Use actual admin user ID when auth is implemented
          status: 'confirmed',
          notes: notes,
          // Atualizar histórico de status
          status_history: [
            { 
              status: 'confirmed', 
              timestamp: new Date().toISOString(), 
              changed_by: 'admin',
              action: 'price_confirmed',
              final_price: finalPrice
            }
          ]
        })
        .eq('id', appointmentId);

      if (error) throw error;

      return { appointmentId, finalPrice };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Valor confirmado",
        description: `Marcação confirmada com valor final de €${data.finalPrice}`,
      });
    },
    onError: (error) => {
      console.error('Error confirming price:', error);
      toast({
        title: "Erro",
        description: "Erro ao confirmar o valor. Tente novamente.",
        variant: "destructive",
      });
    }
  });
};
