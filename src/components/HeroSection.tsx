import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
const HeroSection: React.FC = () => {
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
  const heroBackgroundImage = getSettingValue('hero_background_image') || '/lovable-uploads/new-logo.png';

  // Use content from database or fallback to default
  const heroTitle = contentSettings?.title || 'Transforme-se com os nossos';
  const heroSubtitle = contentSettings?.subtitle || 'tratamentos exclusivos';
  const heroContent = contentSettings?.content || 'Descubra a harmonia perfeita entre beleza natural e bem-estar numa experiência única e personalizada';
  const heroButtonText = contentSettings?.button_text || 'Marcar Consulta';
  const heroButtonLink = contentSettings?.button_link || '#services';
  const scrollToServices = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
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
  return <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 to-sage-100">
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: `url('${heroBackgroundImage}')`
    }} />
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-darkgreen-900">
          {heroTitle}
          <span className="block text-darkgreen-700">{heroSubtitle}</span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-darkgreen-500">
          {heroContent}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-4 text-lg shadow-lg" onClick={handleMainAction}>
            <Calendar className="mr-2 h-5 w-5" />
            {heroButtonText}
          </Button>
          
          <Button variant="outline" size="lg" onClick={() => document.getElementById('about')?.scrollIntoView({
          behavior: 'smooth'
        })} className="border-white px-8 py-4 text-lg text-darkgreen-900 bg-darkgreen-100">
            Saber Mais
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>;
};
export default HeroSection;