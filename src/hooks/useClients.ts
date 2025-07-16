
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type Client = Tables<'clients'>;
type ClientWithAppointments = Client & {
  appointments: Array<{
    id: string;
    appointment_date: string;
    status: string;
    total_price: number;
    time_slots: { time: string };
    appointment_services: Array<{
      services: { name: string };
    }>;
  }>;
};

export const useClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select(`
          *,
          appointments (
            id,
            appointment_date,
            status,
            total_price,
            time_slots (time),
            appointment_services (
              services (name)
            )
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ClientWithAppointments[];
    }
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (clientData: {
      name: string;
      phone: string;
      email?: string;
      notes?: string;
      preferences?: any;
    }) => {
      const { data, error } = await supabase
        .from('clients')
        .insert(clientData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Cliente criado",
        description: "Cliente criado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Error creating client:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar cliente.",
        variant: "destructive",
      });
    }
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Client>) => {
      const { error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Cliente atualizado",
        description: "Cliente atualizado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Error updating client:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar cliente.",
        variant: "destructive",
      });
    }
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Cliente removido",
        description: "Cliente removido com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Error deleting client:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover cliente.",
        variant: "destructive",
      });
    }
  });
};
