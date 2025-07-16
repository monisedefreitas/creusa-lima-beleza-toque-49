
import { supabase } from '@/integrations/supabase/client';

export const getWhatsAppMessage = async (templateType: string, variables: Record<string, string> = {}): Promise<string> => {
  try {
    // First try to get a specific template from the database
    const { data: template } = await supabase
      .from('message_templates')
      .select('content, variables')
      .eq('type', templateType)
      .eq('is_active', true)
      .eq('is_default', true)
      .single();

    if (template) {
      let message = template.content;
      
      // Replace variables in the template
      if (template.variables && Array.isArray(template.variables)) {
        template.variables.forEach((variable: string) => {
          const value = variables[variable] || `{${variable}}`;
          message = message.replace(new RegExp(`\\{${variable}\\}`, 'g'), value);
        });
      }

      return message;
    }

    // Fallback to default templates if no database template found
    return getDefaultTemplate(templateType, variables);
  } catch (error) {
    console.error('Error fetching message template:', error);
    return getDefaultTemplate(templateType, variables);
  }
};

const getDefaultTemplate = (templateType: string, variables: Record<string, string>): string => {
  const { 
    clientName = '{clientName}', 
    appointmentDate = '{appointmentDate}', 
    appointmentTime = '{appointmentTime}',
    serviceName = '{serviceName}',
    totalPrice = '{totalPrice}',
    businessName = 'Nossa Empresa',
    businessPhone = '+351 123 456 789',
    businessAddress = 'Rua Principal, 123',
    newDate = '{newDate}',
    newTime = '{newTime}'
  } = variables;

  const templates: Record<string, string> = {
    confirmation: `🌟 Olá ${clientName}!

✅ A sua marcação foi confirmada:
📅 Data: ${appointmentDate}
🕐 Hora: ${appointmentTime}
💅 Serviço: ${serviceName}
💰 Valor: €${totalPrice}

📍 Localização: ${businessAddress}

Em caso de dúvidas, contacte-nos através do ${businessPhone}.

Até breve! 💖`,

    reminder: `🔔 Lembrete da sua consulta

Olá ${clientName}! 

Lembramos que tem uma consulta marcada para amanhã:
📅 ${appointmentDate} às ${appointmentTime}
💅 Serviço: ${serviceName}

📍 ${businessAddress}

Caso necessite reagendar, contacte-nos pelo ${businessPhone}.

Até amanhã! ✨`,

    completion: `✨ Obrigada pela sua visita!

Olá ${clientName}! 

Esperamos que tenha ficado satisfeita com o nosso serviço de ${serviceName}! 

🌟 A sua opinião é muito importante para nós! 
📝 Pode deixar a sua avaliação em: https://meusite.com/avaliar

Até à próxima! 💖

${businessName}
${businessPhone}`,

    cancellation: `❌ Marcação Cancelada

Olá ${clientName},

A sua marcação do dia ${appointmentDate} às ${appointmentTime} foi cancelada.

Se desejar reagendar, contacte-nos pelo ${businessPhone}.

Obrigada pela compreensão! 

${businessName}`,

    rescheduling: `📅 Marcação Reagendada

Olá ${clientName}!

A sua consulta foi reagendada com sucesso:

🔄 Nova data: ${newDate}
🕐 Nova hora: ${newTime}
💅 Serviço: ${serviceName}

📍 Local: ${businessAddress}

Obrigada pela compreensão!

${businessName}
${businessPhone}`,

    welcome: `🌟 Bem-vinda ao ${businessName}!

Olá ${clientName}!

Obrigada por escolher os nossos serviços! 

📱 Pode acompanhar as suas marcações através do nosso site
📞 Para dúvidas: ${businessPhone}
📍 Morada: ${businessAddress}

Estamos ansiosas por recebê-la! 💖`,

    follow_up: `💖 Como está a sentir-se?

Olá ${clientName}!

Já passaram alguns dias desde a sua última visita para ${serviceName}.

Como está a sentir-se com o resultado? 

🌟 Adoraríamos saber a sua opinião em: https://meusite.com/avaliar

Para marcar a sua próxima consulta: ${businessPhone}

${businessName}`,

    promotion: `🎉 Oferta Especial para Si!

Olá ${clientName}!

Temos uma promoção especial que pode interessar-lhe! 

💅 [Detalhes da promoção]
📅 Válida até: [Data]

Para marcar: ${businessPhone}
Ou visite-nos em: ${businessAddress}

${businessName}`,

    birthday: `🎂 Feliz Aniversário!

Olá ${clientName}!

Hoje é um dia especial e queríamos desejar-lhe um Feliz Aniversário! 🎉

🎁 Temos uma surpresa especial para si!
📞 Contacte-nos: ${businessPhone}

Que tenha um dia maravilhoso! ✨

${businessName}`,

    no_show: `❓ Sentimos a sua falta

Olá ${clientName},

Hoje esperávamos por si para a consulta das ${appointmentTime}, mas infelizmente não compareceu.

Se aconteceu algum imprevisto, compreendemos! 

📞 Para reagendar: ${businessPhone}

${businessName}`,

    whatsapp_confirmation: `🌟 Olá ${clientName}!

✅ A sua marcação foi confirmada:
📅 Data: ${appointmentDate}
🕐 Hora: ${appointmentTime}
💅 Serviço: ${serviceName}
💰 Valor: €${totalPrice}

📍 Localização: ${businessAddress}

Em caso de dúvidas, contacte-nos através do ${businessPhone}.

Até breve! 💖`,

    review_request: `✨ Obrigada pela sua visita!

Olá ${clientName}! 

Esperamos que tenha ficado satisfeita com o nosso serviço de ${serviceName}! 

🌟 A sua opinião é muito importante para nós! 
📝 Pode deixar a sua avaliação em: https://meusite.com/avaliar

Até à próxima! 💖

${businessName}
${businessPhone}`
  };

  return templates[templateType] || `Olá ${clientName}, obrigada por escolher os nossos serviços!`;
};

export const formatWhatsAppUrl = (phone: string, message: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

export const createWhatsAppLink = async (phone: string, templateType: string, variables: Record<string, string> = {}): Promise<string> => {
  const message = await getWhatsAppMessage(templateType, variables);
  return formatWhatsAppUrl(phone, message);
};
