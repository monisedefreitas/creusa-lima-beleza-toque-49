
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const HeroSection: React.FC = () => {
  const { data: settings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const getSettingValue = (key: string) => {
    return settings?.find(s => s.key === key)?.value || '';
  };

  const heroBackgroundImage = getSettingValue('hero_background_image') || '/lovable-uploads/new-logo.png';

  const scrollToServices = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 to-sage-100">
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${heroBackgroundImage}')`
        }}
      />
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Transforme-se com os nossos
          <span className="block text-sage-200">tratamentos exclusivos</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-sage-100 mb-8 max-w-2xl mx-auto">
          Descubra a harmonia perfeita entre beleza natural e bem-estar numa experiência única e personalizada
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-4 text-lg shadow-lg"
            onClick={scrollToServices}
          >
            <Calendar className="mr-2 h-5 w-5" />
            Marcar Consulta
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="border-white text-white hover:bg-white hover:text-sage-800 px-8 py-4 text-lg"
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Saber Mais
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
