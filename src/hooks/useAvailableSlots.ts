import { useMemo } from 'react';
import { format } from 'date-fns';
import { useTimeSlots } from './useTimeSlots';
import { useServiceAvailability } from './useServiceAvailability';
import { useScheduleBlocks } from './useScheduleBlocks';
import { useBookedSlotsForDate } from './useBookedSlotsForDate';

export const useAvailableSlots = (selectedDate: Date, serviceId?: string) => {
  const { data: timeSlots = [] } = useTimeSlots();
  const { data: serviceAvailability = [] } = useServiceAvailability(serviceId);
  const { data: scheduleBlocks = [] } = useScheduleBlocks();
  const { data: bookedSlots = [] } = useBookedSlotsForDate(selectedDate);

  const availableSlots = useMemo(() => {
    if (!selectedDate) return [];

    const dateString = format(selectedDate, 'yyyy-MM-dd');
    const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Check if service is available on this day of week
    if (serviceId && serviceAvailability.length > 0) {
      const availability = serviceAvailability.find(sa => sa.service_id === serviceId);
      if (availability && !availability.days_of_week.includes(dayOfWeek)) {
        return []; // Service not available on this day
      }
    }

    // Check for schedule blocks on this date
    const dayBlock = scheduleBlocks.find(block => block.block_date === dateString);
    
    if (dayBlock?.block_type === 'full_day') {
      return []; // Entire day is blocked
    }

    // Filter out blocked time slots and booked slots
    const blockedTimeSlots = dayBlock?.blocked_time_slots || [];
    const bookedTimeSlots = bookedSlots.map(slot => slot.time_slot_id);

    let availableTimeSlots = timeSlots.filter(slot => 
      slot.is_available && 
      !blockedTimeSlots.includes(slot.id) &&
      !bookedTimeSlots.includes(slot.id)
    );

    // If service has specific time slots, filter to those
    if (serviceId && serviceAvailability.length > 0) {
      const availability = serviceAvailability.find(sa => sa.service_id === serviceId);
      if (availability && availability.specific_time_slots.length > 0) {
        availableTimeSlots = availableTimeSlots.filter(slot =>
          availability.specific_time_slots.includes(slot.id)
        );
      }
    }

    return availableTimeSlots;
  }, [selectedDate, serviceId, timeSlots, serviceAvailability, scheduleBlocks, bookedSlots]);

  const isDateAvailable = useMemo(() => {
    if (!selectedDate || !serviceId) return true;

    const dayOfWeek = selectedDate.getDay();
    const dateString = format(selectedDate, 'yyyy-MM-dd');

    // Check service availability
    const availability = serviceAvailability.find(sa => sa.service_id === serviceId);
    if (availability && !availability.days_of_week.includes(dayOfWeek)) {
      return false;
    }

    // Check for full day blocks
    const dayBlock = scheduleBlocks.find(block => 
      block.block_date === dateString && block.block_type === 'full_day'
    );
    
    return !dayBlock;
  }, [selectedDate, serviceId, serviceAvailability, scheduleBlocks]);

  const getUnavailabilityReason = useMemo(() => {
    if (!selectedDate || !serviceId) return null;

    const dayOfWeek = selectedDate.getDay();
    const dateString = format(selectedDate, 'yyyy-MM-dd');

    // Check service availability
    const availability = serviceAvailability.find(sa => sa.service_id === serviceId);
    if (availability && !availability.days_of_week.includes(dayOfWeek)) {
      const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      const availableDays = availability.days_of_week.map(day => dayNames[day]).join(', ');
      return `Este serviço só está disponível às ${availableDays}. Por favor, selecione uma data válida.`;
    }

    // Check for full day blocks
    const dayBlock = scheduleBlocks.find(block => 
      block.block_date === dateString && block.block_type === 'full_day'
    );
    
    if (dayBlock) {
      return dayBlock.reason || 'A agenda encontra-se fechada nesta data. Por favor, escolha outro dia.';
    }

    return null;
  }, [selectedDate, serviceId, serviceAvailability, scheduleBlocks]);

  return {
    availableSlots,
    isDateAvailable,
    getUnavailabilityReason
  };
};