/*
  # Bisklet Database Schema - Complete Setup

  1. New Tables
    - `users` - User accounts and profiles
    - `bikes` - Bike fleet management
    - `trips` - Ride tracking and history
    - `payments` - Payment transactions
    - `locations` - Ethiopian locations and zones
    - `maintenance_logs` - Bike maintenance records
    - `user_sessions` - Active user sessions
    - `system_alerts` - Admin notifications
    - `ethiopian_holidays` - Ethiopian holidays and events

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users and admin access
    - Secure payment and user data

  3. Ethiopian-specific Features
    - Ethiopian locations with Amharic names
    - ETB currency support
    - Local payment methods integration
    - Cultural holidays and events
*/

-- Enable PostGIS extension for geographic data
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create custom function for updating timestamps (drop first to avoid conflicts)
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  phone text UNIQUE NOT NULL,
  password_hash text,
  full_name text NOT NULL,
  full_name_amharic text,
  government_id text,
  verified boolean DEFAULT false,
  wallet_balance numeric(10,2) DEFAULT 0.00,
  total_rides integer DEFAULT 0,
  profile_image_url text,
  preferred_language text DEFAULT 'en' CHECK (preferred_language IN ('en', 'am', 'or')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_active timestamptz DEFAULT now()
);

-- Bikes table
CREATE TABLE IF NOT EXISTS bikes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bike_code text UNIQUE NOT NULL,
  qr_code text UNIQUE NOT NULL,
  model text NOT NULL,
  current_location geography(Point, 4326),
  current_location_name text,
  current_location_amharic text,
  battery_level integer DEFAULT 100 CHECK (battery_level >= 0 AND battery_level <= 100),
  status text DEFAULT 'available' CHECK (status IN ('available', 'in_use', 'maintenance', 'unavailable')),
  last_maintenance date,
  total_rides integer DEFAULT 0,
  total_distance_km numeric(10,2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Locations table
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_amharic text NOT NULL,
  district text NOT NULL,
  district_amharic text,
  coordinates geography(Point, 4326) NOT NULL,
  is_popular boolean DEFAULT false,
  bike_capacity integer DEFAULT 20,
  current_bikes integer DEFAULT 0,
  demand_level text DEFAULT 'medium' CHECK (demand_level IN ('low', 'medium', 'high')),
  created_at timestamptz DEFAULT now()
);

-- Trips table
CREATE TABLE IF NOT EXISTS trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  bike_id uuid REFERENCES bikes(id) ON DELETE CASCADE,
  start_time timestamptz DEFAULT now() NOT NULL,
  end_time timestamptz,
  start_location geography(Point, 4326),
  end_location geography(Point, 4326),
  start_location_name text,
  end_location_name text,
  distance_km numeric(6,2) DEFAULT 0.00,
  duration_minutes integer,
  cost_etb numeric(6,2) DEFAULT 0.00,
  payment_method text,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  trip_id uuid REFERENCES trips(id) ON DELETE SET NULL,
  amount_etb numeric(10,2) NOT NULL,
  payment_method text NOT NULL CHECK (payment_method IN ('telebirr', 'cbe_birr', 'dashen_bank', 'awash_bank', 'cash', 'wallet')),
  transaction_id text UNIQUE,
  external_reference text,
  status text DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'cancelled', 'refunded')),
  payment_type text DEFAULT 'ride' CHECK (payment_type IN ('ride', 'wallet_topup', 'refund')),
  metadata jsonb,
  processed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Maintenance logs table
CREATE TABLE IF NOT EXISTS maintenance_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bike_id uuid REFERENCES bikes(id) ON DELETE CASCADE,
  maintenance_type text NOT NULL CHECK (maintenance_type IN ('routine', 'repair', 'battery', 'cleaning', 'inspection')),
  description text NOT NULL,
  cost_etb numeric(8,2) DEFAULT 0.00,
  technician_name text,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  scheduled_date date,
  completed_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  session_token text UNIQUE NOT NULL,
  device_info jsonb,
  ip_address inet,
  location_info jsonb,
  is_active boolean DEFAULT true,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_activity timestamptz DEFAULT now()
);

