import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';
import BookingModal from '@/components/BookingSystem/BookingModal';

interface HeroSectionProps {
  onBookingClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onBookingClick }) => {
  const handleScrollToAbout = () => {
    const aboutSection = document.getElementById('sobre');
    if (aboutSection) {
      aboutSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="/lovable-uploads/46b56184-9c80-42e2-9f4b-8fb2bf567b13.png"
          alt="Creusa Lima - Especialista em Estética"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-darkgreen-900/85 via-darkgreen-800/70 to-darkgreen-900/60"></div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 opacity-20 animate-float">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-sage-200/50 to-gold-200/50"></div>
      </div>
      <div className="absolute bottom-20 right-10 opacity-20 animate-float" style={{ animationDelay: '1s' }}>
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-gold-200/50 to-sage-200/50"></div>
      </div>
      <div className="absolute top-1/3 right-20 opacity-10">
        <Star className="w-8 h-8 text-gold-300" />
      </div>
      <div className="absolute bottom-1/3 left-20 opacity-10">
        <Star className="w-6 h-6 text-sage-300" />
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            20+ anos promovendo{' '}
            <span className="text-gold-300 relative">
              saúde, bem-estar e autoestima
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-gold-300 to-gold-400 rounded"></div>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-8 leading-relaxed drop-shadow-md">
            Descubra o verdadeiro poder do toque terapêutico e da estética avançada. 
            Experimente uma abordagem personalizada, onde cada detalhe é pensado para proporcionar{' '}
            <span className="text-gold-200 font-medium">resultados visíveis</span>,{' '}
            <span className="text-sage-200 font-medium">relaxamento profundo</span> e{' '}
            <span className="text-beige-200 font-medium">reconexão com o seu melhor</span>.
            <br /><br />
            <span className="text-white font-semibold">
              Atendimentos exclusivos, com excelência e discrição.
            </span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <BookingModal>
              <Button 
                size="lg" 
                className="gradient-primary shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Marcar Consulta
              </Button>
            </BookingModal>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-white/60 text-white hover:bg-white/20 backdrop-blur-sm px-8 py-4 text-lg font-medium rounded-xl transition-all duration-300 hover:scale-105"
              onClick={handleScrollToAbout}
            >
              Conheça Nossa História
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="flex flex-col items-center p-6 bg-white/60 backdrop-blur-sm rounded-lg border border-sage-200 shadow-sm">
              <div className="text-3xl font-bold text-darkgreen-800 mb-2">20+</div>
              <div className="text-sm text-forest-600">Anos de Experiência</div>
            </div>
            <div className="flex flex-col items-center p-6 bg-white/60 backdrop-blur-sm rounded-lg border border-gold-200 shadow-sm">
              <div className="text-3xl font-bold text-gold-700 mb-2">100%</div>
              <div className="text-sm text-forest-600">Personalizado</div>
            </div>
            <div className="flex flex-col items-center p-6 bg-white/60 backdrop-blur-sm rounded-lg border border-sage-200 shadow-sm">
              <div className="text-3xl font-bold text-darkgreen-800 mb-2">Premium</div>
              <div className="text-sm text-forest-600">Atendimento Exclusivo</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};