
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
    <section id="location" className="py-20 bg-sage-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-darkgreen-900 mb-4">
            <span className="font-tan-mon-cheri">Visite-nos</span>
          </h2>
          <p className="text-lg text-forest-600 max-w-2xl mx-auto">
            Encontre-nos no coração da cidade, num espaço pensado para o seu bem-estar e relaxamento
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Location Info */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-sage-200">
              <div className="flex items-start space-x-4">
                <MapPin className="h-6 w-6 text-darkgreen-800 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-darkgreen-900 mb-2">
                    Localização
                  </h3>
                  {primaryAddress ? (
                    <p className="text-forest-600 leading-relaxed">
                      {primaryAddress.street_address}<br />
                      {primaryAddress.postal_code} {primaryAddress.city}<br />
                      {primaryAddress.country}
                    </p>
                  ) : (
                    <p className="text-forest-600 leading-relaxed">
                      Rua das Flores, 123<br />
                      1200-123 Lisboa<br />
                      Portugal
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-sage-200">
              <div className="flex items-start space-x-4">
                <Clock className="h-6 w-6 text-darkgreen-800 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-darkgreen-900 mb-2">
                    Horário de Funcionamento
                  </h3>
                  <div className="space-y-1 text-forest-600">
                    <p>Segunda a Sexta: 9h00 - 19h00</p>
                    <p>Sábado: 9h00 - 17h00</p>
                    <p>Domingo: Fechado</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-sage-200">
              <h3 className="text-xl font-semibold text-darkgreen-900 mb-4">
                Contacto
              </h3>
              <div className="space-y-3">
                {getContactByType('phone') && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-darkgreen-800" />
                    <span className="text-forest-600">{getContactByType('phone')?.value}</span>
                  </div>
                )}
                {getContactByType('email') && (
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-darkgreen-800" />
                    <span className="text-forest-600">{getContactByType('email')?.value}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Professional Environment Section */}
            <div className="bg-gradient-to-r from-darkgreen-800 to-forest-700 p-8 rounded-2xl text-white shadow-lg">
              <h3 className="text-2xl font-bold mb-4">
                Ambiente Acolhedor & Profissional
              </h3>
              <p className="text-sage-100 leading-relaxed mb-6">
                Criámos um espaço único onde pode relaxar completamente enquanto recebe 
                tratamentos de excelência. Cada detalhe foi pensado para proporcionar 
                uma experiência de bem-estar inesquecível.
              </p>
              
              {/* Rating Button */}
              <Button 
                onClick={handleGoogleReview}
                className="bg-white text-darkgreen-800 hover:bg-sage-50 font-semibold transition-colors"
              >
                <Star className="h-4 w-4 mr-2" />
                Avaliar no Google Maps
              </Button>
            </div>
          </div>

          {/* Map */}
          <div className="bg-white p-4 rounded-2xl shadow-lg border border-sage-200">
            <GoogleMap />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
