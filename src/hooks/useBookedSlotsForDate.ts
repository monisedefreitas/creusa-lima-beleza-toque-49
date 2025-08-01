import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export interface BookedSlot {
  id: string;
  time_slot_id: string;
  appointment_date: string;
  status: string;
}

export const useBookedSlotsForDate = (selectedDate: Date) => {
  return useQuery({
    queryKey: ['booked-slots', selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null],
    queryFn: async () => {
      if (!selectedDate) return [];
      
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('appointments')
        .select('id, time_slot_id, appointment_date, status')
        .eq('appointment_date', dateString)
        .neq('status', 'cancelled');
      
      if (error) throw error;
      return data as BookedSlot[];
    },
    enabled: !!selectedDate,
  });
};