
import React from 'react';
import { useUpdateAppointmentStatus } from '@/hooks/useAppointments';
import { useCreateNotification } from '@/hooks/useNotifications';
import { useToast } from '@/hooks/use-toast';
import WhatsAppMessageSelector from './WhatsAppMessageSelector';

interface EnhancedWhatsAppManagerProps {
  appointment: any;
  onClose?: () => void;
}

const EnhancedWhatsAppManager: React.FC<EnhancedWhatsAppManagerProps> = ({ 
  appointment, 
  onClose 
}) => {
  const updateStatusMutation = useUpdateAppointmentStatus();
  const createNotificationMutation = useCreateNotification();
  const { toast } = useToast();

  const handleSendWhatsApp = async (message: string, type: string) => {
    try {
      // Update appointment status if it's a confirmation
      if (type === 'whatsapp_confirmation') {
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
      'whatsapp_confirmation': 'Confirmação de Marcação',
      'whatsapp_arrival_confirmation': 'Confirmação de Vinda',
      'whatsapp_review_request': 'Pedido de Avaliação',
      'custom': 'Mensagem Personalizada'
    };
    return labels[type as keyof typeof labels] || 'Mensagem WhatsApp';
  };

  return (
    <WhatsAppMessageSelector 
      appointment={appointment} 
      onSend={handleSendWhatsApp}
    />
  );
};

export default EnhancedWhatsAppManager;
