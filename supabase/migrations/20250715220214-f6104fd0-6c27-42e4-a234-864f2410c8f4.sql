
-- Create enum for content types
CREATE TYPE content_type AS ENUM ('hero_banner', 'about_section', 'services_section', 'contact_section', 'footer');

-- Create enum for social media platforms
CREATE TYPE social_platform AS ENUM ('instagram', 'facebook', 'whatsapp', 'phone', 'email');

-- Create enum for media types
CREATE TYPE media_type AS ENUM ('image', 'video');

-- Site settings table for general configurations
CREATE TABLE site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content management table for all text content
CREATE TABLE content_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_type content_type NOT NULL,
    title TEXT,
    subtitle TEXT,
    content TEXT,
    button_text TEXT,
    button_link TEXT,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact information table
CREATE TABLE contact_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL, -- 'phone', 'email', 'address', 'hours'
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social media links table
CREATE TABLE social_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform social_platform NOT NULL,
    username TEXT,
    url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services table
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    short_description TEXT,
    price_range TEXT,
    duration_minutes INTEGER,
    category TEXT,
    image_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FAQ table
CREATE TABLE faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT,
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media gallery table
CREATE TABLE media_gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type media_type NOT NULL,
    alt_text TEXT,
    category TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Banners table for promotional content
CREATE TABLE banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    image_url TEXT,
    button_text TEXT,
    button_link TEXT,
    position TEXT DEFAULT 'hero', -- 'hero', 'middle', 'footer'
    is_active BOOLEAN DEFAULT true,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Addresses/locations table
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    street_address TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT,
    country TEXT DEFAULT 'Portugal',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_primary BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users table for panel access
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Enable RLS on all tables
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public can read content_sections" ON content_sections FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read contact_info" ON contact_info FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read social_media" ON social_media FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read faqs" ON faqs FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read media_gallery" ON media_gallery FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read banners" ON banners FOR SELECT USING (is_active = true AND (start_date IS NULL OR start_date <= NOW()) AND (end_date IS NULL OR end_date >= NOW()));
CREATE POLICY "Public can read addresses" ON addresses FOR SELECT USING (is_active = true);

-- Create admin policies (users in admin_users table)
CREATE POLICY "Admins can manage site_settings" ON site_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

CREATE POLICY "Admins can manage content_sections" ON content_sections FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

CREATE POLICY "Admins can manage contact_info" ON contact_info FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

CREATE POLICY "Admins can manage social_media" ON social_media FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

CREATE POLICY "Admins can manage services" ON services FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

CREATE POLICY "Admins can manage faqs" ON faqs FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

CREATE POLICY "Admins can manage media_gallery" ON media_gallery FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

CREATE POLICY "Admins can manage banners" ON banners FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

CREATE POLICY "Admins can manage addresses" ON addresses FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

CREATE POLICY "Admins can read admin_users" ON admin_users FOR SELECT USING (
    EXISTS (SELECT 1 FROM admin_users au WHERE au.user_id = auth.uid() AND au.is_active = true)
);

CREATE POLICY "Admins can manage admin_users" ON admin_users FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users au WHERE au.user_id = auth.uid() AND au.is_active = true)
);

-- Insert default data
INSERT INTO site_settings (key, value, description) VALUES
('site_title', 'Creusa Lima - Beleza e Estética', 'Título principal do site'),
('site_description', 'Centro de beleza e estética em Cantanhede', 'Descrição do site para SEO'),
('business_name', 'Creusa Lima', 'Nome do negócio'),
('business_tagline', 'Beleza e Estética', 'Slogan do negócio'),
('google_analytics_id', '', 'ID do Google Analytics'),
('primary_color', '#2D5016', 'Cor primária do site'),
('secondary_color', '#8B5A2B', 'Cor secundária do site');

INSERT INTO contact_info (type, label, value, is_primary, order_index) VALUES
('phone', 'Telefone Principal', '+351 964 481 966', true, 1),
('email', 'Email Principal', 'info@creusalima.com', true, 2),
('address', 'Morada Principal', 'Cantanhede, Portugal', true, 3),
('hours', 'Horário de Funcionamento', 'Segunda a Sexta: 9h-18h', false, 4);

INSERT INTO social_media (platform, username, url, order_index) VALUES
('instagram', 'creusalima_estetica', 'https://instagram.com/creusalima_estetica', 1),
('whatsapp', '', 'https://wa.me/351964481966', 2);

INSERT INTO addresses (name, street_address, city, postal_code, country, is_primary) VALUES
('Clínica Principal', 'Rua Principal, 123', 'Cantanhede', '3060-000', 'Portugal', true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_content_sections_updated_at BEFORE UPDATE ON content_sections FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_contact_info_updated_at BEFORE UPDATE ON contact_info FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_social_media_updated_at BEFORE UPDATE ON social_media FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_media_gallery_updated_at BEFORE UPDATE ON media_gallery FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_banners_updated_at BEFORE UPDATE ON banners FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
