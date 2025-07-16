
-- Create gallery_tags table for flexible tagging system
CREATE TABLE public.gallery_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#3B82F6',
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create junction table for media-tags relationship
CREATE TABLE public.media_gallery_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  media_id UUID NOT NULL REFERENCES public.media_gallery(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.gallery_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(media_id, tag_id)
);

-- Add service relationship to media_gallery for better categorization
ALTER TABLE public.media_gallery ADD COLUMN service_id UUID REFERENCES public.services(id) ON DELETE SET NULL;

-- Add metadata fields for better image management
ALTER TABLE public.media_gallery ADD COLUMN file_size INTEGER;
ALTER TABLE public.media_gallery ADD COLUMN dimensions TEXT;
ALTER TABLE public.media_gallery ADD COLUMN upload_date TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Enable RLS on new tables
ALTER TABLE public.gallery_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_gallery_tags ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for gallery_tags
CREATE POLICY "Public can read gallery_tags" 
  ON public.gallery_tags 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Admins can manage gallery_tags" 
  ON public.gallery_tags 
  FOR ALL 
  USING (is_admin(auth.uid()));

-- Create RLS policies for media_gallery_tags
CREATE POLICY "Public can read media_gallery_tags" 
  ON public.media_gallery_tags 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage media_gallery_tags" 
  ON public.media_gallery_tags 
  FOR ALL 
  USING (is_admin(auth.uid()));

-- Create trigger for updated_at on gallery_tags
CREATE TRIGGER update_gallery_tags_updated_at
  BEFORE UPDATE ON public.gallery_tags
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default tags based on common beauty services
INSERT INTO public.gallery_tags (name, color, description) VALUES
  ('Antes e Depois', '#10B981', 'Transformações e resultados'),
  ('Tratamento Facial', '#8B5CF6', 'Cuidados faciais e estéticos'),
  ('Tratamento Corporal', '#F59E0B', 'Procedimentos corporais'),
  ('Massagem', '#06B6D4', 'Sessões de massagem e relaxamento'),
  ('Ambiente', '#84CC16', 'Espaços e instalações'),
  ('Equipa', '#EF4444', 'Profissionais e equipa'),
  ('Produtos', '#F97316', 'Produtos utilizados nos tratamentos');
