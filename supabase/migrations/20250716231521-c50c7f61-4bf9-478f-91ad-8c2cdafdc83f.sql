
-- Atualizar informações de contato
UPDATE contact_info SET value = '+351 964 481 966' WHERE type = 'phone';
UPDATE contact_info SET value = 'Limadesouzacreusa@gmail.com' WHERE type = 'email';

-- Atualizar endereço e coordenadas para Carcavelos
UPDATE addresses SET 
  latitude = 38.6964,
  longitude = -9.3334,
  street_address = 'R. Fernando Lopes Graça 379 B',
  postal_code = '2775-571',
  city = 'Carcavelos'
WHERE is_primary = true;

-- Atualizar horários de funcionamento
UPDATE business_hours SET open_time = '09:00', close_time = '18:00' WHERE day_of_week IN (1, 2, 3, 4, 5);
UPDATE business_hours SET open_time = '09:00', close_time = '13:00' WHERE day_of_week = 6;
UPDATE business_hours SET is_active = false WHERE day_of_week = 0;

-- Criar entrada para o novo texto "Sobre Mim"
INSERT INTO content_sections (section_type, title, content, is_active) 
VALUES (
  'about_section',
  'Sobre Mim',
  'De Salvador – Bahia para Portugal, trago comigo mais de 20 anos de experiência dedicados ao cuidado de pessoas. Acredito que cada corpo tem uma história única e merece atenção, respeito e presença.

Especialista em linfoterapia, pós-operatório e estética, atuo promovendo saúde, recuperação e qualidade de vida. Meu compromisso é oferecer tratamentos sob medida, alicerçados em conhecimento, sensibilidade e ética profissional.

O toque terapêutico é a minha ferramenta para devolver equilíbrio, bem-estar e autoconfiança aos meus clientes. Atendimento em ambiente discreto, seguro e acolhedor.',
  true
) ON CONFLICT (section_type) DO UPDATE SET 
  content = EXCLUDED.content,
  updated_at = now();
