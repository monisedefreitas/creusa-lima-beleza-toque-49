
-- Adicionar campos para valores finais confirmados na tabela appointments
ALTER TABLE public.appointments 
ADD COLUMN final_price DECIMAL,
ADD COLUMN price_confirmed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN price_confirmed_by TEXT;

-- Comentários para documentar os novos campos
COMMENT ON COLUMN public.appointments.final_price IS 'Valor final confirmado pelo admin no momento da confirmação';
COMMENT ON COLUMN public.appointments.price_confirmed_at IS 'Timestamp quando o valor final foi confirmado';
COMMENT ON COLUMN public.appointments.price_confirmed_by IS 'ID do admin que confirmou o valor';
