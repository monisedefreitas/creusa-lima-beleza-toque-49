
-- Fix infinite recursion in admin_users RLS policies
DROP POLICY IF EXISTS "Admins can manage admin_users" ON admin_users;
DROP POLICY IF EXISTS "Admins can read admin_users" ON admin_users;

-- Create a security definer function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users 
    WHERE user_id = auth.uid() AND is_active = true
  );
$$;

-- Create new admin policies using the function
CREATE POLICY "Admins can read admin_users" ON admin_users
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can manage admin_users" ON admin_users
  FOR ALL USING (public.is_admin());

-- Create business hours table
CREATE TABLE business_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
  open_time TIME NOT NULL,
  close_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create time slots table
CREATE TABLE time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  is_available BOOLEAN DEFAULT true,
  max_concurrent INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT,
  appointment_date DATE NOT NULL,
  time_slot_id UUID REFERENCES time_slots(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes TEXT,
  total_price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointment services junction table
CREATE TABLE appointment_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id),
  price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blocked dates table
CREATE TABLE blocked_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocked_date DATE NOT NULL,
  reason TEXT,
  is_recurring BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;

-- Create policies for business_hours
CREATE POLICY "Public can read business_hours" ON business_hours
  FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage business_hours" ON business_hours
  FOR ALL USING (public.is_admin());

-- Create policies for time_slots
CREATE POLICY "Public can read time_slots" ON time_slots
  FOR SELECT USING (is_available = true);
CREATE POLICY "Admins can manage time_slots" ON time_slots
  FOR ALL USING (public.is_admin());

-- Create policies for appointments
CREATE POLICY "Public can create appointments" ON appointments
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage appointments" ON appointments
  FOR ALL USING (public.is_admin());

-- Create policies for appointment_services
CREATE POLICY "Public can create appointment_services" ON appointment_services
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage appointment_services" ON appointment_services
  FOR ALL USING (public.is_admin());

-- Create policies for blocked_dates
CREATE POLICY "Public can read blocked_dates" ON blocked_dates
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage blocked_dates" ON blocked_dates
  FOR ALL USING (public.is_admin());

-- Add triggers for updated_at
CREATE TRIGGER update_business_hours_updated_at BEFORE UPDATE ON business_hours FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_time_slots_updated_at BEFORE UPDATE ON time_slots FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_blocked_dates_updated_at BEFORE UPDATE ON blocked_dates FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Insert default business hours (Monday to Friday 9-18, Saturday 9-17)
INSERT INTO business_hours (day_of_week, open_time, close_time) VALUES
(1, '09:00', '18:00'), -- Monday
(2, '09:00', '18:00'), -- Tuesday
(3, '09:00', '18:00'), -- Wednesday
(4, '09:00', '18:00'), -- Thursday
(5, '09:00', '18:00'), -- Friday
(6, '09:00', '17:00'); -- Saturday

-- Insert default time slots (every 30 minutes)
INSERT INTO time_slots (time, duration_minutes) VALUES
('09:00', 60), ('10:00', 60), ('11:00', 60), ('12:00', 60),
('14:00', 60), ('15:00', 60), ('16:00', 60), ('17:00', 60);

-- Insert a default admin user (replace with actual email)
INSERT INTO admin_users (email, user_id, is_active) 
VALUES ('admin@creusalima.com', NULL, true)
ON CONFLICT (email) DO NOTHING;
