import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useRealtimeAppointments = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log('Setting up realtime appointment updates...');
    
    const channel = supabase
      .channel('appointments-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'appointments'
        },
        (payload) => {
          console.log('New appointment created:', payload);
          
          // Invalidate relevant queries
          queryClient.invalidateQueries({ queryKey: ['appointments'] });
          queryClient.invalidateQueries({ queryKey: ['appointment-stats'] });
          queryClient.invalidateQueries({ queryKey: ['booked-slots'] });
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
          
          // Show notification for new appointment
          if (payload.new) {
            toast.success('Novo agendamento recebido!', {
              description: `Cliente: ${payload.new.client_name}`,
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'appointments'
        },
        (payload) => {
          console.log('Appointment updated:', payload);
          
          // Invalidate relevant queries
          queryClient.invalidateQueries({ queryKey: ['appointments'] });
          queryClient.invalidateQueries({ queryKey: ['appointment-stats'] });
          queryClient.invalidateQueries({ queryKey: ['booked-slots'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'appointments'
        },
        (payload) => {
          console.log('Appointment deleted:', payload);
          
          // Invalidate relevant queries
          queryClient.invalidateQueries({ queryKey: ['appointments'] });
          queryClient.invalidateQueries({ queryKey: ['appointment-stats'] });
          queryClient.invalidateQueries({ queryKey: ['booked-slots'] });
        }
      )
      .subscribe((status) => {
        console.log('Realtime appointment subscription status:', status);
      });

    return () => {
      console.log('Cleaning up realtime appointment subscription...');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};