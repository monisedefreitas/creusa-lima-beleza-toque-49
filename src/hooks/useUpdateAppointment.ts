
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UpdateAppointmentData {
  id: string;
  client_name?: string;
  client_phone?: string;
  client_email?: string;
  appointment_date?: string;
  time_slot_id?: string;
  notes?: string;
  service_ids?: string[];
  status?: string;
  next_session_date?: string;
}

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: UpdateAppointmentData) => {
      const { id, service_ids, ...appointmentData } = data;

      // Calcular novo preço total se os serviços mudaram
      let totalPrice = null;
      if (service_ids && service_ids.length > 0) {
        const { data: services } = await supabase
          .from('services')
          .select('id, price_range')
          .in('id', service_ids);

        totalPrice = services?.reduce((sum, service) => {
          const price = parseFloat(service.price_range?.split('-')[0]?.replace('€', '') || '0');
          return sum + price;
        }, 0) || 0;
      }

      // Atualizar marcação
      const { error: appointmentError } = await supabase
        .from('appointments')
        .update({
          ...appointmentData,
          ...(totalPrice !== null && { total_price: totalPrice })
        })
        .eq('id', id);

      if (appointmentError) throw appointmentError;

      // Atualizar serviços se fornecidos
      if (service_ids) {
        // Remover serviços existentes
        const { error: deleteError } = await supabase
          .from('appointment_services')
          .delete()
          .eq('appointment_id', id);

        if (deleteError) throw deleteError;

        // Adicionar novos serviços
        if (service_ids.length > 0) {
          const { data: services } = await supabase
            .from('services')
            .select('id, price_range')
            .in('id', service_ids);

          const appointmentServices = service_ids.map(serviceId => {
            const service = services?.find(s => s.id === serviceId);
            const price = parseFloat(service?.price_range?.split('-')[0]?.replace('€', '') || '0');
            
            return {
              appointment_id: id,
              service_id: serviceId,
              price: price
            };
          });

          const { error: servicesError } = await supabase
            .from('appointment_services')
            .insert(appointmentServices);

          if (servicesError) throw servicesError;
        }
      }

      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['booked-slots'] });
      toast({
        title: "Marcação atualizada",
        description: "A marcação foi atualizada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Error updating appointment:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar a marcação. Tente novamente.",
        variant: "destructive",
      });
    }
  });
};
