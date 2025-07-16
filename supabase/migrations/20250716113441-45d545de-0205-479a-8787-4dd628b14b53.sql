
-- Criar bucket para imagens do site
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-images',
  'site-images',
  true,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
);

-- Política para permitir que todos vejam as imagens (bucket público)
CREATE POLICY "Public can view site images"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-images');

-- Política para permitir que admins façam upload de imagens
CREATE POLICY "Admins can upload site images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'site-images' 
  AND is_admin(auth.uid())
);

-- Política para permitir que admins atualizem imagens
CREATE POLICY "Admins can update site images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'site-images' 
  AND is_admin(auth.uid())
);

-- Política para permitir que admins eliminem imagens
CREATE POLICY "Admins can delete site images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'site-images' 
  AND is_admin(auth.uid())
);
