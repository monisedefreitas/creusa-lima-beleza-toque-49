
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Calendar, Star } from 'lucide-react';
import BookingModal from '@/components/BookingSystem/BookingModal';
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/lovable-uploads/46b56184-9c80-42e2-9f4b-8fb2bf567b13.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-darkgreen-800/20 to-sage-600/20"></div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Content */}
          <div className={`space-y-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-2 text-white font-medium">
                <Star className="h-5 w-5 fill-current" />
                <span>Especialista em Bem-Estar Natural</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Transforme a sua{' '}
                <span className="text-sage-200">saúde</span>{' '}
                de forma natural
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-3xl mx-auto">
                Descubra tratamentos personalizados e naturais que respeitam o seu corpo 
                e promovem o bem-estar duradouro. A sua jornada para uma vida mais saudável 
                começa aqui.
              </p>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
                className="px-8 py-4 text-lg font-semibold border-2 border-white text-white hover:bg-white hover:text-darkgreen-800 transition-all duration-300"
              >
                <Phone className="h-5 w-5 mr-2" />
                Contactar
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-8 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">15+</div>
                <div className="text-sm text-gray-200">Anos de Experiência</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">1000+</div>
                <div className="text-sm text-gray-200">Clientes Satisfeitos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">100%</div>
                <div className="text-sm text-gray-200">Natural</div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Card - Now positioned differently for the new layout */}
        <div className={`absolute bottom-10 right-10 bg-white p-6 rounded-xl shadow-xl border border-gray-100 max-w-xs hidden lg:block ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
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
