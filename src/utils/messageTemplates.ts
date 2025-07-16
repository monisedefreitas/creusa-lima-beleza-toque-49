
export const getAvailableVariables = () => {
  return [
    'client_name',
    'appointment_date',
    'appointment_time',
    'services_list',
    'total_price',
    'clinic_name',
    'clinic_phone',
    'clinic_address'
  ];
};

export const getVariableDescriptions = () => {
  return {
    client_name: 'Nome do cliente',
    appointment_date: 'Data da marcação',
    appointment_time: 'Hora da marcação',
    services_list: 'Lista de serviços agendados',
    total_price: 'Preço total da consulta',
    clinic_name: 'Nome da clínica',
    clinic_phone: 'Telefone da clínica',
    clinic_address: 'Endereço da clínica'
  };
};

export const processMessageTemplate = (template: string, variables: Record<string, string>) => {
  let processed = template;
  
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    processed = processed.replace(regex, value || `[${key}]`);
  });
  
  return processed;
};

export const generateWhatsAppVariables = (appointment: any) => {
  const servicesList = appointment.appointment_services?.map((service: any) => 
    `• ${service.services?.name} (€${service.price})`
  ).join('\n') || '';

  return {
    client_name: appointment.client_name || '',
    appointment_date: appointment.appointment_date || '',
    appointment_time: appointment.time_slots?.time || '',
    services_list: servicesList,
    total_price: appointment.total_price ? `€${appointment.total_price}` : '',
    clinic_name: 'Creusa Lima',
    clinic_phone: '+351 964 481 966',
    clinic_address: 'Rua das Flores, 123, 1200-123 Lisboa'
  };
};

export const getMessageTemplates = () => {
  return {
    whatsapp_confirmation: {
      name: 'Confirmação de Marcação',
      content: `Olá {{client_name}}! 😊

A sua marcação foi confirmada para o dia {{appointment_date}} às {{appointment_time}}.

Serviços agendados:
{{services_list}}

Total: {{total_price}}

Aguardamos por si! 🌿

Obrigada! ✨`
    },
    whatsapp_arrival_confirmation: {
      name: 'Confirmação de Vinda da Cliente',
      content: `Olá {{client_name}}! 😊

Esperamos por si amanhã, dia {{appointment_date}} às {{appointment_time}}, para o seu tratamento de:
{{services_list}}

Por favor confirme a sua presença respondendo a esta mensagem.

Obrigada! 🌿✨`
    },
    whatsapp_review_request: {
      name: 'Pedido de Avaliação no Google Maps',
      content: `Olá {{client_name}}! 😊

Esperamos que tenha ficado satisfeita com o seu tratamento! ✨

A sua opinião é muito importante para nós e ajuda outras pessoas a conhecerem o nosso trabalho. 💝

Poderia deixar uma avaliação no nosso Google Maps? Será muito rápido e significa muito para nós! ⭐

🔗 Link direto: https://g.page/r/[SEU_LINK_GOOGLE_MAPS]/review

Muito obrigada pelo seu tempo e confiança! 🙏💚

Com carinho,
Creusa Lima 🌿`
    }
  };
};
