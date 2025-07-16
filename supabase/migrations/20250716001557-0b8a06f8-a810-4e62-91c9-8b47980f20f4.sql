
-- Inserir utilizador admin (substitua pelo seu email real)
INSERT INTO public.admin_users (email, user_id, is_active, role)
VALUES ('igorcf20@gmail.com', '5956c2a8-90e5-41c2-803b-d2850e1d21ba', true, 'admin');

-- Inserir serviços básicos
INSERT INTO public.services (name, short_description, description, price_range, duration_minutes, category, is_active, is_featured, order_index) VALUES
('Linfoterapia', 'Tratamento de drenagem linfática', 'Técnica especializada que estimula o sistema linfático, reduzindo inchaço e melhorando a circulação', '35€-45€', 60, 'Tratamentos Corporais', true, true, 1),
('Drenagem Linfática Manual', 'Drenagem manual especializada', 'Massagem terapêutica que ativa a circulação linfática, ideal para pós-operatório e retenção de líquidos', '40€-50€', 90, 'Tratamentos Corporais', true, true, 2),
('Radiofrequência Corporal', 'Tratamento de firmeza da pele', 'Tecnologia avançada para firmeza da pele, redução de celulite e contorno corporal', '50€-70€', 75, 'Tratamentos Estéticos', true, true, 3),
('Massagem Relaxante', 'Massagem para alívio do stress', 'Massagem terapêutica para relaxamento muscular e alívio do stress do dia a dia', '30€-40€', 60, 'Massagens', true, false, 4),
('Pressoterapia', 'Terapia de compressão pneumática', 'Tratamento que utiliza pressão controlada para melhorar a circulação e reduzir o inchaço', '35€-45€', 45, 'Tratamentos Corporais', true, false, 5);

-- Inserir horários de funcionamento (Segunda a Sexta: 9h-18h, Sábado: 9h-14h)
INSERT INTO public.business_hours (day_of_week, open_time, close_time, is_active) VALUES
(1, '09:00', '18:00', true), -- Segunda
(2, '09:00', '18:00', true), -- Terça
(3, '09:00', '18:00', true), -- Quarta
(4, '09:00', '18:00', true), -- Quinta
(5, '09:00', '18:00', true), -- Sexta
(6, '09:00', '14:00', true); -- Sábado

-- Inserir slots de tempo disponíveis
INSERT INTO public.time_slots (time, duration_minutes, is_available, max_concurrent) VALUES
('09:00', 60, true, 1),
('10:00', 60, true, 1),
('11:00', 60, true, 1),
('12:00', 60, true, 1),
('14:00', 60, true, 1),
('15:00', 60, true, 1),
('16:00', 60, true, 1),
('17:00', 60, true, 1);

-- Inserir FAQs básicas
INSERT INTO public.faqs (question, answer, category, is_active, order_index) VALUES
('Quanto tempo dura cada sessão?', 'A duração varia conforme o tratamento escolhido, entre 45 a 90 minutos. Durante a marcação, será informado do tempo estimado.', 'Tratamentos', true, 1),
('É necessário fazer alguma preparação antes do tratamento?', 'Recomendamos vir com roupa confortável e evitar refeições pesadas 2 horas antes da sessão. Para tratamentos específicos, daremos instruções detalhadas.', 'Preparação', true, 2),
('Com que frequência devo fazer os tratamentos?', 'A frequência depende do tipo de tratamento e dos seus objetivos. Normalmente recomendamos sessões semanais ou quinzenais para melhores resultados.', 'Frequência', true, 3),
('Os tratamentos têm contraindicações?', 'Alguns tratamentos podem ter contraindicações específicas. Durante a consulta inicial, avaliaremos o seu histórico médico para garantir a segurança.', 'Segurança', true, 4),
('Como posso remarcar ou cancelar uma marcação?', 'Pode contactar-nos por telefone ou WhatsApp com pelo menos 24 horas de antecedência para remarcar ou cancelar sem custos.', 'Marcações', true, 5);

-- Inserir informações de contacto
INSERT INTO public.contact_info (type, label, value, is_active, is_primary, order_index) VALUES
('phone', 'Telefone Principal', '+351 912 345 678', true, true, 1),
('whatsapp', 'WhatsApp', '+351 912 345 678', true, false, 2),
('email', 'Email', 'geral@clinicaestetica.pt', true, true, 3),
('instagram', 'Instagram', '@clinicaestetica', true, false, 4);
