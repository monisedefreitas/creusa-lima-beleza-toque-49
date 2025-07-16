
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useTimeSlots, useUpdateAppointmentStatus } from '@/hooks/useAppointments';
import { useCreateNotification } from '@/hooks/useNotifications';
import { useToast } from '@/hooks/use-toast';
import EnhancedWhatsAppManager from './EnhancedWhatsAppManager';

interface RescheduleModalProps {
  appointment: any;
  isOpen: boolean;
  onClose: () => void;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({ appointment, isOpen, onClose }) => {
  const [newDate, setNewDate] = useState<Date | undefined>(undefined);
  const [newTimeSlotId, setNewTimeSlotId] = useState<string>('');
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [updatedAppointment, setUpdatedAppointment] = useState<any>(null);

  const { data: timeSlots } = useTimeSlots();
  const updateStatusMutation = useUpdateAppointmentStatus();
  const createNotificationMutation = useCreateNotification();
  const { toast } = useToast();

  const handleReschedule = async () => {
    if (!newDate || !newTimeSlotId) {
      toast({
        title: "Erro",
        description: "Por favor, selecione nova data e horário",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateStatusMutation.mutateAsync({
        id: appointment.id,
        status: 'confirmed',
        next_session_date: format(newDate, 'yyyy-MM-dd')
      });

      await createNotificationMutation.mutateAsync({
        type: 'appointment_rescheduled',
        title: 'Consulta Reagendada',
        message: `Consulta de ${appointment.client_name} reagendada para ${format(newDate, 'dd/MM/yyyy')}`,
        appointment_id: appointment.id,
        client_name: appointment.client_name
      });

      const newAppointmentData = {
        ...appointment,
        appointment_date: format(newDate, 'yyyy-MM-dd'),
        time_slot_id: newTimeSlotId,
        time_slots: timeSlots?.find(slot => slot.id === newTimeSlotId)
      };

      setUpdatedAppointment(newAppointmentData);
      setShowWhatsApp(true);

      toast({
        title: "Reagendado com sucesso",
        description: "A consulta foi reagendada. Agora pode enviar a mensagem WhatsApp.",
      });
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      toast({
        title: "Erro",
        description: "Erro ao reagendar consulta",
        variant: "destructive",
      });
    }
  };

  const handleWhatsAppClose = () => {
    setShowWhatsApp(false);
    onClose();
  };

  if (showWhatsApp && updatedAppointment) {
    return (
      <EnhancedWhatsAppManager
        appointment={updatedAppointment}
        isOpen={true}
        onClose={handleWhatsAppClose}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reagendar Consulta</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Cliente: {appointment?.client_name}</p>
            <p className="text-sm text-gray-600">Data atual: {appointment?.appointment_date}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Nova Data</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !newDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newDate ? format(newDate, "PPP", { locale: pt }) : "Escolha uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={newDate}
                  onSelect={setNewDate}
                  initialFocus
                  locale={pt}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Novo Horário</label>
            <Select onValueChange={setNewTimeSlotId}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha um horário..." />
              </SelectTrigger>
              <SelectContent>
                {timeSlots?.map((slot) => (
                  <SelectItem key={slot.id} value={slot.id}>
                    {slot.time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleReschedule} className="flex-1">
              <MessageSquare className="w-4 h-4 mr-2" />
              Reagendar & Enviar WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleModal;
