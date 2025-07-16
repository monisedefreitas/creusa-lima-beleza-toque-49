
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { MessageSquare, Save } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { createWhatsAppLink } from '@/utils/messageTemplates';

interface WhatsAppConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: any;
}

const WhatsAppConfirmationModal: React.FC<WhatsAppConfirmationModalProps> = ({
  isOpen,
  onClose,
  appointment
}) => {
  const isMobile = useIsMobile();

  const handleWhatsAppSend = async () => {
    const variables = {
      clientName: appointment.client_name,
      appointmentDate: new Date(appointment.appointment_date).toLocaleDateString('pt-PT'),
      appointmentTime: appointment.time_slots?.time || '',
      serviceName: appointment.appointment_services?.map((s: any) => s.services?.name).join(', ') || '',
      totalPrice: appointment.total_price?.toString() || '0'
    };

    const whatsappLink = await createWhatsAppLink(
      appointment.client_phone,
      'confirmation',
      variables
    );

    window.open(whatsappLink, '_blank');
    onClose();
  };

  const content = (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        A marcação foi atualizada com sucesso! Deseja enviar uma mensagem de confirmação pelo WhatsApp para o cliente?
      </p>
      
      <div className="flex flex-col space-y-2">
        <Button onClick={handleWhatsAppSend} className="w-full">
          <MessageSquare className="h-4 w-4 mr-2" />
          Abrir WhatsApp
        </Button>
        
        <Button variant="outline" onClick={onClose} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Apenas Salvar
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Enviar Confirmação?</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4">
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Enviar Confirmação?</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppConfirmationModal;
