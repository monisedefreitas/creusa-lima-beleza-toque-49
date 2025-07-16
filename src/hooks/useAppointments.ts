import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type TimeSlot = Tables<'time_slots'>;
type BusinessHours = Tables<'business_hours'>;
type Appointment = Tables<'appointments'>;
type Client = Tables<'clients'>;
type AppointmentWithDetails = Appointment & {
  time_slots: TimeSlot;
  clients?: Client;
  appointment_services: Array<{
    id: string;
    service_id: string;
    price: number;
    services: Tables<'services'>;
  }>;
};

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
    }
  });
};

export const useBusinessHours = () => {
  return useQuery({
    queryKey: ['business-hours'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_hours')
        .select('*')
        .eq('is_active', true)
        .order('day_of_week');
      
      if (error) throw error;
      return data as BusinessHours[];
    }
  });
};

export const useBookedSlotsForDate = (date: string) => {
  return useQuery({
    queryKey: ['booked-slots', date],
    queryFn: async () => {
      if (!date) return [];
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          time_slot_id,
          time_slots!inner(max_concurrent)
        `)
        .eq('appointment_date', date)
        .in('status', ['pending', 'confirmed']);
      
      if (error) throw error;

      // Contar quantas marcações cada slot tem
      const slotCounts = data.reduce((acc: Record<string, number>, item) => {
        acc[item.time_slot_id] = (acc[item.time_slot_id] || 0) + 1;
        return acc;
      }, {});

      // Retornar slots que atingiram o limite máximo
      const unavailableSlots: string[] = [];
      
      for (const [slotId, count] of Object.entries(slotCounts)) {
        const appointment = data.find(d => d.time_slot_id === slotId);
        const maxConcurrent = appointment?.time_slots?.max_concurrent || 1;
        
        if (count >= maxConcurrent) {
          unavailableSlots.push(slotId);
        }
      }

      return unavailableSlots;
    },
    enabled: !!date
  });
};

export const useAppointments = () => {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          time_slots (*),
          clients (*),
          appointment_services (
            id,
            service_id,
            price,
            services (*)
          )
        `)
        .order('appointment_date', { ascending: false })
        .order('time_slots(time)', { ascending: true });
      
      if (error) throw error;
      return data as AppointmentWithDetails[];
    }
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (appointmentData: {
      client_name?: string;
      client_phone?: string;
      client_email?: string;
      client_id?: string;
      appointment_date: string;
      time_slot_id: string;
      notes?: string;
      service_ids: string[];
      next_session_date?: string;
      status?: string;
    }) => {
      // Verificar disponibilidade do slot antes de criar
      const { data: existingAppointments } = await supabase
        .from('appointments')
        .select(`
          id,
          time_slots!inner(max_concurrent)
        `)
        .eq('appointment_date', appointmentData.appointment_date)
        .eq('time_slot_id', appointmentData.time_slot_id)
        .in('status', ['pending', 'confirmed']);

      const maxConcurrent = existingAppointments?.[0]?.time_slots?.max_concurrent || 1;
      
      if (existingAppointments && existingAppointments.length >= maxConcurrent) {
        throw new Error('Este horário já não está disponível. Por favor, escolha outro horário.');
      }

      let clientId = appointmentData.client_id;

      // Se não foi fornecido client_id, criar ou encontrar cliente
      if (!clientId && appointmentData.client_name && appointmentData.client_phone) {
        // Verificar se cliente já existe
        const { data: existingClient } = await supabase
          .from('clients')
          .select('id')
          .eq('phone', appointmentData.client_phone)
          .single();

        if (existingClient) {
          clientId = existingClient.id;
        } else {
          // Criar novo cliente
          const { data: newClient, error: clientError } = await supabase
            .from('clients')
            .insert({
              name: appointmentData.client_name,
              phone: appointmentData.client_phone,
              email: appointmentData.client_email,
            })
            .select()
            .single();

          if (clientError) throw clientError;
          clientId = newClient.id;
        }
      }

      // Calcular preço total
      const { data: services } = await supabase
        .from('services')
        .select('id, price_range')
        .in('id', appointmentData.service_ids);

      const totalPrice = services?.reduce((sum, service) => {
        const price = parseFloat(service.price_range?.split('-')[0]?.replace('€', '') || '0');
        return sum + price;
      }, 0) || 0;

      // Criar marcação
      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          client_id: clientId,
          client_name: appointmentData.client_name || '',
          client_phone: appointmentData.client_phone || '',
          client_email: appointmentData.client_email,
          appointment_date: appointmentData.appointment_date,
          time_slot_id: appointmentData.time_slot_id,
          notes: appointmentData.notes,
          total_price: totalPrice,
          status: appointmentData.status || 'pending',
          next_session_date: appointmentData.next_session_date,
          status_history: JSON.stringify([{
            status: appointmentData.status || 'pending',
            timestamp: new Date().toISOString(),
            changed_by: 'system'
          }])
        })
        .select()
        .single();

      if (appointmentError) throw appointmentError;

      // Criar serviços da marcação
      const appointmentServices = appointmentData.service_ids.map(serviceId => {
        const service = services?.find(s => s.id === serviceId);
        const price = parseFloat(service?.price_range?.split('-')[0]?.replace('€', '') || '0');
        
        return {
          appointment_id: appointment.id,
          service_id: serviceId,
          price: price
        };
      });

      const { error: servicesError } = await supabase
        .from('appointment_services')
        .insert(appointmentServices);

      if (servicesError) throw servicesError;

      return appointment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['booked-slots'] });
      toast({
        title: "Marcação criada",
        description: "A marcação foi criada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Error creating appointment:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar a marcação. Tente novamente.",
        variant: "destructive",
      });
    }
  });
};

export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      next_session_date 
    }: { 
      id: string; 
      status: string;
      next_session_date?: string;
    }) => {
      // Buscar histórico atual
      const { data: currentAppointment } = await supabase
        .from('appointments')
        .select('status_history')
        .eq('id', id)
        .single();

      let statusHistory = [];
      try {
        const historyData = currentAppointment?.status_history;
        if (typeof historyData === 'string') {
          statusHistory = JSON.parse(historyData);
        } else if (Array.isArray(historyData)) {
          statusHistory = historyData;
        }
      } catch (e) {
        statusHistory = [];
      }

      // Adicionar nova entrada ao histórico
      statusHistory.push({
        status,
        timestamp: new Date().toISOString(),
        changed_by: 'admin'
      });

      const updateData: any = { 
        status, 
        status_history: JSON.stringify(statusHistory)
      };

      if (next_session_date !== undefined) {
        updateData.next_session_date = next_session_date;
      }

      const { error } = await supabase
        .from('appointments')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['booked-slots'] });
      toast({
        title: "Estado atualizado",
        description: "O estado da marcação foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error updating appointment:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar o estado da marcação.",
        variant: "destructive",
      });
    }
  });
};
