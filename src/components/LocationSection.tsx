
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Star } from 'lucide-react';
import GoogleMap from './GoogleMap';

const LocationSection: React.FC = () => {
  const handleGoogleReview = () => {
    // Replace with actual Google Maps review link
    window.open('https://g.page/r/CdQjW8CjW8CjEBM/review', '_blank');
  };

  return (
    <section id="location" className="py-20 bg-sage-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-darkgreen-900 mb-4">
            Visite-nos
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Encontre-nos no coração da cidade, num espaço pensado para o seu bem-estar e relaxamento
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Location Info */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-start space-x-4">
                <MapPin className="h-6 w-6 text-sage-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-darkgreen-900 mb-2">
                    Localização
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Rua das Flores, 123<br />
                    1200-123 Lisboa<br />
                    Portugal
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-start space-x-4">
                <Clock className="h-6 w-6 text-sage-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-darkgreen-900 mb-2">
                    Horário de Funcionamento
                  </h3>
                  <div className="space-y-1 text-gray-600">
                    <p>Segunda a Sexta: 9h00 - 19h00</p>
                    <p>Sábado: 9h00 - 17h00</p>
                    <p>Domingo: Fechado</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Full-width Professional Environment Section */}
            <div className="bg-gradient-to-r from-sage-600 to-forest-700 p-8 rounded-2xl text-white shadow-lg">
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
                className="bg-white text-sage-700 hover:bg-sage-50 font-semibold"
              >
                <Star className="h-4 w-4 mr-2" />
                Avaliar Atendimento
              </Button>
            </div>
          </div>

          {/* Map */}
          <div className="bg-white p-4 rounded-2xl shadow-lg">
            <GoogleMap />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
