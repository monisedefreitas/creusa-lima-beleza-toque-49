
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Testimonial {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  message: string;
  rating?: number;
  is_approved: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchTestimonials = async (includeUnapproved = false) => {
    try {
      setIsLoading(true);
      let query = supabase.from('testimonials').select('*').order('created_at', { ascending: false });
      
      if (!includeUnapproved) {
        query = query.eq('is_approved', true);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar depoimentos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createTestimonial = async (testimonial: Omit<Testimonial, 'id' | 'is_approved' | 'is_featured' | 'created_at' | 'updated_at'>) => {
    try {
      // Admin-created testimonials are automatically approved
      const testimonialData = {
        ...testimonial,
        is_approved: true,
        is_featured: false
      };

      const { error } = await supabase.from('testimonials').insert([testimonialData]);
      
      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Depoimento criado com sucesso!",
      });
      
      // Refresh the testimonials list
      fetchTestimonials(true);
      return true;
    } catch (error) {
      console.error('Error creating testimonial:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar depoimento",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateTestimonial = async (id: string, updates: Partial<Testimonial>) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Depoimento atualizado com sucesso",
      });
      
      fetchTestimonials(true);
      return true;
    } catch (error) {
      console.error('Error updating testimonial:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar depoimento",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Depoimento removido com sucesso",
      });
      
      fetchTestimonials(true);
      return true;
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover depoimento",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return {
    testimonials,
    isLoading,
    fetchTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
  };
};
