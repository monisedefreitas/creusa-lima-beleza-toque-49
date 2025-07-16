
-- Criar tabela para depoimentos
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  message TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_approved BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar RLS à tabela de depoimentos
ALTER TABLE public.testimonials ENABLE ROW LEVEL Security;

-- Política para permitir que qualquer pessoa crie depoimentos
CREATE POLICY "Anyone can create testimonials" 
  ON public.testimonials 
  FOR INSERT 
  WITH CHECK (true);

-- Política para admins gerirem depoimentos
CREATE POLICY "Admins can manage testimonials" 
  ON public.testimonials 
  FOR ALL 
  USING (is_admin(auth.uid()));

-- Política para ler depoimentos aprovados publicamente
CREATE POLICY "Public can read approved testimonials" 
  ON public.testimonials 
  FOR SELECT 
  USING (is_approved = true);

-- Adicionar trigger para atualizar updated_at
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