-- System alerts table
CREATE TABLE IF NOT EXISTS system_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type text NOT NULL CHECK (alert_type IN ('low_battery', 'maintenance_due', 'high_demand', 'system_error', 'payment_issue', 'holiday_preparation')),
  title text NOT NULL,
  message text NOT NULL,
  severity text DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  entity_type text CHECK (entity_type IN ('bike', 'user', 'location', 'payment', 'system')),
  entity_id uuid,
  is_resolved boolean DEFAULT false,
  resolved_at timestamptz,
  resolved_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- Ethiopian holidays table
CREATE TABLE IF NOT EXISTS ethiopian_holidays (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_amharic text NOT NULL,
  date date NOT NULL,
  holiday_type text NOT NULL CHECK (holiday_type IN ('religious', 'cultural', 'national')),
  description text,
  impact_on_operations text,
  is_recurring boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance (with IF NOT EXISTS checks)
DO $$
BEGIN
  -- Users indexes
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_email') THEN
    CREATE INDEX idx_users_email ON users(email);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_phone') THEN
    CREATE INDEX idx_users_phone ON users(phone);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_status') THEN
    CREATE INDEX idx_users_status ON users(status);
  END IF;

  -- Bikes indexes
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_bikes_status') THEN
    CREATE INDEX idx_bikes_status ON bikes(status);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_bikes_location') THEN
    CREATE INDEX idx_bikes_location ON bikes USING GIST(current_location);
  END IF;

  -- Locations indexes
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_locations_coordinates') THEN
    CREATE INDEX idx_locations_coordinates ON locations USING GIST(coordinates);
  END IF;

  -- Trips indexes
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_trips_user_id') THEN
    CREATE INDEX idx_trips_user_id ON trips(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_trips_bike_id') THEN
    CREATE INDEX idx_trips_bike_id ON trips(bike_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_trips_status') THEN
    CREATE INDEX idx_trips_status ON trips(status);
  END IF;

  -- Payments indexes
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payments_user_id') THEN
    CREATE INDEX idx_payments_user_id ON payments(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payments_status') THEN
    CREATE INDEX idx_payments_status ON payments(status);
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bikes ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ethiopian_holidays ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts, then recreate them
DO $$
BEGIN
  -- Drop all existing policies for users table
  DROP POLICY IF EXISTS "Users can read own data" ON users;
  DROP POLICY IF EXISTS "Users can update own data" ON users;
  DROP POLICY IF EXISTS "Admin full access to users" ON users;
  
  -- Drop all existing policies for bikes table
  DROP POLICY IF EXISTS "Anyone can read available bikes" ON bikes;
  DROP POLICY IF EXISTS "Admin can manage all bikes" ON bikes;
  
  -- Drop all existing policies for locations table
  DROP POLICY IF EXISTS "Anyone can read locations" ON locations;
  
  -- Drop all existing policies for trips table
  DROP POLICY IF EXISTS "Users can read own trips" ON trips;
  DROP POLICY IF EXISTS "Users can create own trips" ON trips;
  DROP POLICY IF EXISTS "Users can update own active trips" ON trips;
  DROP POLICY IF EXISTS "Admin full access to trips" ON trips;
  
  -- Drop all existing policies for payments table
  DROP POLICY IF EXISTS "Users can read own payments" ON payments;
  DROP POLICY IF EXISTS "Users can create own payments" ON payments;
  DROP POLICY IF EXISTS "Admin full access to payments" ON payments;
  
  -- Drop all existing policies for maintenance_logs table
  DROP POLICY IF EXISTS "Admin full access to maintenance_logs" ON maintenance_logs;
  
  -- Drop all existing policies for system_alerts table
  DROP POLICY IF EXISTS "Admin full access to system_alerts" ON system_alerts;
END $$;

-- Create RLS policies

-- Users policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admin full access to users" ON users
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Bikes policies
CREATE POLICY "Anyone can read available bikes" ON bikes
  FOR SELECT TO authenticated
  USING (status = 'available');

CREATE POLICY "Admin can manage all bikes" ON bikes
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Locations policies
CREATE POLICY "Anyone can read locations" ON locations
  FOR SELECT TO authenticated
  USING (true);

-- Trips policies
CREATE POLICY "Users can read own trips" ON trips
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own trips" ON trips
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own active trips" ON trips
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id AND status = 'active');

CREATE POLICY "Admin full access to trips" ON trips
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Payments policies
CREATE POLICY "Users can read own payments" ON payments
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own payments" ON payments
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin full access to payments" ON payments
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Maintenance logs policies
CREATE POLICY "Admin full access to maintenance_logs" ON maintenance_logs
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- System alerts policies
CREATE POLICY "Admin full access to system_alerts" ON system_alerts
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Drop existing triggers to avoid conflicts, then recreate them
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_bikes_updated_at ON bikes;
DROP TRIGGER IF EXISTS update_trips_updated_at ON trips;
DROP TRIGGER IF EXISTS update_maintenance_logs_updated_at ON maintenance_logs;

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bikes_updated_at
  BEFORE UPDATE ON bikes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trips_updated_at
  BEFORE UPDATE ON trips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_logs_updated_at
  BEFORE UPDATE ON maintenance_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing (using INSERT ... ON CONFLICT to handle duplicates properly)

-- Sample users (only insert if they don't exist)
DO $$
BEGIN
  -- Insert admin user
  INSERT INTO users (email, phone, full_name, full_name_amharic, verified, wallet_balance, preferred_language) 
  VALUES ('admin@bikeshare.et', '+251911000001', 'Admin User', 'አድሚን ተጠቃሚ', true, 1000.00, 'en')
  ON CONFLICT (email) DO NOTHING;
  
  -- Insert test user 1
  INSERT INTO users (email, phone, full_name, full_name_amharic, verified, wallet_balance, preferred_language) 
  VALUES ('user1@example.com', '+251911000002', 'Abebe Kebede', 'አበበ ከበደ', true, 50.00, 'am')
  ON CONFLICT (email) DO NOTHING;
  
  -- Insert test user 2
  INSERT INTO users (email, phone, full_name, full_name_amharic, verified, wallet_balance, preferred_language) 
  VALUES ('user2@example.com', '+251911000003', 'Tigist Haile', 'ትግስት ሃይሌ', true, 75.50, 'en')
  ON CONFLICT (email) DO NOTHING;
  
  -- Insert test user 3
  INSERT INTO users (email, phone, full_name, full_name_amharic, verified, wallet_balance, preferred_language) 
  VALUES ('user3@example.com', '+251911000004', 'Dawit Mekonen', 'ዳዊት መኮንን', false, 0.00, 'en')
  ON CONFLICT (email) DO NOTHING;
  
  -- Insert test user 4
  INSERT INTO users (email, phone, full_name, full_name_amharic, verified, wallet_balance, preferred_language) 
  VALUES ('user4@example.com', '+251911000005', 'Sara Ahmed', 'ሳራ አህመድ', true, 78.25, 'or')
  ON CONFLICT (email) DO NOTHING;
END $$;

-- Sample locations (only insert if they don't exist by name)
DO $$
BEGIN
  INSERT INTO locations (name, name_amharic, district, district_amharic, coordinates, is_popular, bike_capacity) 
  VALUES ('Meskel Square', 'መስቀል አደባባይ', 'Addis Ketema', 'አዲስ ከተማ', ST_GeogFromText('POINT(38.7578 9.0054)'), true, 30)
  ON CONFLICT DO NOTHING;
  
  INSERT INTO locations (name, name_amharic, district, district_amharic, coordinates, is_popular, bike_capacity) 
  VALUES ('Bole Airport', 'ቦሌ አየር ማረፊያ', 'Bole', 'ቦሌ', ST_GeogFromText('POINT(38.7992 8.9806)'), true, 25)
  ON CONFLICT DO NOTHING;
  
  INSERT INTO locations (name, name_amharic, district, district_amharic, coordinates, is_popular, bike_capacity) 
  VALUES ('Piazza', 'ፒያሳ', 'Arada', 'አራዳ', ST_GeogFromText('POINT(38.7469 9.0348)'), true, 20)
  ON CONFLICT DO NOTHING;
  
  INSERT INTO locations (name, name_amharic, district, district_amharic, coordinates, is_popular, bike_capacity) 
  VALUES ('Mercato', 'መርካቶ', 'Addis Ketema', 'አዲስ ከተማ', ST_GeogFromText('POINT(38.7297 9.0157)'), false, 15)
  ON CONFLICT DO NOTHING;
  
  INSERT INTO locations (name, name_amharic, district, district_amharic, coordinates, is_popular, bike_capacity) 
  VALUES ('Mexico Square', 'ሜክሲኮ አደባባይ', 'Kirkos', 'ቂርቆስ', ST_GeogFromText('POINT(38.7489 9.0189)'), true, 35)
  ON CONFLICT DO NOTHING;
  
  INSERT INTO locations (name, name_amharic, district, district_amharic, coordinates, is_popular, bike_capacity) 
  VALUES ('Unity Park', 'አንድነት ፓርክ', 'Addis Ketema', 'አዲስ ከተማ', ST_GeogFromText('POINT(38.7614 9.0227)'), true, 25)
  ON CONFLICT DO NOTHING;
END $$;

-- Sample bikes (only insert if they don't exist by bike_code)
DO $$
BEGIN
  INSERT INTO bikes (bike_code, qr_code, model, current_location, current_location_name, current_location_amharic, battery_level, status) 
  VALUES ('BK001', 'QR001', 'EcoBike Pro', ST_GeogFromText('POINT(38.7578 9.0054)'), 'Meskel Square', 'መስቀል አደባባይ', 85, 'available')
  ON CONFLICT (bike_code) DO NOTHING;
  
  INSERT INTO bikes (bike_code, qr_code, model, current_location, current_location_name, current_location_amharic, battery_level, status) 
  VALUES ('BK002', 'QR002', 'EcoBike Pro', ST_GeogFromText('POINT(38.7992 8.9806)'), 'Bole Airport', 'ቦሌ አየር ማረፊያ', 92, 'available')
  ON CONFLICT (bike_code) DO NOTHING;
  
  INSERT INTO bikes (bike_code, qr_code, model, current_location, current_location_name, current_location_amharic, battery_level, status) 
  VALUES ('BK003', 'QR003', 'EcoBike Standard', ST_GeogFromText('POINT(38.7469 9.0348)'), 'Piazza', 'ፒያሳ', 78, 'available')
  ON CONFLICT (bike_code) DO NOTHING;
  
  INSERT INTO bikes (bike_code, qr_code, model, current_location, current_location_name, current_location_amharic, battery_level, status) 
  VALUES ('BK004', 'QR004', 'EcoBike Standard', ST_GeogFromText('POINT(38.7297 9.0157)'), 'Mercato', 'መርካቶ', 45, 'maintenance')
  ON CONFLICT (bike_code) DO NOTHING;
  
  INSERT INTO bikes (bike_code, qr_code, model, current_location, current_location_name, current_location_amharic, battery_level, status) 
  VALUES ('BK005', 'QR005', 'EcoBike Pro', ST_GeogFromText('POINT(38.7489 9.0189)'), 'Mexico Square', 'ሜክሲኮ አደባባይ', 67, 'in_use')
  ON CONFLICT (bike_code) DO NOTHING;
  
  INSERT INTO bikes (bike_code, qr_code, model, current_location, current_location_name, current_location_amharic, battery_level, status) 
  VALUES ('BK006', 'QR006', 'EcoBike Standard', ST_GeogFromText('POINT(38.7614 9.0227)'), 'Unity Park', 'አንድነት ፓርክ', 95, 'available')
  ON CONFLICT (bike_code) DO NOTHING;
END $$;

-- Sample Ethiopian holidays (only insert if they don't exist by name and date)
DO $$
BEGIN
  INSERT INTO ethiopian_holidays (name, name_amharic, date, holiday_type, description, impact_on_operations) 
  VALUES ('Ethiopian New Year', 'እንቁጣጣሽ', '2024-09-11', 'cultural', 'Ethiopian New Year celebration', 'Increased demand expected')
  ON CONFLICT DO NOTHING;
  
  INSERT INTO ethiopian_holidays (name, name_amharic, date, holiday_type, description, impact_on_operations) 
  VALUES ('Meskel', 'መስቀል', '2024-09-27', 'religious', 'Finding of the True Cross', 'High demand around Meskel Square')
  ON CONFLICT DO NOTHING;
  
  INSERT INTO ethiopian_holidays (name, name_amharic, date, holiday_type, description, impact_on_operations) 
  VALUES ('Christmas', 'ገና', '2025-01-07', 'religious', 'Ethiopian Orthodox Christmas', 'Reduced operations in morning')
  ON CONFLICT DO NOTHING;
  
  INSERT INTO ethiopian_holidays (name, name_amharic, date, holiday_type, description, impact_on_operations) 
  VALUES ('Epiphany', 'ጥምቀት', '2025-01-19', 'religious', 'Ethiopian Orthodox Epiphany', 'High demand near water bodies')
  ON CONFLICT DO NOTHING;
  
  INSERT INTO ethiopian_holidays (name, name_amharic, date, holiday_type, description, impact_on_operations) 
  VALUES ('Adwa Victory Day', 'የአድዋ ድል በዓል', '2024-03-02', 'national', 'Victory of Adwa commemoration', 'Parade routes may affect bike placement')
  ON CONFLICT DO NOTHING;
END $$;

-- Sample system alerts (only insert if bikes exist and no conflicts)
DO $$
DECLARE
    bike_id_var uuid;
BEGIN
    -- Get bike ID for BK004
    SELECT id INTO bike_id_var FROM bikes WHERE bike_code = 'BK004' LIMIT 1;
    
    IF bike_id_var IS NOT NULL THEN
        -- Insert alerts only if they don't already exist
        IF NOT EXISTS (SELECT 1 FROM system_alerts WHERE title = 'Low Battery Alert' AND entity_id = bike_id_var) THEN
            INSERT INTO system_alerts (alert_type, title, message, severity, entity_type, entity_id) 
            VALUES ('low_battery', 'Low Battery Alert', 'Bike BK004 has low battery (45%)', 'medium', 'bike', bike_id_var);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM system_alerts WHERE title = 'Maintenance Required' AND entity_id = bike_id_var) THEN
            INSERT INTO system_alerts (alert_type, title, message, severity, entity_type, entity_id) 
            VALUES ('maintenance_due', 'Maintenance Required', 'Bike BK004 requires maintenance', 'high', 'bike', bike_id_var);
        END IF;
    END IF;
    
    -- Insert general system alerts
    IF NOT EXISTS (SELECT 1 FROM system_alerts WHERE title = 'Holiday Preparation' AND alert_type = 'holiday_preparation') THEN
        INSERT INTO system_alerts (alert_type, title, message, severity, entity_type) 
        VALUES ('holiday_preparation', 'Holiday Preparation', 'Prepare for increased demand during upcoming Ethiopian New Year', 'low', 'system');
    END IF;
END $$;