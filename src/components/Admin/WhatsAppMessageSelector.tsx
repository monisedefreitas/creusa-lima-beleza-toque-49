
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Edit3, Sparkles } from 'lucide-react';
import { useMessageTemplates } from '@/hooks/useMessageTemplates';
import { getVariableDescriptions, processMessageTemplate } from '@/utils/messageTemplates';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface WhatsAppMessageSelectorProps {
  appointment: any;
  onSend: (message: string, type: string) => void;
  isOpen: boolean;
  onClose?: () => void;
}

const WhatsAppMessageSelector: React.FC<WhatsAppMessageSelectorProps> = ({
  appointment,
  onSend,
  isOpen,
  onClose
}) => {
  const [selectedType, setSelectedType] = useState<string>('confirmation');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [isCustom, setIsCustom] = useState(false);
  
  const { data: templates } = useMessageTemplates();
  const variableDescriptions = getVariableDescriptions();

  const messageTypes = [
    { value: 'confirmation', label: 'Confirmação de Marcação', icon: '✅' },
    { value: 'reminder', label: 'Lembrete de Marcação', icon: '🔔' },
    { value: 'reschedule', label: 'Reagendamento', icon: '📅' },
    { value: 'completion', label: 'Agradecimento', icon: '✨' },
    { value: 'review_request', label: 'Pedido de Avaliação', icon: '⭐' },
    { value: 'cancellation', label: 'Cancelamento', icon: '❌' }
  ];

  const getTemplateVariables = () => {
    const appointmentDate = appointment?.appointment_date 
      ? format(new Date(appointment.appointment_date), 'dd/MM/yyyy', { locale: pt })
      : 'Data não definida';
    
    const appointmentTime = appointment?.time_slots?.time || 'Hora não definida';
    
    const servicesList = appointment?.appointment_services?.map((service: any) => 
      service.services?.name || service.service_name
    ).join(', ') || 'Serviços não especificados';

    return {
      client_name: appointment?.client_name || 'Cliente',
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      services_list: servicesList,
      total_price: appointment?.total_price?.toString() || '0',
      clinic_name: 'Creusa Lima Estética',
      clinic_phone: '+351 964 481 966',
      clinic_address: 'Rua Principal, 123',
      new_date: appointment?.new_date || appointmentDate,
      new_time: appointment?.new_time || appointmentTime
    };
  };

  const getDefaultTemplate = () => {
    const template = templates?.find(t => t.type === `whatsapp_${selectedType}` && t.is_default);
    if (template) {
      return processMessageTemplate(template.content, getTemplateVariables());
    }

    // Fallback templates
    const variables = getTemplateVariables();
    const fallbackTemplates: Record<string, string> = {
      confirmation: `🌟 Olá ${variables.client_name}!

✅ A sua marcação foi confirmada:
📅 Data: ${variables.appointment_date}
🕐 Hora: ${variables.appointment_time}
💅 Serviço: ${variables.services_list}
💰 Valor: €${variables.total_price}

📍 Localização: ${variables.clinic_address}

Em caso de dúvidas, contacte-nos através do ${variables.clinic_phone}.

Até breve! 💖`,

      reminder: `🔔 Lembrete da sua consulta

Olá ${variables.client_name}! 

Lembramos que tem uma consulta marcada para amanhã:
📅 ${variables.appointment_date} às ${variables.appointment_time}
💅 Serviço: ${variables.services_list}

📍 ${variables.clinic_address}

Caso necessite reagendar, contacte-nos pelo ${variables.clinic_phone}.

Até amanhã! ✨`,

      reschedule: `📅 Marcação Reagendada

Olá ${variables.client_name}!

A sua consulta foi reagendada com sucesso:

🔄 Nova data: ${variables.new_date}
🕐 Nova hora: ${variables.new_time}
💅 Serviço: ${variables.services_list}

📍 Local: ${variables.clinic_address}

Obrigada pela compreensão!

${variables.clinic_name}
${variables.clinic_phone}`,

      completion: `✨ Obrigada pela sua visita!

Olá ${variables.client_name}! 

Esperamos que tenha ficado satisfeita com o nosso serviço de ${variables.services_list}! 

🌟 A sua opinião é muito importante para nós!

Até à próxima! 💖

${variables.clinic_name}
${variables.clinic_phone}`,

      review_request: `⭐ A sua opinião é importante!

Olá ${variables.client_name}! 

Esperamos que tenha ficado satisfeita com o nosso serviço de ${variables.services_list}! 

🌟 Adoraríamos conhecer a sua experiência connosco.
📝 Pode partilhar a sua opinião no Google ou nas nossas redes sociais.

A sua avaliação ajuda-nos a melhorar sempre! 💖

${variables.clinic_name}
${variables.clinic_phone}`,

      cancellation: `❌ Marcação Cancelada

Olá ${variables.client_name},

A sua marcação do dia ${variables.appointment_date} às ${variables.appointment_time} foi cancelada.

Se desejar reagendar, contacte-nos pelo ${variables.clinic_phone}.

Obrigada pela compreensão! 

${variables.clinic_name}`
    };

    return fallbackTemplates[selectedType] || `Olá ${variables.client_name}, obrigada por escolher os nossos serviços!`;
  };

  useEffect(() => {
    if (!isCustom) {
      setCustomMessage(getDefaultTemplate());
    }
  }, [selectedType, isCustom, templates]);

  const handleSend = () => {
    onSend(customMessage, selectedType);
  };

  const selectedTypeInfo = messageTypes.find(type => type.value === selectedType);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Enviar Mensagem WhatsApp
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Client Info */}
          <div className="bg-sage-50 p-4 rounded-lg">
            <h3 className="font-semibold text-sm text-gray-700 mb-2">Cliente:</h3>
            <p className="font-medium">{appointment?.client_name}</p>
            <p className="text-sm text-gray-600">{appointment?.client_phone}</p>
            <p className="text-xs text-gray-500 mt-1">
              {format(new Date(appointment?.appointment_date), 'PPP', { locale: pt })} às {appointment?.time_slots?.time}
            </p>
          </div>

          {/* Message Type Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Tipo de Mensagem:</label>
              <Button
                variant={isCustom ? "default" : "outline"}
                size="sm"
                onClick={() => setIsCustom(!isCustom)}
              >
                <Edit3 className="w-4 h-4 mr-1" />
                {isCustom ? "Usar Template" : "Personalizar"}
              </Button>
            </div>
            
            {!isCustom && (
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {messageTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <span>{type.icon}</span>
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {selectedTypeInfo && !isCustom && (
              <Badge variant="outline" className="w-fit">
                {selectedTypeInfo.icon} {selectedTypeInfo.label}
              </Badge>
            )}
          </div>

          {/* Message Preview/Editor */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Mensagem:</label>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Sparkles className="w-3 h-3" />
                <span>Variáveis processadas automaticamente</span>
              </div>
            </div>
            
            <Textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="min-h-[200px] resize-none"
              placeholder="Digite sua mensagem personalizada..."
              readOnly={!isCustom}
            />
            
            <p className="text-xs text-gray-500">
              {customMessage.length} caracteres
            </p>
          </div>

          {/* Available Variables Info */}
          {isCustom && (
            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
              <h4 className="text-sm font-semibold text-blue-900">Variáveis Disponíveis:</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(variableDescriptions).map(([key, description]) => (
                  <div key={key} className="flex flex-col">
                    <code className="text-blue-700 font-mono">{`{{${key}}}`}</code>
                    <span className="text-blue-600">{description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button 
              onClick={handleSend} 
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              disabled={!customMessage.trim()}
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppMessageSelector;
