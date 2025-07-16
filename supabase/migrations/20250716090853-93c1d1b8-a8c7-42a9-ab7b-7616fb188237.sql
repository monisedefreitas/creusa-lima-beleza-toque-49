
-- Adicionar coluna service_id na tabela banners para vincular banners a serviços específicos
ALTER TABLE public.banners 
ADD COLUMN service_id UUID REFERENCES public.services(id) ON DELETE CASCADE;

-- Criar alguns banners de exemplo para serviços existentes
-- (assumindo que existem serviços na base de dados)
INSERT INTO public.banners (title, subtitle, description, position, service_id, is_active, order_index)
SELECT 
  CONCAT('Promoção ', s.name) as title,
  'Oferta especial limitada' as subtitle,
  CONCAT('Descubra os benefícios do nosso tratamento de ', s.name, ' com condições especiais.') as description,
  'services' as position,
  s.id as service_id,
  true as is_active,
  ROW_NUMBER() OVER (ORDER BY s.created_at) as order_index
FROM public.services s 
WHERE s.is_active = true
LIMIT 3;

-- Criar template padrão para confirmação de vinda da cliente
INSERT INTO public.message_templates (name, type, content, is_default, is_active)
VALUES (
  'Confirmação de Vinda - WhatsApp',
  'whatsapp_arrival_confirmation',
  'Olá {{client_name}}! 

Esperamos por si amanhã, dia {{appointment_date}} às {{appointment_time}}, para o seu tratamento de:
{{services_list}}

Por favor confirme a sua presença respondendo a esta mensagem.

Obrigada! 🌿',
  true,
  true
);

-- Criar template para pedido de avaliação no Google Maps
INSERT INTO public.message_templates (name, type, content, is_default, is_active)
VALUES (
  'Pedido de Avaliação - Google Maps',
  'whatsapp_review_request',
  'Olá {{client_name}}! 

Esperamos que tenha ficado satisfeita com o seu tratamento de {{services_list}}.

A sua opinião é muito importante para nós! Poderia deixar uma avaliação no nosso Google Maps?

Link direto: https://g.page/r/[SEU_LINK_GOOGLE_MAPS]/review

Muito obrigada! ⭐',
  true,
  true
);
