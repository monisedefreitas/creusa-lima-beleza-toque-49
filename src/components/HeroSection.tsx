
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Star } from 'lucide-react';

interface HeroSectionProps {
  onBookingClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onBookingClick }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-gold-50">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 opacity-20 animate-float">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-200 to-gold-200"></div>
      </div>
      <div className="absolute bottom-20 right-10 opacity-20 animate-float" style={{ animationDelay: '1s' }}>
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-gold-200 to-emerald-200"></div>
      </div>
      <div className="absolute top-1/3 right-20 opacity-10">
        <Star className="w-8 h-8 text-gold-400" />
      </div>
      <div className="absolute bottom-1/3 left-20 opacity-10">
        <Sparkles className="w-6 h-6 text-emerald-400" />
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto animate-fade-in">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full border border-gold-200 mb-8">
            <Sparkles className="w-4 h-4 text-gold-500" />
            <span className="text-sm font-medium text-emerald-800">Tratamentos Exclusivos</span>
          </div>
          
          <h1 className="font-playfair text-5xl md:text-7xl font-bold text-emerald-900 mb-6 leading-tight">
            Cuidar de você é a minha{' '}
            <span className="text-gold-600 relative">
              missão
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-gold-400 to-gold-600 rounded"></div>
            </span>
          </h1>
          
          <p className="font-inter text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Dos tratamentos mais delicados à tecnologia avançada, cada serviço é feito com{' '}
            <span className="text-emerald-700 font-medium">carinho, profissionalismo</span> e{' '}
            <span className="text-gold-600 font-medium">respeito à sua história</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white px-8 py-4 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={onBookingClick}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Agende seu Tratamento Premium
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-gold-400 text-gold-700 hover:bg-gold-50 px-8 py-4 text-lg font-medium rounded-xl transition-all duration-300"
              onClick={() => document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Conheça Nossa História
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="flex flex-col items-center p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-emerald-100">
              <div className="text-2xl font-bold text-emerald-800 mb-1">7+</div>
              <div className="text-sm text-slate-600">Anos em Portugal</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-gold-100">
              <div className="text-2xl font-bold text-gold-700 mb-1">3+</div>
              <div className="text-sm text-slate-600">Anos de Excelência</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-emerald-100">
              <div className="text-2xl font-bold text-emerald-800 mb-1">100%</div>
              <div className="text-sm text-slate-600">Dedicação</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
