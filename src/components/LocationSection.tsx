
import * as React from 'react';
import { MapPin, Clock, Phone, Mail } from 'lucide-react';
import GoogleMap from '@/components/GoogleMap';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const LocationSection: React.FC = () => {
  const { data: contactInfo } = useQuery({
    queryKey: ['contact-info-location'],
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
    queryKey: ['addresses-location'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('is_active', true)
        .order('is_primary', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const getContactByType = (type: string) => {
    return contactInfo?.find(contact => contact.type === type);
  };

  const primaryAddress = addresses?.find(addr => addr.is_primary) || addresses?.[0];

  return (
    <section id="contact" className="py-16 bg-gradient-to-br from-white to-sage-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-darkgreen-800 mb-6">
            Onde Nos Encontrar
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Visite-nos no nosso espaço em Carcavelos para uma consulta personalizada
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Information */}
          <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-sage-100">
              <h3 className="text-2xl font-bold text-darkgreen-800 mb-6 flex items-center gap-3">
                <MapPin className="w-8 h-8 text-sage-600" />
                Informações de Contacto
              </h3>
              
              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-sage-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-darkgreen-800 mb-2">Endereço</h4>
                    <p className="text-gray-600 leading-relaxed">
                      {primaryAddress?.street_address || 'R. Fernando Lopes Graça, 379 B'}<br />
                      {primaryAddress?.postal_code || '2775-571'} {primaryAddress?.city || 'Carcavelos'}<br />
                      {primaryAddress?.country || 'Portugal'}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-sage-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-darkgreen-800 mb-2">Telefone</h4>
                    <p className="text-gray-600">
                      {getContactByType('phone')?.value || '+351 964 481 966'}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-sage-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-darkgreen-800 mb-2">Email</h4>
                    <p className="text-gray-600">
                      {getContactByType('email')?.value || 'Limadesouzacreusa@gmail.com'}
                    </p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-sage-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-darkgreen-800 mb-2">Horários</h4>
                    <div className="text-gray-600 space-y-1">
                      <p>Segunda à Sexta: 09:00 - 18:00</p>
                      <p>Sábado: 09:00 - 18:00</p>
                      <p className="text-red-500">Domingo: Fechado</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <GoogleMap className="w-full" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
