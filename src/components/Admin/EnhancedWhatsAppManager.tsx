
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MessageCircle, Send, Eye } from 'lucide-react';
import { useMessageTemplates, useDefaultTemplate } from '@/hooks/useMessageTemplates';
import { useUpdateAppointmentStatus } from '@/hooks/useAppointments';
import { useCreateNotification } from '@/hooks/useNotifications';
import { 
  processMessageTemplate, 
  generateWhatsAppVariables 
} from '@/utils/messageTemplates';
import { useToast } from '@/hooks/use-toast';

interface EnhancedWhatsAppManagerProps {
  appointment: any;
  onClose?: () => void;
}

const EnhancedWhatsAppManager: React.FC<EnhancedWhatsAppManagerProps> = ({ 
  appointment, 
  onClose 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [customMessage, setCustomMessage] = useState('');
  const [previewMessage, setPreviewMessage] = useState('');
  
  const { data: templates } = useMessageTemplates();
  const { data: defaultTemplate } = useDefaultTemplate('whatsapp_confirmation');
  const updateStatusMutation = useUpdateAppointmentStatus();
  const createNotificationMutation = useCreateNotification();
  const { toast } = useToast();

  React.useEffect(() => {
    if (defaultTemplate && !selectedTemplateId) {
      setSelectedTemplateId(defaultTemplate.id);
      generatePreview(defaultTemplate.content);
    }
  }, [defaultTemplate, selectedTemplateId]);

  const generatePreview = (templateContent: string) => {
    const variables = generateWhatsAppVariables(appointment);
    const processed = processMessageTemplate(templateContent, variables);
    setPreviewMessage(processed);
    setCustomMessage(processed);
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const template = templates?.find(t => t.id === templateId);
    if (template) {
      generatePreview(template.content);
    }
  };

  const handleSendWhatsApp = async () => {
    try {
      // Update appointment status to confirmed
      await updateStatusMutation.mutateAsync({ 
        id: appointment.id, 
        status: 'confirmed' 
      });

      // Create notification
      await createNotificationMutation.mutateAsync({
        type: 'appointment_confirmed',
        title: 'Marcação confirmada via WhatsApp',
        message: `Marcação de ${appointment.client_name} confirmada e mensagem enviada via WhatsApp`,
        appointment_id: appointment.id,
        client_name: appointment.client_name
      });

      // Open WhatsApp with the message
      const phoneNumber = appointment.client_phone.replace(/\D/g, '');
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(customMessage)}`;
      window.open(whatsappUrl, '_blank');
      
      toast({
        title: "WhatsApp aberto",
        description: "A marcação foi confirmada e o WhatsApp foi aberto com a mensagem.",
      });

      setIsOpen(false);
      if (onClose) onClose();
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar a confirmação via WhatsApp.",
        variant: "destructive",
      });
    }
  };

  const handleQuickConfirm = async () => {
    if (!defaultTemplate) {
      toast({
        title: "Erro",
        description: "Nenhum template padrão configurado.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Generate message with default template
      const variables = generateWhatsAppVariables(appointment);
      const message = processMessageTemplate(defaultTemplate.content, variables);

      // Update appointment status
      await updateStatusMutation.mutateAsync({ 
        id: appointment.id, 
        status: 'confirmed' 
      });

      // Create notification
      await createNotificationMutation.mutateAsync({
        type: 'appointment_confirmed',
        title: 'Marcação confirmada via WhatsApp',
        message: `Marcação de ${appointment.client_name} confirmada e mensagem enviada via WhatsApp`,
        appointment_id: appointment.id,
        client_name: appointment.client_name
      });

      // Open WhatsApp
      const phoneNumber = appointment.client_phone.replace(/\D/g, '');
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      
      toast({
        title: "WhatsApp aberto",
        description: "A marcação foi confirmada e o WhatsApp foi aberto com a mensagem pré-definida.",
      });
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar a confirmação via WhatsApp.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="flex space-x-2">
        <Button
          size="sm"
          onClick={handleQuickConfirm}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <MessageCircle className="h-4 w-4 mr-1" />
          Confirmar via WhatsApp
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="text-green-600 hover:text-green-700"
        >
          <Eye className="h-4 w-4 mr-1" />
          Personalizar
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Confirmar via WhatsApp - {appointment.client_name}</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Template de Mensagem</Label>
                <Select value={selectedTemplateId} onValueChange={handleTemplateChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um template..." />
                  </SelectTrigger>
                  <SelectContent>
                    {templates?.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name} {template.is_default && '(Padrão)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Mensagem Personalizada</Label>
                <Textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={12}
                  placeholder="Edite a mensagem conforme necessário..."
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleSendWhatsApp} className="flex-1">
                  <Send className="h-4 w-4 mr-2" />
                  Confirmar e Enviar
                </Button>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Informações da Marcação</Label>
                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                  <p><strong>Cliente:</strong> {appointment.client_name}</p>
                  <p><strong>Telefone:</strong> {appointment.client_phone}</p>
                  <p><strong>Data:</strong> {appointment.appointment_date}</p>
                  <p><strong>Hora:</strong> {appointment.time_slots?.time}</p>
                  <p><strong>Serviços:</strong></p>
                  <ul className="ml-4">
                    {appointment.appointment_services?.map((service: any) => (
                      <li key={service.id}>
                        • {service.services?.name} (€{service.price})
                      </li>
                    ))}
                  </ul>
                  {appointment.total_price && (
                    <p><strong>Total:</strong> €{appointment.total_price}</p>
                  )}
                </div>
              </div>

              <div>
                <Label>Preview da Mensagem</Label>
                <div className="p-4 border rounded-lg bg-white max-h-60 overflow-y-auto">
                  <div className="whitespace-pre-wrap text-sm">
                    {previewMessage}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EnhancedWhatsAppManager;
