
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const HeroSection: React.FC = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const {
    data: contentSettings
  } = useQuery({
    queryKey: ['hero-content'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('content_sections').select('*').eq('section_type', 'hero_banner').eq('is_active', true).order('order_index').limit(1).maybeSingle();
      if (error) throw error;
      return data;
    }
  });
  
  const {
    data: settings
  } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('site_settings').select('*');
      if (error) throw error;
      return data;
    }
  });
  
  const getSettingValue = (key: string) => {
    return settings?.find(s => s.key === key)?.value || '';
  };
  
  const heroBackgroundImage = getSettingValue('hero_background_image');

  // Use content from database or fallback to default
  const heroTitle = contentSettings?.title || 'Transforme-se com os nossos';
  const heroSubtitle = contentSettings?.subtitle || 'tratamentos exclusivos';
  const heroContent = contentSettings?.content || 'Descubra a harmonia perfeita entre beleza natural e bem-estar numa experiência única e personalizada';
  const heroButtonText = contentSettings?.button_text || 'Marcar Consulta';
  const heroButtonLink = contentSettings?.button_link || '#services';
  
  const handleMainAction = () => {
    if (heroButtonLink.startsWith('#')) {
      const element = document.getElementById(heroButtonLink.slice(1));
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth'
        });
      }
    } else {
      window.open(heroButtonLink, '_blank');
    }
  };

  return (
    <section id="home" className={`relative min-h-screen flex items-center justify-center transition-all duration-700 ${
      heroBackgroundImage && !imageLoaded ? 'bg-gradient-to-br from-sage-50 via-white to-sage-100' : ''
    }`}>
      {/* Background Image - only show if defined in admin */}
      {heroBackgroundImage && (
        <>
          <div 
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url('${heroBackgroundImage}')`
            }} 
          />
          <img
            src={heroBackgroundImage}
            alt="Background"
            className="hidden"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(false)}
          />
          {/* Overlay only when image is loaded */}
          <div className={`absolute inset-0 bg-gradient-to-br from-black/20 via-black/10 to-black/30 transition-opacity duration-700 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}></div>
        </>
      )}
      
      {/* Fallback gradient when no image or image not loaded */}
      {(!heroBackgroundImage || !imageLoaded) && (
        <div className="absolute inset-0 bg-gradient-to-br from-sage-50 via-white to-sage-100"></div>
      )}
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-sage-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-48 h-48 bg-darkgreen-200/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <div className="animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            <span className="block text-darkgreen-900 mb-4 tracking-tight">
              {heroTitle}
            </span>
            <span className="block text-transparent bg-gradient-to-r from-sage-600 via-darkgreen-700 to-sage-800 bg-clip-text font-light tracking-wide">
              {heroSubtitle}
            </span>
          </h1>
        </div>
        
        <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <p className="text-xl md:text-2xl lg:text-3xl mb-12 max-w-4xl mx-auto text-darkgreen-600 leading-relaxed font-light">
            {heroContent}
          </p>
        </div>
        
        <div className="animate-fade-in-up flex flex-col sm:flex-row gap-6 justify-center items-center" style={{ animationDelay: '0.6s' }}>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white px-10 py-6 text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 border-0 rounded-full"
            onClick={handleMainAction}
          >
            <Calendar className="mr-3 h-6 w-6" />
            {heroButtonText}
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} 
            className="border-2 border-darkgreen-300 hover:border-darkgreen-500 px-10 py-6 text-lg text-darkgreen-800 hover:text-darkgreen-900 bg-white/80 hover:bg-white backdrop-blur-sm transition-all duration-300 hover:scale-105 rounded-full"
          >
            Saber Mais
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
