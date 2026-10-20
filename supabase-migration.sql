-- ============================================
-- Moorthy Arts Billboard Management System
-- Database Migration Script
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CITIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS cities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  zoom_level INTEGER DEFAULT 12,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SITES TABLE
-- ============================================
CREATE TYPE site_status AS ENUM ('available', 'booked', 'maintenance');
CREATE TYPE site_type AS ENUM ('hoarding', 'unipole', 'bus_shelter', 'gantry', 'wall_painting');

CREATE TABLE IF NOT EXISTS sites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  city_id UUID REFERENCES cities(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  size TEXT,
  type site_type DEFAULT 'hoarding',
  rate_monthly INTEGER DEFAULT 0,
  rate_yearly INTEGER DEFAULT 0,
  status site_status DEFAULT 'available',
  image_url TEXT,
  description TEXT,
  facing TEXT,
  traffic_info TEXT,
  illumination BOOLEAN DEFAULT false,
  booked_by TEXT,
  booked_until DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INQUIRIES TABLE
-- ============================================
CREATE TYPE inquiry_status AS ENUM ('new', 'contacted', 'confirmed', 'rejected');

CREATE TABLE IF NOT EXISTS inquiries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  site_id UUID REFERENCES sites(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT,
  message TEXT,
  status inquiry_status DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Public read access for cities and available sites
CREATE POLICY "Public can read cities" ON cities
  FOR SELECT USING (true);

CREATE POLICY "Public can read sites" ON sites
  FOR SELECT USING (true);

-- Public can create inquiries
CREATE POLICY "Public can create inquiries" ON inquiries
  FOR INSERT WITH CHECK (true);

-- Service role (admin) has full access
CREATE POLICY "Admin full access cities" ON cities
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admin full access sites" ON sites
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admin full access inquiries" ON inquiries
  FOR ALL USING (auth.role() = 'service_role');

-- Authenticated users (admin) can do everything
CREATE POLICY "Authenticated users manage cities" ON cities
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users manage sites" ON sites
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users manage inquiries" ON inquiries
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sites_updated_at
  BEFORE UPDATE ON sites
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA - Cities
-- ============================================
INSERT INTO cities (name, lat, lng, zoom_level) VALUES
  ('Salem', 11.6643, 78.1460, 13),
  ('Chennai', 13.0827, 80.2707, 12),
  ('Dharmapuri', 12.1211, 78.1582, 13)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- SEED DATA - Sample Billboard Sites
-- ============================================

-- Salem Sites
INSERT INTO sites (city_id, name, address, lat, lng, size, type, rate_monthly, rate_yearly, status, description, facing, traffic_info, illumination) VALUES
  ((SELECT id FROM cities WHERE name = 'Salem'), 'Salem Bus Stand Junction', 'Near New Bus Stand, Salem', 11.6520, 78.1580, '40ft x 20ft', 'hoarding', 35000, 350000, 'available', 'Prime location near Salem New Bus Stand with heavy footfall. Visible from main road and bus terminal entrance.', 'East', 'High traffic - 50,000+ daily commuters', true),
  ((SELECT id FROM cities WHERE name = 'Salem'), 'Five Roads Circle', 'Five Roads Junction, Salem', 11.6690, 78.1530, '30ft x 15ft', 'unipole', 28000, 280000, 'available', 'Iconic Five Roads junction - one of the busiest intersections in Salem. 360° visibility.', 'North-East', 'Very high traffic - Major junction', true),
  ((SELECT id FROM cities WHERE name = 'Salem'), 'Omalur Road Entry', 'Omalur Main Road, Salem', 11.6450, 78.1350, '20ft x 10ft', 'hoarding', 18000, 180000, 'available', 'Entry point from Omalur side. First billboard visible when entering Salem city.', 'South', 'Moderate traffic - Highway entry point', false),
  ((SELECT id FROM cities WHERE name = 'Salem'), 'Fairlands Signal', 'Fairlands, Salem', 11.6750, 78.1420, '35ft x 15ft', 'hoarding', 32000, 320000, 'booked', 'Premium residential and commercial area. Near Fairlands shopping complex.', 'West', 'High traffic - Commercial area', true),
  ((SELECT id FROM cities WHERE name = 'Salem'), 'Junction Mall Area', 'Cherry Road, Salem', 11.6580, 78.1490, '25ft x 12ft', 'wall_painting', 15000, 150000, 'available', 'Near Junction Mall and Cherry Road commercial hub. Young demographic audience.', 'North', 'High footfall - Shopping area', false);

-- Chennai Sites
INSERT INTO sites (city_id, name, address, lat, lng, size, type, rate_monthly, rate_yearly, status, description, facing, traffic_info, illumination) VALUES
  ((SELECT id FROM cities WHERE name = 'Chennai'), 'Anna Nagar Tower', 'Anna Nagar 2nd Avenue, Chennai', 13.0850, 80.2100, '50ft x 25ft', 'unipole', 75000, 750000, 'available', 'Landmark location near Anna Nagar Tower Park. Premium residential area with high visibility.', 'South', 'Very high traffic - 80,000+ daily', true),
  ((SELECT id FROM cities WHERE name = 'Chennai'), 'Koyambedu Junction', 'Near Koyambedu Bus Terminal, Chennai', 13.0694, 80.1948, '40ft x 20ft', 'hoarding', 65000, 650000, 'available', 'Adjacent to Koyambedu CMBT - largest bus terminal in Asia. Massive daily footfall.', 'East', 'Extremely high traffic - Bus terminal area', true),
  ((SELECT id FROM cities WHERE name = 'Chennai'), 'Vadapalani Signal', 'Vadapalani Junction, Chennai', 13.0520, 80.2120, '35ft x 18ft', 'gantry', 55000, 550000, 'booked', 'Major junction connecting multiple arterial roads. Near Vadapalani Murugan Temple.', 'North', 'Very high traffic - Temple & commercial area', true),
  ((SELECT id FROM cities WHERE name = 'Chennai'), 'OMR Thoraipakkam', 'Old Mahabalipuram Road, Chennai', 12.9380, 80.2330, '45ft x 20ft', 'unipole', 60000, 600000, 'available', 'IT corridor - visible to lakhs of IT professionals daily. Premium corporate audience.', 'West', 'High traffic - IT corridor', true),
  ((SELECT id FROM cities WHERE name = 'Chennai'), 'T Nagar Pondy Bazaar', 'Pondy Bazaar, T Nagar, Chennai', 13.0418, 80.2341, '30ft x 15ft', 'hoarding', 70000, 700000, 'available', 'Shopping capital of Chennai. Pondy Bazaar attracts massive crowds especially on weekends.', 'South-East', 'Extremely high footfall - Shopping district', true);

-- Dharmapuri Sites
INSERT INTO sites (city_id, name, address, lat, lng, size, type, rate_monthly, rate_yearly, status, description, facing, traffic_info, illumination) VALUES
  ((SELECT id FROM cities WHERE name = 'Dharmapuri'), 'Dharmapuri Bus Stand', 'Near Bus Stand, Dharmapuri', 12.1270, 78.1600, '30ft x 15ft', 'hoarding', 15000, 150000, 'available', 'Central bus stand area - highest footfall in Dharmapuri. Visible to all commuters.', 'East', 'High traffic - Bus stand area', true),
  ((SELECT id FROM cities WHERE name = 'Dharmapuri'), 'Salem-Bangalore Highway Entry', 'NH44, Dharmapuri', 12.1150, 78.1450, '40ft x 20ft', 'unipole', 20000, 200000, 'available', 'National Highway 44 entry point. Visible to all highway traffic between Salem and Bangalore.', 'North', 'Very high traffic - National Highway', true),
  ((SELECT id FROM cities WHERE name = 'Dharmapuri'), 'Collectorate Road', 'Near Collectorate, Dharmapuri', 12.1300, 78.1550, '25ft x 12ft', 'hoarding', 12000, 120000, 'available', 'Government area with steady traffic. Near District Collectorate and courts.', 'West', 'Moderate traffic - Government area', false),
  ((SELECT id FROM cities WHERE name = 'Dharmapuri'), 'Pennagaram Road Junction', 'Pennagaram Main Road, Dharmapuri', 12.1180, 78.1680, '20ft x 10ft', 'wall_painting', 8000, 80000, 'booked', 'Key junction connecting to Pennagaram. Good visibility for local businesses.', 'South', 'Moderate traffic - Junction area', false),
  ((SELECT id FROM cities WHERE name = 'Dharmapuri'), 'Adhiyamaan College Road', 'Near Adhiyamaan College, Dharmapuri', 12.1350, 78.1700, '30ft x 15ft', 'hoarding', 10000, 100000, 'available', 'College area with young demographic. High visibility during college hours.', 'North-East', 'Moderate traffic - Educational area', false);
