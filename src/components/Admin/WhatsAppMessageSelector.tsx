
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
import { useMessageTemplates } from '@/hooks/useMessageTemplates';
import { 
  processMessageTemplate, 
  generateWhatsAppVariables 
} from '@/utils/messageTemplates';

interface WhatsAppMessageSelectorProps {
  appointment: any;
  onSend: (message: string, type: string) => void;
}

const WhatsAppMessageSelector: React.FC<WhatsAppMessageSelectorProps> = ({ 
  appointment, 
  onSend 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('whatsapp_confirmation');
  const [customMessage, setCustomMessage] = useState('');
  const [previewMessage, setPreviewMessage] = useState('');
  
  const { data: templates } = useMessageTemplates();

  const messageTypes = [
    { value: 'whatsapp_confirmation', label: 'Confirmação de Marcação' },
    { value: 'whatsapp_arrival_confirmation', label: 'Confirmação de Vinda da Cliente' },
    { value: 'whatsapp_review_request', label: 'Pedido de Avaliação no Google Maps' },
    { value: 'custom', label: 'Mensagem Personalizada' }
  ];

  React.useEffect(() => {
    if (selectedType !== 'custom') {
      const template = templates?.find(t => t.type === selectedType && t.is_default);
      if (template) {
        const variables = generateWhatsAppVariables(appointment);
        const processed = processMessageTemplate(template.content, variables);
        setPreviewMessage(processed);
        setCustomMessage(processed);
      }
    } else {
      setPreviewMessage('');
      setCustomMessage('');
    }
  }, [selectedType, templates, appointment]);

  const handleSend = () => {
    onSend(customMessage, selectedType);
    setIsOpen(false);
  };

  const getDefaultMessage = (type: string) => {
    const messages = {
      whatsapp_confirmation: `Olá ${appointment.client_name}!\n\nA sua marcação foi confirmada para o dia ${appointment.appointment_date} às ${appointment.time_slots?.time}.\n\nServiços agendados:\n${appointment.appointment_services?.map((s: any) => `• ${s.services?.name}`).join('\n')}\n\nAguardamos por si!\n\nObrigada! 🌿`,
      whatsapp_arrival_confirmation: `Olá ${appointment.client_name}!\n\nEsperamos por si amanhã, dia ${appointment.appointment_date} às ${appointment.time_slots?.time}, para o seu tratamento.\n\nPor favor confirme a sua presença respondendo a esta mensagem.\n\nObrigada! 🌿`,
      whatsapp_review_request: `Olá ${appointment.client_name}!\n\nEsperamos que tenha ficado satisfeita com o seu tratamento.\n\nA sua opinião é muito importante para nós! Poderia deixar uma avaliação no nosso Google Maps?\n\nMuito obrigada! ⭐`,
      custom: ''
    };
    return messages[type as keyof typeof messages] || '';
  };

  return (
    <>
      <Button
        size="sm"
        onClick={() => setIsOpen(true)}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        <MessageCircle className="h-4 w-4 mr-1" />
        WhatsApp
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Enviar Mensagem WhatsApp - {appointment.client_name}</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Tipo de Mensagem</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {messageTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Mensagem</Label>
                <Textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={12}
                  placeholder={selectedType === 'custom' ? 'Digite sua mensagem personalizada...' : 'Edite a mensagem conforme necessário...'}
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleSend} className="flex-1">
                  <Send className="h-4 w-4 mr-2" />
                  Enviar WhatsApp
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

              {previewMessage && (
                <div>
                  <Label>Preview da Mensagem</Label>
                  <div className="p-4 border rounded-lg bg-white max-h-60 overflow-y-auto">
                    <div className="whitespace-pre-wrap text-sm">
                      {previewMessage}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WhatsAppMessageSelector;
