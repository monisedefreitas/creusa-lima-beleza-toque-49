import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ScheduleBlock {
  id: string;
  block_date: string;
  block_type: 'full_day' | 'partial_day';
  blocked_time_slots: string[];
  reason?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useScheduleBlocks = (dateFrom?: string, dateTo?: string) => {
  return useQuery({
    queryKey: ['schedule-blocks', dateFrom, dateTo],
    queryFn: async () => {
      let query = supabase
        .from('schedule_blocks' as any)
        .select('*')
        .eq('is_active', true);
      
      if (dateFrom) {
        query = query.gte('block_date', dateFrom);
      }
      if (dateTo) {
        query = query.lte('block_date', dateTo);
      }
      
      const { data, error } = await query.order('block_date', { ascending: true });
      
      if (error) throw error;
      return (data as any) || [];
    },
  });
};

export const useCreateScheduleBlock = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (block: Omit<ScheduleBlock, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('schedule_blocks' as any)
        .insert([block])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule-blocks'] });
      toast.success('Bloqueio de agenda criado');
    },
    onError: (error) => {
      toast.error('Erro ao criar bloqueio');
      console.error('Error creating schedule block:', error);
    },
  });
};

export const useUpdateScheduleBlock = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ScheduleBlock> & { id: string }) => {
      const { data, error } = await supabase
        .from('schedule_blocks' as any)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule-blocks'] });
      toast.success('Bloqueio atualizado');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar bloqueio');
      console.error('Error updating schedule block:', error);
    },
  });
};

export const useDeleteScheduleBlock = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('schedule_blocks' as any)
        .update({ is_active: false })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule-blocks'] });
      toast.success('Bloqueio removido');
    },
    onError: (error) => {
      toast.error('Erro ao remover bloqueio');
      console.error('Error deleting schedule block:', error);
    },
  });
};