
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

export interface MessageVariables {
  client_name?: string;
  appointment_date?: string;
  appointment_time?: string;
  services_list?: string;
  total_price?: string;
  clinic_name?: string;
  client_phone?: string;
  client_email?: string;
}

export const processMessageTemplate = (
  template: string,
  variables: MessageVariables
): string => {
  let processedMessage = template;

  // Replace each variable
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    processedMessage = processedMessage.replace(
      new RegExp(placeholder, 'g'),
      value || ''
    );
  });

  return processedMessage;
};

export const generateWhatsAppVariables = (appointment: any): MessageVariables => {
  return {
    client_name: appointment.client_name,
    appointment_date: format(new Date(appointment.appointment_date), 'dd/MM/yyyy', { locale: pt }),
    appointment_time: appointment.time_slots?.time || '',
    services_list: appointment.appointment_services?.map((service: any) => 
      `• ${service.services?.name} (€${service.price})`
    ).join('\n') || '',
    total_price: appointment.total_price ? `€${appointment.total_price}` : '',
    clinic_name: 'Nossa Clínica',
    client_phone: appointment.client_phone,
    client_email: appointment.client_email || ''
  };
};

export const getAvailableVariables = (): string[] => {
  return [
    'client_name',
    'appointment_date', 
    'appointment_time',
    'services_list',
    'total_price',
    'clinic_name',
    'client_phone',
    'client_email'
  ];
};

export const getVariableDescriptions = (): Record<string, string> => {
  return {
    client_name: 'Nome do cliente',
    appointment_date: 'Data da marcação',
    appointment_time: 'Hora da marcação',
    services_list: 'Lista de serviços agendados',
    total_price: 'Preço total',
    clinic_name: 'Nome da clínica',
    client_phone: 'Telefone do cliente',
    client_email: 'Email do cliente'
  };
};
