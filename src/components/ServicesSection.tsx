
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Clock, Star, ArrowRight, Sparkles } from "lucide-react";
import BookingModal from "@/components/BookingSystem/BookingModal";
import type { Tables } from "@/integrations/supabase/types";

interface ServicesSectionProps {
  onBookingClick: () => void;
}

type Service = Tables<'services'>;
type Banner = Tables<'banners'>;

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onBookingClick }) => {
  const { data: services, isLoading: servicesLoading } = useQuery({
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

  const { data: banners, isLoading: bannersLoading } = useQuery({
    queryKey: ['services-banners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .eq('position', 'services')
        .order('order_index');
      
      if (error) throw error;
      return data as Banner[];
    }
  });

  if (servicesLoading) {
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

          {/* Services Banners */}
          {!bannersLoading && banners && banners.length > 0 && (
            <div className="mb-16">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {banners.map((banner) => (
                  <Card key={banner.id} className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-white to-sage-50">
                    {banner.image_url ? (
                      <div className="aspect-video relative overflow-hidden">
                        <img 
                          src={banner.image_url} 
                          alt={banner.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
                          <div className="p-6 text-white w-full">
                            <div className="flex items-center space-x-2 mb-2">
                              <Sparkles className="h-5 w-5 text-yellow-400" />
                              <h3 className="text-xl font-bold">{banner.title}</h3>
                            </div>
                            {banner.subtitle && (
                              <p className="text-sm opacity-90 mb-3">{banner.subtitle}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-video relative bg-gradient-to-br from-darkgreen-600 to-forest-700 flex items-center justify-center">
                        <div className="text-center text-white p-6">
                          <Sparkles className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
                          <h3 className="text-2xl font-bold mb-2">{banner.title}</h3>
                          {banner.subtitle && (
                            <p className="text-sm opacity-90">{banner.subtitle}</p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {banner.description && (
                      <CardContent className="p-6">
                        <p className="text-forest-600 text-sm leading-relaxed mb-4">{banner.description}</p>
                        {banner.button_text && banner.button_link ? (
                          <Button 
                            className="w-full bg-darkgreen-800 hover:bg-darkgreen-900 text-white font-semibold group"
                            onClick={() => window.open(banner.button_link, '_blank')}
                          >
                            {banner.button_text}
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        ) : (
                          <BookingModal>
                            <Button className="w-full bg-darkgreen-800 hover:bg-darkgreen-900 text-white font-semibold group">
                              Agendar Consulta
                              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </BookingModal>
                        )}
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Message when no banners exist */}
          {!bannersLoading && (!banners || banners.length === 0) && (
            <div className="mb-12 text-center">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg border border-sage-200 max-w-2xl mx-auto">
                <Sparkles className="h-8 w-8 text-darkgreen-800 mx-auto mb-3" />
                <p className="text-forest-600 text-sm">
                  Os banners de promoções e destaques aparecerão aqui quando forem adicionados pelo administrador.
                </p>
              </div>
            </div>
          )}
          
          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {services?.map((service) => (
              <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 border-sage-200 hover:border-darkgreen-300 bg-white">
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
                      className="w-full bg-darkgreen-800 hover:bg-darkgreen-900 text-white transition-colors group"
                      size="sm"
                    >
                      Agendar Consulta
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </BookingModal>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto border border-sage-200">
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
                  className="bg-darkgreen-800 hover:bg-darkgreen-900 text-white px-8 py-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
                >
                  Consulta Personalizada
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </BookingModal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
