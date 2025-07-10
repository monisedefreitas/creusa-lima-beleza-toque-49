
import React from 'react';
import { Button } from '@/components/ui/button';
import { Flower2, Award } from 'lucide-react';

interface HeroSectionProps {
  onBookingClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onBookingClick }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-beige-50 via-white to-sage-50">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 opacity-20 animate-float">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-sage-200 to-gold-200"></div>
      </div>
      <div className="absolute bottom-20 right-10 opacity-20 animate-float" style={{ animationDelay: '1s' }}>
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-gold-200 to-sage-200"></div>
      </div>
      <div className="absolute top-1/3 right-20 opacity-10">
        <Flower2 className="w-8 h-8 text-gold-500" />
      </div>
      <div className="absolute bottom-1/3 left-20 opacity-10">
        <Flower2 className="w-6 h-6 text-sage-400" />
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto animate-fade-in">
          {/* Premium Badge - 20+ Anos */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-8 py-3 rounded-full border border-gold-200 mb-8 shadow-lg">
            <Award className="w-5 h-5 text-gold-600" />
            <span className="text-sm font-medium text-darkgreen-800 font-bauer-bodoni">20+ Anos de Excelência</span>
          </div>
          
          <h1 className="font-tan-mon-cheri text-5xl md:text-7xl font-bold text-darkgreen-800 mb-6 leading-tight">
            20+ anos promovendo{' '}
            <span className="text-gold-600 relative">
              saúde, bem-estar e autoestima
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-gold-400 to-gold-600 rounded"></div>
            </span>
          </h1>
          
          <p className="font-poppins text-xl md:text-2xl text-forest-600 max-w-4xl mx-auto mb-8 leading-relaxed">
            Descubra o verdadeiro poder do toque terapêutico e da estética avançada. 
            Experimente uma abordagem personalizada, onde cada detalhe é pensado para proporcionar{' '}
            <span className="text-darkgreen-700 font-medium">resultados visíveis</span>,{' '}
            <span className="text-gold-600 font-medium">relaxamento profundo</span> e{' '}
            <span className="text-forest-700 font-medium">reconexão com o seu melhor</span>.
            <br /><br />
            <span className="text-darkgreen-800 font-semibold">
              Atendimentos exclusivos, com excelência e discrição.
            </span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-darkgreen-700 to-darkgreen-800 hover:from-darkgreen-800 hover:to-darkgreen-900 text-white px-8 py-4 text-lg font-medium font-bauer-bodoni rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={onBookingClick}
            >
              <Flower2 className="w-5 h-5 mr-2" />
              Agende sua Consulta Personalizada
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-gold-400 text-gold-700 hover:bg-gold-50 px-8 py-4 text-lg font-medium font-bauer-bodoni rounded-xl transition-all duration-300"
              onClick={() => document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Conheça Nossa História
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="flex flex-col items-center p-6 bg-white/60 backdrop-blur-sm rounded-lg border border-sage-200 shadow-sm">
              <div className="text-3xl font-bold text-darkgreen-800 mb-2 font-tan-mon-cheri">20+</div>
              <div className="text-sm text-forest-600 font-poppins">Anos de Experiência</div>
            </div>
            <div className="flex flex-col items-center p-6 bg-white/60 backdrop-blur-sm rounded-lg border border-gold-200 shadow-sm">
              <div className="text-3xl font-bold text-gold-700 mb-2 font-tan-mon-cheri">100%</div>
              <div className="text-sm text-forest-600 font-poppins">Personalizado</div>
            </div>
            <div className="flex flex-col items-center p-6 bg-white/60 backdrop-blur-sm rounded-lg border border-sage-200 shadow-sm">
              <div className="text-3xl font-bold text-darkgreen-800 mb-2 font-tan-mon-cheri">Premium</div>
              <div className="text-sm text-forest-600 font-poppins">Atendimento Exclusivo</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
