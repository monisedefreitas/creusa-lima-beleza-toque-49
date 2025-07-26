
import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface MessageTemplate {
  id: string;
  name: string;
  type: string;
  content: string;
  variables: string[];
  is_active: boolean;
}

interface TemplateVariables {
  client_name?: string;
  service_name?: string;
  appointment_date?: string;
  appointment_time?: string;
  clinic_name?: string;
  clinic_phone?: string;
  clinic_address?: string;
}

export const useWhatsAppTemplates = () => {
  const { data: templates, isLoading } = useQuery({
    queryKey: ['whatsapp-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('message_templates')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data as MessageTemplate[];
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  const getTemplate = (type: string) => {
    return templates?.find(template => template.type === type);
  };

  const processTemplate = (templateContent: string, variables: TemplateVariables): string => {
    let processedContent = templateContent;
    
    // Replace template variables
    Object.entries(variables).forEach(([key, value]) => {
      if (value) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        processedContent = processedContent.replace(regex, value);
      }
    });
    
    return processedContent;
  };

  const getWhatsAppMessage = (
    templateType: string, 
    variables: TemplateVariables = {},
    fallbackMessage?: string
  ): string => {
    const template = getTemplate(templateType);
    
    if (template) {
      return processTemplate(template.content, variables);
    }
    
    // Fallback messages if no template found
    const fallbacks: Record<string, string> = {
      'general_inquiry': 'Olá! Gostaria de mais informações sobre os vossos serviços.',
      'service_booking': `Olá! Gostaria de agendar uma consulta${variables.service_name ? ` para ${variables.service_name}` : ''}. Poderia indicar-me a disponibilidade?`,
      'callback_request': 'Olá! Gostaria de solicitar uma chamada de retorno. Qual seria o melhor horário para me contactarem?',
      'appointment_confirmation': `Olá ${variables.client_name || ''}! Gostaria de confirmar a minha consulta${variables.service_name ? ` de ${variables.service_name}` : ''}.`
    };
    
    return fallbackMessage || fallbacks[templateType] || fallbacks['general_inquiry'];
  };

  return {
    templates,
    isLoading,
    getTemplate,
    processTemplate,
    getWhatsAppMessage
  };
};
