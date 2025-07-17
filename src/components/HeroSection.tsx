
import React from 'react';
import { Button } from '@/components/ui/button';
import { useHeroContent } from '@/hooks/useHeroContent';
import LazyImage from '@/components/Performance/LazyImage';

const HeroSection: React.FC = () => {
  const { data: heroContent, isLoading } = useHeroContent();

  if (isLoading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-sage-100 to-sage-200"></div>
        <div className="relative z-10 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <LazyImage
          src={heroContent?.background_image || '/lovable-uploads/f89fd8e5-45a3-4f6b-878e-d3f162b79dc1.png'}
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
          {heroContent?.title}{' '}
          <span className="text-sage-300">{heroContent?.subtitle}</span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
          {heroContent?.content}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-4 text-lg"
            asChild
          >
            <a href={heroContent?.button_link || '#services'}>
              {heroContent?.button_text || 'Ver Serviços'}
            </a>
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
