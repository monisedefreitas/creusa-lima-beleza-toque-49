
-- Create tables for the appointment system

-- Time slots table
CREATE TABLE public.time_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  is_available BOOLEAN NOT NULL DEFAULT true,
  max_concurrent INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Business hours table
CREATE TABLE public.business_hours (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  open_time TIME NOT NULL,
  close_time TIME NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT,
  appointment_date DATE NOT NULL,
  time_slot_id UUID NOT NULL REFERENCES public.time_slots(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes TEXT,
  total_price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Appointment services junction table
CREATE TABLE public.appointment_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id),
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_services ENABLE ROW LEVEL SECURITY;

-- Time slots policies
CREATE POLICY "Public can read time_slots" ON public.time_slots FOR SELECT USING (is_available = true);
CREATE POLICY "Admins can manage time_slots" ON public.time_slots FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

-- Business hours policies
CREATE POLICY "Public can read business_hours" ON public.business_hours FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage business_hours" ON public.business_hours FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

-- Appointments policies
CREATE POLICY "Public can create appointments" ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage appointments" ON public.appointments FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

-- Appointment services policies
CREATE POLICY "Public can create appointment_services" ON public.appointment_services FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage appointment_services" ON public.appointment_services FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

-- Add triggers for updated_at
CREATE TRIGGER update_time_slots_updated_at BEFORE UPDATE ON public.time_slots
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_business_hours_updated_at BEFORE UPDATE ON public.business_hours
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Insert default time slots (9:00 to 18:00, excluding lunch 13:00-14:00)
INSERT INTO public.time_slots (time, duration_minutes) VALUES
  ('09:00', 60),
  ('10:00', 60),
  ('11:00', 60),
  ('12:00', 60),
  ('14:00', 60),
  ('15:00', 60),
  ('16:00', 60),
  ('17:00', 60);

-- Insert default business hours (Monday to Saturday)
INSERT INTO public.business_hours (day_of_week, open_time, close_time) VALUES
  (1, '09:00', '18:00'), -- Monday
  (2, '09:00', '18:00'), -- Tuesday
  (3, '09:00', '18:00'), -- Wednesday
  (4, '09:00', '18:00'), -- Thursday
  (5, '09:00', '18:00'), -- Friday
  (6, '09:00', '17:00'); -- Saturday
