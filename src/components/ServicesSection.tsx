
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Clock, Star } from "lucide-react";
import BookingModal from "@/components/BookingSystem/BookingModal";
import type { Tables } from "@/integrations/supabase/types";

interface ServicesSectionProps {
  onBookingClick: () => void;
}

type Service = Tables<'services'>;

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onBookingClick }) => {
  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('order_index');
      
      if (error) throw error;
      return data as Service[];
    }
  });

  if (isLoading) {
    return (
      <section id="services" className="py-20 bg-sage-50">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-darkgreen-800 mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-20 bg-sage-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-darkgreen-900 mb-6">
              <span className="font-tan-mon-cheri">Nossos Serviços</span>
            </h2>
            <p className="text-xl text-forest-600 max-w-3xl mx-auto leading-relaxed">
              Oferecemos uma gama completa de tratamentos de medicina estética, 
              sempre com foco na segurança, naturalidade e satisfação do paciente.
            </p>
          </div>
          
          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {services?.map((service) => (
              <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 border-sage-200 hover:border-darkgreen-300">
                <CardHeader className="pb-4">
                  {service.image_url && (
                    <div className="aspect-video rounded-lg overflow-hidden mb-4">
                      <img 
                        src={service.image_url} 
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-xl text-darkgreen-900 group-hover:text-darkgreen-800 transition-colors">
                      {service.name}
                    </CardTitle>
                    {service.is_featured && (
                      <Badge className="bg-darkgreen-800 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                  </div>
                  
                  {service.short_description && (
                    <p className="text-forest-600 text-sm mb-3">
                      {service.short_description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-darkgreen-800 text-lg">
                      {service.price_range}
                    </span>
                    {service.duration_minutes && (
                      <span className="flex items-center text-forest-600">
                        <Clock className="h-4 w-4 mr-1" />
                        {service.duration_minutes}min
                      </span>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {service.description && (
                    <p className="text-forest-600 text-sm leading-relaxed mb-4">
                      {service.description}
                    </p>
                  )}
                  
                  <BookingModal>
                    <Button 
                      className="w-full bg-darkgreen-800 hover:bg-darkgreen-900 text-white transition-colors"
                      size="sm"
                    >
                      Agendar Consulta
                    </Button>
                  </BookingModal>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold text-darkgreen-900 mb-4">
                Não encontrou o que procura?
              </h3>
              <p className="text-forest-600 mb-6">
                Entre em contacto connosco para uma consulta personalizada e descubra 
                o tratamento ideal para as suas necessidades.
              </p>
              
              <BookingModal>
                <Button 
                  size="lg" 
                  className="bg-darkgreen-800 hover:bg-darkgreen-900 text-white px-8 py-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Consulta Personalizada
                </Button>
              </BookingModal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
