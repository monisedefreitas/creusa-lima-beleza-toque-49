
import React from 'react';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import LazyImage from '@/components/Performance/LazyImage';

const HeroSection: React.FC = () => {
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <section 
      ref={elementRef}
      className={`relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 transition-opacity duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Background Image with enhanced loading */}
      <div className="absolute inset-0 z-0">
        <LazyImage
          src="/lovable-uploads/f89fd8e5-45a3-4f6b-878e-d3f162b79dc1.png"
          alt="Ambiente relaxante da clínica"
          className="w-full h-full object-cover"
          priority={true}
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          Bem-Estar e{' '}
          <span className="text-sage-300">Beleza Natural</span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
          Especializados em drenagem linfática, massagens relaxantes e tratamentos estéticos personalizados
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-4 text-lg"
            asChild
          >
            <a href="#services">Ver Serviços</a>
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white text-sage-900 hover:bg-white hover:text-sage-900 px-8 py-4 text-lg"
            asChild
          >
            <a href="#contact">Marcar Consulta</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
