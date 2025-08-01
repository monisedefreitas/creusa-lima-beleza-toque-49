import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ServiceAvailability {
  id: string;
  service_id: string;
  days_of_week: number[];
  specific_time_slots: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useServiceAvailability = (serviceId?: string) => {
  return useQuery({
    queryKey: ['service-availability', serviceId],
    queryFn: async () => {
      let query = supabase
        .from('service_availability' as any)
        .select('*')
        .eq('is_active', true);
      
      if (serviceId) {
        query = query.eq('service_id', serviceId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return (data as any) || [];
    },
  });
};

export const useCreateServiceAvailability = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (availability: Omit<ServiceAvailability, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('service_availability' as any)
        .insert([availability])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-availability'] });
      toast.success('Disponibilidade do serviço configurada');
    },
    onError: (error) => {
      toast.error('Erro ao configurar disponibilidade');
      console.error('Error creating service availability:', error);
    },
  });
};

export const useUpdateServiceAvailability = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ServiceAvailability> & { id: string }) => {
      const { data, error } = await supabase
        .from('service_availability' as any)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-availability'] });
      toast.success('Disponibilidade atualizada');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar disponibilidade');
      console.error('Error updating service availability:', error);
    },
  });
};

export const useDeleteServiceAvailability = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('service_availability' as any)
        .update({ is_active: false })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-availability'] });
      toast.success('Disponibilidade removida');
    },
    onError: (error) => {
      toast.error('Erro ao remover disponibilidade');
      console.error('Error deleting service availability:', error);
    },
  });
};