
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Star, Phone, Mail } from 'lucide-react';
import GoogleMap from './GoogleMap';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const LocationSection: React.FC = () => {
  const { data: settings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: contactInfo } = useQuery({
    queryKey: ['contact-info'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .eq('is_active', true)
        .order('order_index');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: addresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('is_active', true)
        .order('order_index');
      
      if (error) throw error;
      return data;
    }
  });

  const getSettingValue = (key: string) => {
    return settings?.find(s => s.key === key)?.value || '';
  };

  const primaryAddress = addresses?.find(addr => addr.is_primary) || addresses?.[0];
  const googleMapsReviewLink = getSettingValue('google_maps_review_link') || 
    'https://www.google.com/search?q=cl%C3%ADnica+medicina+est%C3%A9tica';

  const handleGoogleReview = () => {
    window.open(googleMapsReviewLink, '_blank');
  };

  const getContactByType = (type: string) => {
    return contactInfo?.find(contact => contact.type === type);
  };

  return (
    <section id="location" className="py-16 bg-sage-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-darkgreen-900 mb-4">
            <span className="font-tan-mon-cheri">Visite-nos</span>
          </h2>
          <p className="text-lg text-forest-600 max-w-2xl mx-auto">
            Encontre-nos no coração da cidade, num espaço pensado para o seu bem-estar e relaxamento
          </p>
        </div>
        
        {/* Professional Environment Banner */}
        <div className="bg-gradient-to-r from-darkgreen-800 to-forest-700 p-8 rounded-2xl text-white shadow-xl mb-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 font-tan-mon-cheri">
              Ambiente Acolhedor & Profissional
            </h3>
            <p className="text-sage-100 leading-relaxed mb-6 text-lg">
              Criámos um espaço único onde pode relaxar completamente enquanto recebe 
              tratamentos de excelência. Cada detalhe foi pensado para proporcionar 
              uma experiência de bem-estar inesquecível.
            </p>
            
            <Button 
              onClick={handleGoogleReview}
              className="bg-gold-500 hover:bg-gold-600 text-darkgreen-900 font-semibold px-6 py-3 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Star className="h-5 w-5 mr-2" />
              Avaliar no Google Maps
            </Button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Information Cards */}
          <div className="space-y-6">
            {/* Location Card */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-sage-200">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-darkgreen-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-darkgreen-800" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-darkgreen-900 mb-2">
                    Localização
                  </h3>
                  {primaryAddress ? (
                    <div className="text-forest-600 space-y-1">
                      <p className="font-medium">{primaryAddress.street_address}</p>
                      <p>{primaryAddress.postal_code} {primaryAddress.city}</p>
                      <p>{primaryAddress.country}</p>
                    </div>
                  ) : (
                    <div className="text-forest-600 space-y-1">
                      <p className="font-medium">Rua das Flores, 123</p>
                      <p>1200-123 Lisboa</p>
                      <p>Portugal</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Business Hours Card */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-sage-200">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-darkgreen-100 rounded-lg">
                  <Clock className="h-5 w-5 text-darkgreen-800" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-darkgreen-900 mb-2">
                    Horário de Funcionamento
                  </h3>
                  <div className="space-y-1 text-forest-600 text-sm">
                    <div className="flex justify-between">
                      <span>Segunda a Sexta:</span>
                      <span className="font-medium">9h00 - 19h00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sábado:</span>
                      <span className="font-medium">9h00 - 17h00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Domingo:</span>
                      <span className="font-medium text-red-600">Fechado</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information Card */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-sage-200">
              <h3 className="text-lg font-semibold text-darkgreen-900 mb-4">
                Contacto
              </h3>
              <div className="space-y-3">
                {getContactByType('phone') && (
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 bg-darkgreen-100 rounded-lg">
                      <Phone className="h-4 w-4 text-darkgreen-800" />
                    </div>
                    <div>
                      <p className="text-xs text-forest-500">Telefone</p>
                      <p className="text-forest-700 font-medium">{getContactByType('phone')?.value}</p>
                    </div>
                  </div>
                )}
                {getContactByType('email') && (
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 bg-darkgreen-100 rounded-lg">
                      <Mail className="h-4 w-4 text-darkgreen-800" />
                    </div>
                    <div>
                      <p className="text-xs text-forest-500">Email</p>
                      <p className="text-forest-700 font-medium">{getContactByType('email')?.value}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-sage-200">
            <GoogleMap />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
