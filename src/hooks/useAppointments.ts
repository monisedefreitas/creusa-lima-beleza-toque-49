
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type TimeSlot = Tables<'time_slots'>;
type BusinessHours = Tables<'business_hours'>;
type Appointment = Tables<'appointments'>;
type AppointmentWithDetails = Appointment & {
  time_slots: TimeSlot;
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
      const { data, error } = await supabase
        .from('appointments')
        .select('time_slot_id')
        .eq('appointment_date', date)
        .in('status', ['pending', 'confirmed']);
      
      if (error) throw error;
      return data.map(item => item.time_slot_id);
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
      client_name: string;
      client_phone: string;
      client_email?: string;
      appointment_date: string;
      time_slot_id: string;
      notes?: string;
      service_ids: string[];
    }) => {
      // Calculate total price
      const { data: services } = await supabase
        .from('services')
        .select('id, price_range')
        .in('id', appointmentData.service_ids);

      const totalPrice = services?.reduce((sum, service) => {
        const price = parseFloat(service.price_range?.split('-')[0]?.replace('€', '') || '0');
        return sum + price;
      }, 0) || 0;

      // Create appointment
      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          client_name: appointmentData.client_name,
          client_phone: appointmentData.client_phone,
          client_email: appointmentData.client_email,
          appointment_date: appointmentData.appointment_date,
          time_slot_id: appointmentData.time_slot_id,
          notes: appointmentData.notes,
          total_price: totalPrice,
          status: 'pending'
        })
        .select()
        .single();

      if (appointmentError) throw appointmentError;

      // Create appointment services
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
      queryClient.invalidateQueries({ queryKey: ['booked-slots'] });
      toast({
        title: "Marcação criada",
        description: "A sua marcação foi criada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Error creating appointment:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar a marcação. Tente novamente.",
        variant: "destructive",
      });
    }
  });
};

export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
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
