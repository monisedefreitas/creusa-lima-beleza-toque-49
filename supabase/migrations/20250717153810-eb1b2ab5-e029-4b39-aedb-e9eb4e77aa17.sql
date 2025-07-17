
-- Atualizar a morada com as coordenadas corretas da Sinergia Corpo & Mente
UPDATE addresses 
SET 
  name = 'Sinergia Corpo & Mente',
  street_address = 'R. Fernando Lopes Graça, 379 B',
  city = 'Carcavelos',
  postal_code = '2775-571',
  country = 'Portugal',
  latitude = 38.6964,
  longitude = -9.3334,
  is_primary = true,
  is_active = true
WHERE is_primary = true;

-- Se não existir nenhuma morada primária, inserir uma nova
INSERT INTO addresses (name, street_address, city, postal_code, country, latitude, longitude, is_primary, is_active)
SELECT 'Sinergia Corpo & Mente', 'R. Fernando Lopes Graça, 379 B', 'Carcavelos', '2775-571', 'Portugal', 38.6964, -9.3334, true, true
WHERE NOT EXISTS (SELECT 1 FROM addresses WHERE is_primary = true);

-- Adicionar configurações para imagens hero responsivas
INSERT INTO site_settings (key, value, description) 
VALUES 
  ('hero_background_image_desktop', '/lovable-uploads/f89fd8e5-45a3-4f6b-878e-d3f162b79dc1.png', 'Imagem de fundo do hero para desktop'),
  ('hero_background_image_mobile', '/lovable-uploads/f89fd8e5-45a3-4f6b-878e-d3f162b79dc1.png', 'Imagem de fundo do hero para dispositivos móveis')
ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value,
  description = EXCLUDED.description;

-- Migrar a configuração atual para desktop se existir
UPDATE site_settings 
SET key = 'hero_background_image_desktop'
WHERE key = 'hero_background_image' 
AND NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'hero_background_image_desktop');
