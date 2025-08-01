
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSiteLogo = () => {
  return useQuery({
    queryKey: ['site-logo'],
    queryFn: async (): Promise<string> => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'site_logo')
        .maybeSingle();

      if (error) {
        console.error('Error fetching site logo:', error);
      }

      return data?.value || '/lovable-uploads/new-logo.png';
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
};
