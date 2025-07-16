
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Copy, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface WhatsAppMessageSelectorProps {
  isOpen?: boolean;
  onClose?: () => void;
  appointment: {
    id: string;
    client_name: string;
    client_phone: string;
    appointment_date: string;
    time_slots?: { time: string };
    appointment_services?: Array<{
      services?: { name: string };
    }>;
    total_price?: number;
  };
  onSend?: (message: string, type: string) => Promise<void>;
}

const WhatsAppMessageSelector: React.FC<WhatsAppMessageSelectorProps> = ({
  isOpen = true,
  onClose,
  appointment,
  onSend
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const messageTemplates = {
    confirmation: {
      title: 'Confirmação de Marcação',
      description: 'Confirmar que a marcação foi aceite',
      template: `Olá ${appointment.client_name}! ✅

A sua marcação foi CONFIRMADA:

📅 Data: ${format(new Date(appointment.appointment_date), 'dd/MM/yyyy', { locale: pt })}
🕒 Hora: ${appointment.time_slots?.time || 'N/A'}
💆‍♀️ Serviços: ${appointment.appointment_services?.map(s => s.services?.name).join(', ') || 'N/A'}
💰 Valor: €${appointment.total_price || 'A definir'}

Estamos ansiosos por recebê-la!
Se tiver alguma dúvida, não hesite em contactar.

Obrigado! 🙏`
    },
    reminder: {
      title: 'Lembrete de Marcação',
      description: 'Lembrar o cliente da marcação próxima',
      template: `Olá ${appointment.client_name}! 👋

Este é um lembrete da sua marcação:

📅 Data: ${format(new Date(appointment.appointment_date), 'dd/MM/yyyy', { locale: pt })}
🕒 Hora: ${appointment.time_slots?.time || 'N/A'}
💆‍♀️ Serviços: ${appointment.appointment_services?.map(s => s.services?.name).join(', ') || 'N/A'}

Por favor confirme a sua presença.
Aguardamos por si! ✨`
    },
    cancellation: {
      title: 'Cancelamento de Marcação',
      description: 'Informar sobre o cancelamento',
      template: `Olá ${appointment.client_name}! 😔

Lamentamos informar que a sua consulta foi cancelada:

📅 **Consulta cancelada:**
• **Data:** ${format(new Date(appointment.appointment_date), 'dd/MM/yyyy', { locale: pt })}
• **Hora:** ${appointment.time_slots?.time || 'N/A'}
• **Serviço:** ${appointment.appointment_services?.map(s => s.services?.name).join(', ') || 'N/A'}

💡 **Para reagendar:**
Por favor contacte-nos para marcar uma nova data que seja conveniente para si.

Pedimos desculpa por qualquer inconveniente causado.

Com os melhores cumprimentos! 💚`
    },
    reschedule: {
      title: 'Reagendamento',
      description: 'Propor novo agendamento',
      template: `Olá ${appointment.client_name}! 📅

Precisamos de reagendar a sua marcação do dia ${format(new Date(appointment.appointment_date), 'dd/MM/yyyy', { locale: pt })}.

Por favor entre em contacto para escolhermos uma nova data que seja conveniente para si.

Obrigado pela compreensão! 🙏`
    },
    reminder_24h: {
      title: 'Lembrete 24h',
      description: 'Lembrete enviado 24 horas antes',
      template: `Olá ${appointment.client_name}! 🔔

**Lembrete: Consulta amanhã!**

📅 **Detalhes da sua consulta:**
• **Data:** ${format(new Date(appointment.appointment_date), 'dd/MM/yyyy', { locale: pt })}
• **Hora:** ${appointment.time_slots?.time || 'N/A'}
• **Serviço:** ${appointment.appointment_services?.map(s => s.services?.name).join(', ') || 'N/A'}

💡 **Preparação:**
• Vista roupa confortável
• Chegue 10 minutos mais cedo
• Traga documento de identificação

Se tiver alguma dúvida ou imprevisto, contacte-nos!

Até amanhã! ✨`
    }
  };

  const handleSendMessage = async (templateKey: string) => {
    const template = messageTemplates[templateKey as keyof typeof messageTemplates];
    
    if (onSend) {
      await onSend(template.template, templateKey);
    } else {
      // Fallback para abrir WhatsApp diretamente
      const message = encodeURIComponent(template.template);
      const phoneNumber = appointment.client_phone.replace(/[^0-9]/g, '');
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
      window.open(whatsappUrl, '_blank');
    }
    
    if (onClose) onClose();
  };

  const copyToClipboard = (templateKey: string) => {
    const template = messageTemplates[templateKey as keyof typeof messageTemplates];
    navigator.clipboard.writeText(template.template);
  };

  if (!isOpen && isOpen !== undefined) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Enviar Mensagem WhatsApp
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Detalhes da Marcação:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Cliente:</strong> {appointment.client_name}</p>
              <p><strong>Telefone:</strong> {appointment.client_phone}</p>
              <p><strong>Data:</strong> {format(new Date(appointment.appointment_date), 'dd/MM/yyyy', { locale: pt })}</p>
              <p><strong>Hora:</strong> {appointment.time_slots?.time || 'N/A'}</p>
              <p><strong>Serviços:</strong> {appointment.appointment_services?.map(s => s.services?.name).join(', ') || 'N/A'}</p>
            </div>
          </div>

          <div className="grid gap-4">
            <h3 className="font-medium text-gray-900">Selecione o tipo de mensagem:</h3>
            
            {Object.entries(messageTemplates).map(([key, template]) => (
              <Card key={key} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{template.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      
                      <div className="bg-gray-50 p-3 rounded text-xs font-mono text-gray-700 max-h-32 overflow-y-auto">
                        {template.template}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(key)}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copiar
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSendMessage(key)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Enviar WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppMessageSelector;
