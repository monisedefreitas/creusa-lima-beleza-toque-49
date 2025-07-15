
-- Fix infinite recursion in admin_users RLS policies by creating a security definer function
-- This prevents the policies from referencing the same table they're applied to

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can manage admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can read admin_users" ON public.admin_users;

-- Create a security definer function to check admin status without recursion
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE user_id = user_uuid 
    AND is_active = true
  );
$$;

-- Create new non-recursive policies using the security definer function
CREATE POLICY "Admins can manage admin_users" 
  ON public.admin_users 
  FOR ALL 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can read admin_users" 
  ON public.admin_users 
  FOR SELECT 
  USING (public.is_admin(auth.uid()));

-- Update other table policies to use the new function to prevent future recursion issues
-- Update addresses policies
DROP POLICY IF EXISTS "Admins can manage addresses" ON public.addresses;
CREATE POLICY "Admins can manage addresses" 
  ON public.addresses 
  FOR ALL 
  USING (public.is_admin(auth.uid()));

-- Update other admin policies similarly
DROP POLICY IF EXISTS "Admins can manage appointments" ON public.appointments;
CREATE POLICY "Admins can manage appointments" 
  ON public.appointments 
  FOR ALL 
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage appointment_services" ON public.appointment_services;
CREATE POLICY "Admins can manage appointment_services" 
  ON public.appointment_services 
  FOR ALL 
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage banners" ON public.banners;
CREATE POLICY "Admins can manage banners" 
  ON public.banners 
  FOR ALL 
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage business_hours" ON public.business_hours;
CREATE POLICY "Admins can manage business_hours" 
  ON public.business_hours 
  FOR ALL 
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage contact_info" ON public.contact_info;
CREATE POLICY "Admins can manage contact_info" 
  ON public.contact_info 
  FOR ALL 
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage content_sections" ON public.content_sections;
CREATE POLICY "Admins can manage content_sections" 
  ON public.content_sections 
  FOR ALL 
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage faqs" ON public.faqs;
CREATE POLICY "Admins can manage faqs" 
  ON public.faqs 
  FOR ALL 
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage media_gallery" ON public.media_gallery;
CREATE POLICY "Admins can manage media_gallery" 
  ON public.media_gallery 
  FOR ALL 
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage services" ON public.services;
CREATE POLICY "Admins can manage services" 
  ON public.services 
  FOR ALL 
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage site_settings" ON public.site_settings;
CREATE POLICY "Admins can manage site_settings" 
  ON public.site_settings 
  FOR ALL 
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage social_media" ON public.social_media;
CREATE POLICY "Admins can manage social_media" 
  ON public.social_media 
  FOR ALL 
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage time_slots" ON public.time_slots;
CREATE POLICY "Admins can manage time_slots" 
  ON public.time_slots 
  FOR ALL 
  USING (public.is_admin(auth.uid()));
