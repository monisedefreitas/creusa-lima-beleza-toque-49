
-- Criar tabela de clientes separada
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  notes TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_clients_phone ON public.clients(phone);
CREATE INDEX idx_clients_name ON public.clients(name);

-- Adicionar coluna client_id na tabela appointments
ALTER TABLE public.appointments 
ADD COLUMN client_id UUID REFERENCES public.clients(id),
ADD COLUMN next_session_date DATE,
ADD COLUMN status_history JSONB DEFAULT '[]';

-- Atualizar tabela services para incluir image_url se não existir
-- (verificar se já existe)
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='services' AND column_name='image_url') THEN
    ALTER TABLE public.services ADD COLUMN image_url TEXT;
  END IF;
END $$;

-- RLS policies para clientes
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage clients" 
  ON public.clients 
  FOR ALL 
  USING (is_admin(auth.uid()));

-- Trigger para atualizar updated_at em clients
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Função para migrar dados existentes de appointments para clients
CREATE OR REPLACE FUNCTION migrate_appointment_clients()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  appointment_record RECORD;
  client_id_var UUID;
BEGIN
  FOR appointment_record IN 
    SELECT DISTINCT client_name, client_phone, client_email 
    FROM public.appointments 
    WHERE client_id IS NULL
  LOOP
    -- Verificar se cliente já existe
    SELECT id INTO client_id_var 
    FROM public.clients 
    WHERE phone = appointment_record.client_phone;
    
    -- Se não existe, criar novo cliente
    IF client_id_var IS NULL THEN
      INSERT INTO public.clients (name, phone, email)
      VALUES (appointment_record.client_name, appointment_record.client_phone, appointment_record.client_email)
      RETURNING id INTO client_id_var;
    END IF;
    
    -- Atualizar appointments com client_id
    UPDATE public.appointments 
    SET client_id = client_id_var
    WHERE client_phone = appointment_record.client_phone 
    AND client_id IS NULL;
  END LOOP;
END;
$$;

-- Executar migração
SELECT migrate_appointment_clients();

-- Remover função de migração (limpeza)
DROP FUNCTION migrate_appointment_clients();
