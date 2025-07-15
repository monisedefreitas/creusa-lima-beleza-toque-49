
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Phone, Calendar, Clock, CheckCircle } from 'lucide-react';
import { trackWhatsAppClick, trackBookingIntent } from '@/components/Analytics/GoogleAnalytics';

interface WhatsAppService {
  id: string;
  name: string;
  template: string;
  icon: React.ReactNode;
  category: string;
}

const EnhancedWhatsApp: React.FC = () => {
  const [selectedService, setSelectedService] = useState<WhatsAppService | null>(null);

  const services: WhatsAppService[] = [
    {
      id: 'linfoterapia',
      name: 'Linfoterapia',
      template: 'Olá! Gostaria de agendar uma sessão de linfoterapia. Poderia indicar-me a disponibilidade?',
      icon: <CheckCircle className="w-4 h-4" />,
      category: 'Especialidade'
    },
    {
      id: 'pos-operatorio',
      name: 'Pós-Operatório',
      template: 'Olá! Preciso de drenagem linfática pós-operatória. Quando seria possível agendar?',
      icon: <CheckCircle className="w-4 h-4" />,
      category: 'Especialidade'
    },
    {
      id: 'radiofrequencia',
      name: 'Radiofrequência',
      template: 'Olá! Tenho interesse em tratamentos de radiofrequência. Gostaria de saber mais informações.',
      icon: <CheckCircle className="w-4 h-4" />,
      category: 'Tecnologia'
    },
    {
      id: 'hifu',
      name: 'HIFU',
      template: 'Olá! Gostaria de informações sobre o tratamento HIFU. Qual seria o investimento?',
      icon: <CheckCircle className="w-4 h-4" />,
      category: 'Tecnologia'
    },
    {
      id: 'massagem-gestante',
      name: 'Massagem Gestante',
      template: 'Olá! Estou grávida e gostaria de agendar uma massagem especializada para gestantes.',
      icon: <CheckCircle className="w-4 h-4" />,
      category: 'Cuidados Especiais'
    },
    {
      id: 'geral',
      name: 'Consulta Geral',
      template: 'Olá! Gostaria de agendar uma consulta para avaliação personalizada dos meus tratamentos.',
      icon: <MessageSquare className="w-4 h-4" />,
      category: 'Geral'
    }
  ];

  const handleWhatsAppClick = (service?: WhatsAppService) => {
    trackWhatsAppClick();
    trackBookingIntent();
    
    const phoneNumber = '351964481966';
    const message = service ? service.template : 'Olá! Gostaria de mais informações sobre os vossos serviços.';
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCallbackRequest = () => {
    const phoneNumber = '351964481966';
    const message = 'Olá! Gostaria de solicitar uma chamada de retorno. Qual seria o melhor horário para me contactarem?';
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const groupedServices = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, WhatsAppService[]>);

  return (
    <div className="space-y-4">
      {/* Quick Contact Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={() => handleWhatsAppClick()}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          WhatsApp
        </Button>
        
        <Button
          variant="outline"
          onClick={handleCallbackRequest}
          className="flex-1"
        >
          <Phone className="w-4 h-4 mr-2" />
          Solicitar Chamada
        </Button>
      </div>

      {/* Service-Specific Templates */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <Calendar className="w-4 h-4 mr-2" />
            Agendar Serviço Específico
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Escolha o Serviço para Agendar
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {Object.entries(groupedServices).map(([category, categoryServices]) => (
              <div key={category}>
                <h3 className="font-semibold text-lg mb-3 text-darkgreen-900">
                  {category}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categoryServices.map((service) => (
                    <Card 
                      key={service.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleWhatsAppClick(service)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              {service.icon}
                            </div>
                            <span className="font-medium">{service.name}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Agendar
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-sage-50 rounded-lg">
            <div className="flex items-center text-sm text-forest-600">
              <Clock className="w-4 h-4 mr-2" />
              <span>Resposta típica em menos de 2 horas durante horário comercial</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedWhatsApp;
