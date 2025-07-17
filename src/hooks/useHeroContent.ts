
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface HeroContent {
  title: string;
  subtitle: string;
  content: string;
  button_text: string;
  button_link: string;
  background_image: string;
}

export const useHeroContent = () => {
  return useQuery({
    queryKey: ['hero-content'],
    queryFn: async (): Promise<HeroContent> => {
      // Fetch hero content from content_sections
      const { data: heroData, error: heroError } = await supabase
        .from('content_sections')
        .select('*')
        .eq('section_type', 'hero_banner')
        .eq('is_active', true)
        .maybeSingle();

      if (heroError) {
        console.error('Error fetching hero content:', heroError);
      }

      // Fetch background image from site_settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'hero_background_image')
        .maybeSingle();

      if (settingsError) {
        console.error('Error fetching hero background:', settingsError);
      }

      // Return with fallbacks
      return {
        title: heroData?.title || 'Bem-Estar e',
        subtitle: heroData?.subtitle || 'Beleza Natural',
        content: heroData?.content || 'Especializados em drenagem linfática, massagens relaxantes e tratamentos estéticos personalizados',
        button_text: heroData?.button_text || 'Ver Serviços',
        button_link: heroData?.button_link || '#services',
        background_image: settingsData?.value || '/lovable-uploads/f89fd8e5-45a3-4f6b-878e-d3f162b79dc1.png'
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
};
