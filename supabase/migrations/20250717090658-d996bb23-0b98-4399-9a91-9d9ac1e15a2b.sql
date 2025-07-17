
-- Corrigir informações da Casa Criativa MI
UPDATE contact_info SET value = 'contato@casacriativami.com' WHERE type = 'email' AND label LIKE '%Casa Criativa%';

-- Atualizar horários para formato simplificado
UPDATE business_hours SET open_time = '09:00', close_time = '18:00' WHERE day_of_week = 6;

-- Inserir dados da Casa Criativa MI se não existirem
INSERT INTO site_settings (key, value, description) 
VALUES 
  ('company_location', 'Sintra, Portugal', 'Localização da Casa Criativa MI'),
  ('company_email', 'contato@casacriativami.com', 'Email da Casa Criativa MI')
ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value,
  updated_at = now();

-- Atualizar conteúdo da seção About
UPDATE content_sections SET 
  content = 'De Salvador – Bahia para Portugal, trago comigo mais de 20 anos de experiência dedicados ao cuidado de pessoas. Acredito que cada corpo tem uma história única e merece atenção, respeito e presença.

Especialista em linfoterapia, pós-operatório e estética, atuo promovendo saúde, recuperação e qualidade de vida. Meu compromisso é oferecer tratamentos sob medida, alicerçados em conhecimento, sensibilidade e ética profissional.

O toque terapêutico é a minha ferramenta para devolver equilíbrio, bem-estar e autoconfiança aos meus clientes. Atendimento em ambiente discreto, seguro e acolhedor.',
  updated_at = now()
WHERE section_type = 'about_section';
