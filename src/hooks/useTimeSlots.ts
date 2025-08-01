import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TimeSlot {
  id: string;
  time: string;
  duration_minutes: number;
  is_available: boolean;
  max_concurrent: number;
  created_at: string;
  updated_at: string;
}

export const useTimeSlots = () => {
  return useQuery({
    queryKey: ['time-slots'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('time_slots')
        .select('*')
        .eq('is_available', true)
        .order('time');
      
      if (error) throw error;
      return data as TimeSlot[];
    },
  });
};

export const useCreateTimeSlot = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (timeSlot: Omit<TimeSlot, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('time_slots')
        .insert([timeSlot])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-slots'] });
      toast.success('Horário criado com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao criar horário');
      console.error('Error creating time slot:', error);
    },
  });
};

export const useUpdateTimeSlot = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<TimeSlot> & { id: string }) => {
      const { data, error } = await supabase
        .from('time_slots')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-slots'] });
      toast.success('Horário atualizado');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar horário');
      console.error('Error updating time slot:', error);
    },
  });
};

export const useDeleteTimeSlot = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('time_slots')
        .update({ is_available: false })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-slots'] });
      toast.success('Horário removido');
    },
    onError: (error) => {
      toast.error('Erro ao remover horário');
      console.error('Error deleting time slot:', error);
    },
  });
};