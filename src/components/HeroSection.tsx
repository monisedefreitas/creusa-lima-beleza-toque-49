
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Calendar, Star } from 'lucide-react';
import BookingModal from '@/components/BookingSystem/BookingModal';
import LazyImage from '@/components/Performance/LazyImage';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const HeroSection: React.FC = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { elementRef, isVisible } = useScrollAnimation();

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <section 
      ref={elementRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-sage-50 to-white"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-darkgreen-800 to-sage-600"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className={`space-y-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-darkgreen-800 font-medium">
                <Star className="h-5 w-5 fill-current" />
                <span>Especialista em Bem-Estar Natural</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Transforme a sua{' '}
                <span className="text-darkgreen-800">saúde</span>{' '}
                de forma natural
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Descubra tratamentos personalizados e naturais que respeitam o seu corpo 
                e promovem o bem-estar duradouro. A sua jornada para uma vida mais saudável 
                começa aqui.
              </p>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => setIsBookingModalOpen(true)}
                size="lg"
                className="bg-darkgreen-800 hover:bg-darkgreen-900 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Marcar Consulta
              </Button>
              
              <Button
                onClick={scrollToContact}
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg font-semibold border-darkgreen-800 text-darkgreen-800 hover:bg-darkgreen-800 hover:text-white transition-all duration-300"
              >
                <Phone className="h-5 w-5 mr-2" />
                Contactar
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-8 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-darkgreen-800">15+</div>
                <div className="text-sm text-gray-600">Anos de Experiência</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-darkgreen-800">1000+</div>
                <div className="text-sm text-gray-600">Clientes Satisfeitos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-darkgreen-800">100%</div>
                <div className="text-sm text-gray-600">Natural</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className={`relative ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
            <div className="relative">
              <LazyImage
                src="/lovable-uploads/46b56184-9c80-42e2-9f4b-8fb2bf567b13.png"
                alt="Creusa Lima - Especialista em Bem-Estar Natural"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-darkgreen-800 rounded-full flex items-center justify-center">
                    <Star className="h-6 w-6 text-white fill-current" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Avaliação 5★</div>
                    <div className="text-sm text-gray-600">Baseado em 200+ avaliações</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal>
        <div style={{ display: 'none' }} />
      </BookingModal>
      
      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Marcar Consulta</h3>
            <p className="text-gray-600 mb-4">
              Para marcar a sua consulta, por favor contacte-nos através do WhatsApp ou telefone.
            </p>
            <Button
              onClick={() => setIsBookingModalOpen(false)}
              className="w-full"
            >
              Fechar
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
