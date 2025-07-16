
import React from 'react';
import { useUpdateAppointmentStatus } from '@/hooks/useAppointments';
import { useCreateNotification } from '@/hooks/useNotifications';
import { useToast } from '@/hooks/use-toast';
import WhatsAppMessageSelector from './WhatsAppMessageSelector';

interface EnhancedWhatsAppManagerProps {
  appointment: any;
  onClose?: () => void;
  isOpen?: boolean;
}

const EnhancedWhatsAppManager: React.FC<EnhancedWhatsAppManagerProps> = ({ 
  appointment, 
  onClose,
  isOpen = true
}) => {
  const updateStatusMutation = useUpdateAppointmentStatus();
  const createNotificationMutation = useCreateNotification();
  const { toast } = useToast();

  const handleSendWhatsApp = async (message: string, type: string) => {
    try {
      // Update appointment status if it's a confirmation
      if (type === 'confirmation') {
        await updateStatusMutation.mutateAsync({ 
          id: appointment.id, 
          status: 'confirmed' 
        });
      }

      // Create notification
      await createNotificationMutation.mutateAsync({
        type: 'whatsapp_sent',
        title: `WhatsApp enviado - ${getMessageTypeLabel(type)}`,
        message: `Mensagem enviada para ${appointment.client_name}: ${message.substring(0, 100)}...`,
        appointment_id: appointment.id,
        client_name: appointment.client_name
      });

      // Open WhatsApp with the message
      const phoneNumber = appointment.client_phone.replace(/\D/g, '');
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      
      toast({
        title: "WhatsApp aberto",
        description: `Mensagem de ${getMessageTypeLabel(type).toLowerCase()} enviada com sucesso.`,
      });

      if (onClose) onClose();
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar o envio da mensagem WhatsApp.",
        variant: "destructive",
      });
    }
  };

  const getMessageTypeLabel = (type: string) => {
    const labels = {
      'confirmation': 'Confirmação de Marcação',
      'reminder': 'Lembrete de Marcação',
      'cancellation': 'Cancelamento de Marcação',
      'reschedule': 'Reagendamento'
    };
    return labels[type as keyof typeof labels] || 'Mensagem WhatsApp';
  };

  return (
    <WhatsAppMessageSelector 
      appointment={appointment} 
      onSend={handleSendWhatsApp}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
};

export default EnhancedWhatsAppManager;
