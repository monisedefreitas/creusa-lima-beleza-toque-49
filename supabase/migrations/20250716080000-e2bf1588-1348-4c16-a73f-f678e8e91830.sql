
-- Configure Realtime for appointments table
ALTER TABLE public.appointments REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;

-- Configure Realtime for banners table
ALTER TABLE public.banners REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.banners;

-- Configure Realtime for media_gallery table
ALTER TABLE public.media_gallery REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.media_gallery;

-- Create message_templates table
CREATE TABLE public.message_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'whatsapp_confirmation',
  subject TEXT,
  content TEXT NOT NULL,
  variables JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for message_templates
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage message_templates" 
  ON public.message_templates 
  FOR ALL 
  USING (is_admin(auth.uid()));

-- Create trigger for updated_at
CREATE TRIGGER update_message_templates_updated_at 
  BEFORE UPDATE ON public.message_templates 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default WhatsApp confirmation template
INSERT INTO public.message_templates (name, type, content, variables, is_default) 
VALUES (
  'Confirmação de Marcação WhatsApp',
  'whatsapp_confirmation',
  'Olá {{client_name}}! 

Confirmamos a sua marcação para {{appointment_date}} às {{appointment_time}}.

Serviços agendados:
{{services_list}}

Estamos ansiosos para recebê-la!

Atenciosamente,
Equipa da clínica',
  '["client_name", "appointment_date", "appointment_time", "services_list", "total_price"]'::jsonb,
  true
);

-- Create notifications table for persistent history
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'new_appointment',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  appointment_id UUID REFERENCES public.appointments(id),
  client_name TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage notifications" 
  ON public.notifications 
  FOR ALL 
  USING (is_admin(auth.uid()));

-- Configure Realtime for notifications table
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
