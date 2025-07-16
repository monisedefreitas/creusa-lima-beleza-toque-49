
-- Adicionar templates de WhatsApp em falta
INSERT INTO public.message_templates (name, type, content, variables, is_default, is_active) VALUES
(
  'Cancelamento de Consulta',
  'appointment_cancellation',
  'Olá {{client_name}}! 😔

Lamentamos informar que a sua consulta foi cancelada:

📅 **Consulta cancelada:**
• **Data:** {{appointment_date}}
• **Hora:** {{appointment_time}}
• **Serviço:** {{service_name}}

💡 **Para reagendar:**
Por favor contacte-nos para marcar uma nova data que seja conveniente para si.

Pedimos desculpa por qualquer inconveniente causado.

Com os melhores cumprimentos,
Equipa {{clinic_name}} 💚',
  '["client_name", "appointment_date", "appointment_time", "service_name", "clinic_name"]'::jsonb,
  false,
  true
),
(
  'Reagendamento de Consulta',
  'appointment_reschedule',
  'Olá {{client_name}}! 📅

A sua consulta foi reagendada com sucesso!

📋 **Dados anteriores:**
• **Data anterior:** {{old_appointment_date}}
• **Hora anterior:** {{old_appointment_time}}

✅ **Nova marcação:**
• **Nova data:** {{appointment_date}}
• **Nova hora:** {{appointment_time}}
• **Serviço:** {{service_name}}
• **Local:** {{clinic_address}}

💡 **Lembretes importantes:**
• Chegue 10 minutos antes da hora marcada
• Em caso de nova impossibilidade, avise com 24h de antecedência

Obrigada pela sua compreensão!

Com os melhores cumprimentos,
Equipa {{clinic_name}} 💚',
  '["client_name", "old_appointment_date", "old_appointment_time", "appointment_date", "appointment_time", "service_name", "clinic_address", "clinic_name"]'::jsonb,
  false,
  true
),
(
  'Lembrete de Consulta - 24h',
  'appointment_reminder_24h',
  'Olá {{client_name}}! 🔔

**Lembrete: Consulta amanhã!**

📅 **Detalhes da sua consulta:**
• **Data:** {{appointment_date}}
• **Hora:** {{appointment_time}}
• **Serviço:** {{service_name}}
• **Local:** {{clinic_address}}

💡 **Preparação:**
• Vista roupa confortável
• Chegue 10 minutos mais cedo
• Traga documento de identificação

📍 **Navegação:** {{maps_link}}

Se tiver alguma dúvida ou imprevisto, contacte-nos!

Até amanhã! ✨
Equipa {{clinic_name}} 💚',
  '["client_name", "appointment_date", "appointment_time", "service_name", "clinic_address", "maps_link", "clinic_name"]'::jsonb,
  false,
  true
);
