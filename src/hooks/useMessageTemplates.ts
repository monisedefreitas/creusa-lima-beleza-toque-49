
import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type MessageTemplate = Tables<'message_templates'>;

export const useMessageTemplates = () => {
  return useQuery({
    queryKey: ['message-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('message_templates')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data as MessageTemplate[];
    }
  });
};

export const useDefaultTemplate = (type: string = 'whatsapp_confirmation') => {
  return useQuery({
    queryKey: ['default-template', type],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('message_templates')
        .select('*')
        .eq('type', type)
        .eq('is_default', true)
        .eq('is_active', true)
        .single();
      
      if (error) throw error;
      return data as MessageTemplate;
    }
  });
};

export const useCreateMessageTemplate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (templateData: {
      name: string;
      type: string;
      content: string;
      subject?: string;
      variables?: string[];
      is_default?: boolean;
    }) => {
      const { error } = await supabase
        .from('message_templates')
        .insert({
          ...templateData,
          variables: templateData.variables || []
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['message-templates'] });
      toast({
        title: "Template criado",
        description: "Template de mensagem criado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Error creating template:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar template de mensagem.",
        variant: "destructive",
      });
    }
  });
};

export const useUpdateMessageTemplate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...templateData }: {
      id: string;
      name?: string;
      content?: string;
      subject?: string;
      variables?: string[];
      is_active?: boolean;
      is_default?: boolean;
    }) => {
      const { error } = await supabase
        .from('message_templates')
        .update(templateData)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['message-templates'] });
      toast({
        title: "Template atualizado",
        description: "Template de mensagem atualizado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Error updating template:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar template de mensagem.",
        variant: "destructive",
      });
    }
  });
};

export const useDeleteMessageTemplate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('message_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['message-templates'] });
      toast({
        title: "Template removido",
        description: "Template de mensagem removido com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Error deleting template:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover template de mensagem.",
        variant: "destructive",
      });
    }
  });
};
