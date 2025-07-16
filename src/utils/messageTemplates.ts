
export const defaultMessageTemplates = [
  {
    id: 'whatsapp_confirmation',
    name: 'Confirmação de Marcação WhatsApp',
    type: 'whatsapp_confirmation',
    content: `Olá {{client_name}}! 😊

✅ A sua marcação foi confirmada com sucesso!

📅 **Detalhes da sua consulta:**
• **Data:** {{appointment_date}}
• **Hora:** {{appointment_time}}
• **Serviço:** {{service_name}}
• **Local:** {{clinic_address}}

📍 **Como chegar:**
Pode usar o nosso link de navegação para facilitar: {{maps_link}}

💡 **Lembretes importantes:**
• Chegue 10 minutos antes da hora marcada
• Traga um documento de identificação
• Em caso de impossibilidade, avise com 24h de antecedência

Estamos ansiosos por recebê-la e proporcionar uma experiência única de bem-estar! 

Se tiver alguma dúvida, não hesite em contactar-nos.

Com os melhores cumprimentos,
Equipa {{clinic_name}} 💚`,
    variables: ['client_name', 'appointment_date', 'appointment_time', 'service_name', 'clinic_address', 'maps_link', 'clinic_name'],
    is_default: true
  },
  {
    id: 'review_request',
    name: 'Pedido de Avaliação',
    type: 'review_request',
    content: `Olá {{client_name}}! 😊

Esperamos que tenha ficado satisfeita com o seu tratamento de {{service_name}} connosco! ✨

A sua opinião é muito importante para nós e ajuda outras pessoas a conhecerem o nosso trabalho. 

💝 **Poderia partilhar a sua experiência?**

Deixe-nos uma avaliação no Google Maps:
{{review_link}}

⭐ A sua avaliação demora apenas 1 minuto e significa muito para a nossa pequena clínica!

Como agradecimento pela sua confiança, na sua próxima visita oferecemos 10% de desconto! 🎁

Muito obrigada pelo seu tempo e confiança! 

Com carinho,
Equipa {{clinic_name}} 💚

P.S.: Estamos sempre aqui para qualquer esclarecimento! 😘`,
    variables: ['client_name', 'service_name', 'review_link', 'clinic_name'],
    is_default: false
  },
  {
    id: 'appointment_reminder',
    name: 'Lembrete de Consulta',
    type: 'appointment_reminder',
    content: `Olá {{client_name}}! 😊

🔔 **Lembrete da sua consulta**

Lembramos que tem uma consulta marcada connosco:

📅 **Amanhã, {{appointment_date}}**
🕐 **Às {{appointment_time}}**
💆‍♀️ **Serviço:** {{service_name}}

📍 **Localização:** {{clinic_address}}

💡 **Preparação para a consulta:**
• Chegue 10 minutos mais cedo
• Vista roupa confortável
• Traga documento de identificação

Se por algum motivo não puder comparecer, avise-nos com antecedência para reagendarmos.

Estamos ansiosos por recebê-la! ✨

Equipa {{clinic_name}} 💚`,
    variables: ['client_name', 'appointment_date', 'appointment_time', 'service_name', 'clinic_address', 'clinic_name'],
    is_default: false
  }
];
