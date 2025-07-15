-- Create RPC functions for the appointment system

-- Function to get available time slots
CREATE OR REPLACE FUNCTION get_available_time_slots()
RETURNS TABLE (
  id UUID,
  time TIME,
  duration_minutes INTEGER,
  is_available BOOLEAN,
  max_concurrent INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT * FROM time_slots WHERE is_available = true ORDER BY time;
$$;

-- Function to get business hours
CREATE OR REPLACE FUNCTION get_business_hours()
RETURNS TABLE (
  id UUID,
  day_of_week INTEGER,
  open_time TIME,
  close_time TIME,
  is_active BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT * FROM business_hours WHERE is_active = true;
$$;

-- Function to get booked slots for a specific date
CREATE OR REPLACE FUNCTION get_booked_slots_for_date(selected_date DATE)
RETURNS TABLE (time_slot_id UUID)
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT a.time_slot_id 
  FROM appointments a 
  WHERE a.appointment_date = selected_date 
  AND a.status IN ('pending', 'confirmed');
$$;

-- Function to create an appointment with services
CREATE OR REPLACE FUNCTION create_appointment(
  p_client_name TEXT,
  p_client_phone TEXT,
  p_client_email TEXT,
  p_appointment_date DATE,
  p_time_slot_id UUID,
  p_notes TEXT,
  p_total_price DECIMAL(10,2),
  p_service_ids TEXT[]
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  appointment_id UUID;
  service_id TEXT;
BEGIN
  -- Insert appointment
  INSERT INTO appointments (
    client_name,
    client_phone,
    client_email,
    appointment_date,
    time_slot_id,
    notes,
    total_price,
    status
  ) VALUES (
    p_client_name,
    p_client_phone,
    p_client_email,
    p_appointment_date,
    p_time_slot_id,
    p_notes,
    p_total_price,
    'pending'
  ) RETURNING id INTO appointment_id;

  -- Insert appointment services
  FOREACH service_id IN ARRAY p_service_ids
  LOOP
    INSERT INTO appointment_services (appointment_id, service_id, price)
    SELECT appointment_id, service_id::UUID, COALESCE(
      NULLIF(regexp_replace(split_part(s.price_range, '-', 1), '[^0-9.]', '', 'g'), '')::DECIMAL(10,2),
      0
    )
    FROM services s
    WHERE s.id = service_id::UUID;
  END LOOP;

  RETURN appointment_id;
END;
$$;

-- Function to update appointment status
CREATE OR REPLACE FUNCTION update_appointment_status(
  appointment_id UUID,
  new_status TEXT
)
RETURNS VOID
LANGUAGE SQL
SECURITY DEFINER
AS $$
  UPDATE appointments 
  SET status = new_status, updated_at = NOW()
  WHERE id = appointment_id;
$$;

-- Function to get appointments with details
CREATE OR REPLACE FUNCTION get_appointments_with_details()
RETURNS TABLE (
  id UUID,
  client_name TEXT,
  client_phone TEXT,
  client_email TEXT,
  appointment_date DATE,
  time_slot_id UUID,
  status TEXT,
  notes TEXT,
  total_price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  time_slots_time TIME,
  time_slots_duration_minutes INTEGER,
  appointment_services JSONB
)
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT 
    a.id,
    a.client_name,
    a.client_phone,
    a.client_email,
    a.appointment_date,
    a.time_slot_id,
    a.status,
    a.notes,
    a.total_price,
    a.created_at,
    a.updated_at,
    ts.time as time_slots_time,
    ts.duration_minutes as time_slots_duration_minutes,
    COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'id', aps.id,
          'service_id', aps.service_id,
          'price', aps.price,
          'service_name', s.name
        )
      ) FILTER (WHERE aps.id IS NOT NULL),
      '[]'::jsonb
    ) as appointment_services
  FROM appointments a
  LEFT JOIN time_slots ts ON a.time_slot_id = ts.id
  LEFT JOIN appointment_services aps ON a.id = aps.appointment_id
  LEFT JOIN services s ON aps.service_id = s.id
  GROUP BY a.id, a.client_name, a.client_phone, a.client_email, 
           a.appointment_date, a.time_slot_id, a.status, a.notes, 
           a.total_price, a.created_at, a.updated_at, ts.time, ts.duration_minutes
  ORDER BY a.appointment_date DESC, ts.time ASC;
$$;