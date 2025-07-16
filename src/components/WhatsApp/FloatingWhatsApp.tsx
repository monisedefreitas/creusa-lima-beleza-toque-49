
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  MessageSquare, 
  Phone, 
  Calendar, 
  Clock, 
  CheckCircle,
  X,
  Send
} from 'lucide-react';
import { trackWhatsAppClick, trackBookingIntent } from '@/components/Analytics/GoogleAnalytics';

interface WhatsAppService {
  id: string;
  name: string;
  template: string;
  icon: React.ReactNode;
  category: string;
}

const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

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
    setIsOpen(false);
  };

  const handleCallbackRequest = () => {
    const phoneNumber = '351964481966';
    const message = 'Olá! Gostaria de solicitar uma chamada de retorno. Qual seria o melhor horário para me contactarem?';
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const groupedServices = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, WhatsAppService[]>);

  const categories = Object.keys(groupedServices);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full w-16 h-16 shadow-2xl hover:scale-110 transition-all duration-300 animate-pulse"
          size="icon"
        >
          <MessageSquare className="h-8 w-8" />
        </Button>
      </div>

      {/* Chat Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-hidden p-0 gap-0">
          {/* Header */}
          <DialogHeader className="bg-green-600 text-white p-4 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <DialogTitle className="text-white text-lg">WhatsApp</DialogTitle>
                  <p className="text-green-100 text-sm">Como podemos ajudar?</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
            {/* Quick Actions */}
            <div className="space-y-2">
              <Button
                onClick={() => handleWhatsAppClick()}
                className="w-full justify-start bg-green-50 hover:bg-green-100 text-green-800 border border-green-200"
                variant="outline"
              >
                <MessageSquare className="w-4 h-4 mr-3" />
                Contacto Geral
              </Button>
              
              <Button
                onClick={handleCallbackRequest}
                className="w-full justify-start bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200"
                variant="outline"
              >
                <Phone className="w-4 h-4 mr-3" />
                Solicitar Chamada
              </Button>
            </div>

            {/* Category Navigation */}
            {!selectedCategory && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 text-sm">Agendar Serviço Específico:</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className="w-full justify-start text-left"
                      variant="outline"
                    >
                      <Calendar className="w-4 h-4 mr-3 flex-shrink-0" />
                      <span className="truncate">{category}</span>
                      <Badge variant="secondary" className="ml-auto">
                        {groupedServices[category].length}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Services List */}
            {selectedCategory && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 text-sm">{selectedCategory}</h3>
                  <Button
                    onClick={() => setSelectedCategory('')}
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                  >
                    Voltar
                  </Button>
                </div>
                <div className="space-y-2">
                  {groupedServices[selectedCategory].map((service) => (
                    <Button
                      key={service.id}
                      onClick={() => handleWhatsAppClick(service)}
                      className="w-full justify-start text-left p-3 h-auto"
                      variant="outline"
                    >
                      <div className="flex items-center space-x-3 w-full">
                        <div className="p-1.5 bg-green-100 rounded-lg flex-shrink-0">
                          {service.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{service.name}</div>
                        </div>
                        <Send className="w-3 h-3 text-green-600 flex-shrink-0" />
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Info */}
            <div className="mt-6 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center text-xs text-gray-600">
                <Clock className="w-3 h-3 mr-2" />
                <span>Resposta típica em menos de 2 horas durante horário comercial</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingWhatsApp;
