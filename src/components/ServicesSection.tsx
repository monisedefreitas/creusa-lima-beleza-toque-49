
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BookingModal from './BookingSystem/BookingModal';
import { Button } from '@/components/ui/button';
import { Clock, Euro } from 'lucide-react';

const ServicesSection: React.FC = () => {
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('order_index');
      
      if (error) throw error;
      return data;
    }
  });

  const handleServiceClick = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setIsBookingModalOpen(true);
  };

  const handleBookingClose = () => {
    setIsBookingModalOpen(false);
    setSelectedServiceId(null);
  };

  if (isLoading) {
    return (
      <section id="services" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Os Nossos Serviços</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubra os nossos tratamentos especializados
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Os Nossos Serviços</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubra os nossos tratamentos especializados, cada um pensado para realçar a sua beleza natural
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services?.map((service) => (
            <Card 
              key={service.id} 
              className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105"
              onClick={() => handleServiceClick(service.id)}
            >
              {/* Service Image */}
              <div className="aspect-video overflow-hidden bg-gray-100">
                {service.image_url ? (
                  <img
                    src={service.image_url}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <div className="text-4xl mb-2">✨</div>
                      <p className="text-sm">Imagem do procedimento</p>
                    </div>
                  </div>
                )}
              </div>

              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 
                    className="text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleServiceClick(service.id);
                    }}
                  >
                    {service.name}
                  </h3>
                  {service.is_featured && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      Destaque
                    </Badge>
                  )}
                </div>

                {service.short_description && (
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {service.short_description}
                  </p>
                )}

                <div className="flex items-center justify-between mb-4">
                  {service.price_range && (
                    <div className="flex items-center text-primary font-semibold">
                      <Euro className="h-4 w-4 mr-1" />
                      {service.price_range}
                    </div>
                  )}
                  {service.duration_minutes && (
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="h-3 w-3 mr-1" />
                      {service.duration_minutes}min
                    </div>
                  )}
                </div>

                {service.description && (
                  <p className="text-gray-700 text-sm mb-6 leading-relaxed">
                    {service.description}
                  </p>
                )}

                <Button 
                  className="w-full group-hover:bg-primary/90 transition-colors text-lg py-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleServiceClick(service.id);
                  }}
                >
                  Marcar Consulta
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {(!services || services.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum serviço disponível no momento.</p>
          </div>
        )}
      </div>

      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={handleBookingClose}
        preSelectedServiceId={selectedServiceId}
      />
    </section>
  );
};

export default ServicesSection;
