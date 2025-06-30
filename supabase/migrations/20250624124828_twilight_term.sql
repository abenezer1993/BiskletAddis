/*
  # Comprehensive User Management System for Bisklet

  1. Enhanced User Schema
    - Add user_role with 21 distinct roles
    - Add user_type for high-level categorization
    - Add subscription management
    - Add organization integration
    - Add student/employee identification
    - Add permissions and emergency contact

  2. New Tables
    - `organizations` - Ethiopian organizations and partners
    - `user_permissions` - Granular access control
    - `staff_schedules` - Operational staff management

  3. Security
    - Enhanced RLS policies with proper conflict handling
    - Role-based access control
    - Organization-based data isolation

  4. Sample Data
    - Major Ethiopian organizations
    - Comprehensive user examples for all roles
    - Staff schedules and permissions
*/

-- Add comprehensive user role management columns
DO $$
BEGIN
  -- Add user_role column with all Ethiopian bike-sharing roles
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'user_role'
  ) THEN
    ALTER TABLE users ADD COLUMN user_role TEXT DEFAULT 'customer' 
    CHECK (user_role IN (
      -- End Users (Mobile App)
      'customer', 'premium_customer', 'student', 'corporate_user', 'tourist',
      -- Administrative Users (Web Dashboard)
      'super_admin', 'operations_manager', 'finance_manager', 'customer_support', 'data_analyst',
      -- Operational Staff
      'field_technician', 'redistributor', 'charging_staff', 'quality_inspector',
      -- Business Partners
      'payment_partner', 'location_partner', 'corporate_partner', 'government_official',
      -- System Accounts
      'api_service', 'automated_system', 'test_account'
    ));
  END IF;

  -- Add user_type for high-level categorization
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'user_type'
  ) THEN
    ALTER TABLE users ADD COLUMN user_type TEXT DEFAULT 'end_user'
    CHECK (user_type IN ('end_user', 'admin', 'staff', 'partner', 'system'));
  END IF;

  -- Add subscription management
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'subscription_type'
  ) THEN
    ALTER TABLE users ADD COLUMN subscription_type TEXT DEFAULT 'pay_per_ride'
    CHECK (subscription_type IN ('pay_per_ride', 'daily', 'weekly', 'monthly', 'annual', 'corporate', 'student'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'subscription_expires_at'
  ) THEN
    ALTER TABLE users ADD COLUMN subscription_expires_at TIMESTAMPTZ;
  END IF;

  -- Add organization integration
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE users ADD COLUMN organization_id UUID;
  END IF;

  -- Add student and employee identification
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'student_id'
  ) THEN
    ALTER TABLE users ADD COLUMN student_id TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'employee_id'
  ) THEN
    ALTER TABLE users ADD COLUMN employee_id TEXT;
  END IF;

  -- Add permissions and emergency contact
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'permissions'
  ) THEN
    ALTER TABLE users ADD COLUMN permissions JSONB DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'emergency_contact'
  ) THEN
    ALTER TABLE users ADD COLUMN emergency_contact JSONB;
  END IF;
END $$;

-- Organizations table for comprehensive partnership management
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_amharic TEXT,
  organization_type TEXT NOT NULL CHECK (organization_type IN ('corporate', 'educational', 'government', 'partner', 'ngo')),
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  address TEXT,
  address_amharic TEXT,
  contract_start_date DATE,
  contract_end_date DATE,
  discount_rate NUMERIC(5,2) DEFAULT 0.00,
  monthly_credit_limit NUMERIC(10,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT TRUE,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User permissions table for granular access control
CREATE TABLE IF NOT EXISTS user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  permission_name TEXT NOT NULL,
  resource_type TEXT, -- 'bikes', 'users', 'payments', 'reports', etc.
  resource_id UUID, -- specific resource ID if applicable
  granted_by UUID REFERENCES users(id),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE
);

-- Staff schedules table for operational management
CREATE TABLE IF NOT EXISTS staff_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID REFERENCES users(id) ON DELETE CASCADE,
  shift_start TIMESTAMPTZ NOT NULL,
  shift_end TIMESTAMPTZ NOT NULL,
  assigned_area TEXT,
  assigned_area_amharic TEXT,
  shift_type TEXT CHECK (shift_type IN ('maintenance', 'redistribution', 'charging', 'inspection', 'support')),
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key constraint for organization_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'users_organization_id_fkey'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_organization_id_fkey 
    FOREIGN KEY (organization_id) REFERENCES organizations(id);
  END IF;
END $$;

-- Create comprehensive indexes
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_user_role') THEN
    CREATE INDEX idx_users_user_role ON users(user_role);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_user_type') THEN
    CREATE INDEX idx_users_user_type ON users(user_type);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_organization_id') THEN
    CREATE INDEX idx_users_organization_id ON users(organization_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_permissions_user_id') THEN
    CREATE INDEX idx_user_permissions_user_id ON user_permissions(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_staff_schedules_staff_id') THEN
    CREATE INDEX idx_staff_schedules_staff_id ON staff_schedules(staff_id);
  END IF;
END $$;

-- Enable RLS on new tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_schedules ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts, then recreate them
DO $$
BEGIN
  -- Drop existing policies for organizations
  DROP POLICY IF EXISTS "Admin can manage organizations" ON organizations;
  DROP POLICY IF EXISTS "Users can read own organization" ON organizations;
  
  -- Drop existing policies for user_permissions
  DROP POLICY IF EXISTS "Admin can manage permissions" ON user_permissions;
  DROP POLICY IF EXISTS "Users can read own permissions" ON user_permissions;
  
  -- Drop existing policies for staff_schedules
  DROP POLICY IF EXISTS "Admin can manage schedules" ON staff_schedules;
  DROP POLICY IF EXISTS "Staff can read own schedules" ON staff_schedules;
END $$;

-- Enhanced RLS Policies for organizations
CREATE POLICY "Admin can manage organizations" ON organizations
  FOR ALL TO authenticated
  USING (
    (auth.jwt() ->> 'role' = 'admin') OR 
    (auth.jwt() ->> 'user_type' = 'admin')
  );

CREATE POLICY "Users can read own organization" ON organizations
  FOR SELECT TO authenticated
  USING (id = (SELECT organization_id FROM users WHERE id = auth.uid()));

-- Enhanced RLS Policies for user_permissions
CREATE POLICY "Admin can manage permissions" ON user_permissions
  FOR ALL TO authenticated
  USING (
    (auth.jwt() ->> 'role' = 'admin') OR 
    (auth.jwt() ->> 'user_type' = 'admin')
  );

CREATE POLICY "Users can read own permissions" ON user_permissions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Enhanced RLS Policies for staff_schedules
CREATE POLICY "Admin can manage schedules" ON staff_schedules
  FOR ALL TO authenticated
  USING (
    (auth.jwt() ->> 'role' = 'admin') OR 
    (auth.jwt() ->> 'user_type' = 'admin')
  );

CREATE POLICY "Staff can read own schedules" ON staff_schedules
  FOR SELECT TO authenticated
  USING (staff_id = auth.uid());

-- Create triggers for new tables
DO $$
BEGIN
  -- Drop existing trigger if it exists
  DROP TRIGGER IF EXISTS update_organizations_updated_at ON organizations;
  
  -- Create the trigger
  CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
END $$;

-- Insert major Ethiopian organizations and partners
INSERT INTO organizations (name, name_amharic, organization_type, contact_email, contact_phone, address, address_amharic, discount_rate, monthly_credit_limit, is_active) VALUES
-- Educational Institutions
('Addis Ababa University', 'አዲስ አበባ ዩኒቨርሲቲ', 'educational', 'transport@aau.edu.et', '+251111234567', 'Arat Kilo Campus, Addis Ababa', 'አራት ኪሎ ካምፓስ፣ አዲስ አበባ', 25.00, 75000.00, true),
('Addis Ababa Science and Technology University', 'አዲስ አበባ ሳይንስና ቴክኖሎጂ ዩኒቨርሲቲ', 'educational', 'mobility@aastu.edu.et', '+251111345678', 'Akaki Campus, Addis Ababa', 'አቃቂ ካምፓስ፣ አዲስ አበባ', 25.00, 50000.00, true),
('Ethiopian Civil Service University', 'የኢትዮጵያ ሲቪል ሰርቪስ ዩኒቨርሲቲ', 'educational', 'transport@ecsu.edu.et', '+251111456789', 'Gerji Campus, Addis Ababa', 'ገርጂ ካምፓስ፣ አዲስ አበባ', 20.00, 30000.00, true),

-- Major Corporations
('Ethiopian Airlines', 'የኢትዮጵያ አየር መንገድ', 'corporate', 'facilities@ethiopianairlines.com', '+251116617000', 'Bole International Airport', 'ቦሌ ዓለም አቀፍ አየር ማረፊያ', 15.00, 150000.00, true),
('Ethio Telecom', 'ኢትዮ ቴሌኮም', 'corporate', 'corporate@ethiotelecom.et', '+251111112233', 'Churchill Avenue, Addis Ababa', 'ቸርችል አቬኑ፣ አዲስ አበባ', 12.00, 100000.00, true),
('Ethiopian Electric Power', 'የኢትዮጵያ ኤሌክትሪክ ኃይል', 'corporate', 'hr@eep.gov.et', '+251111223344', 'De Gaulle Square, Addis Ababa', 'ደጎል አደባባይ፣ አዲስ አበባ', 10.00, 80000.00, true),
('Commercial Bank of Ethiopia', 'የኢትዮጵያ ንግድ ባንክ', 'corporate', 'partnerships@combanketh.et', '+251111557700', 'Ras Abebe Aregay Street', 'ራስ አበበ አረጋይ ጎዳና', 8.00, 120000.00, true),

-- Government Organizations
('Addis Ababa City Administration', 'የአዲስ አበባ ከተማ አስተዳደር', 'government', 'transport@addisababa.gov.et', '+251111122334', 'City Hall, Addis Ababa', 'ከተማ አዳራሽ፣ አዲስ አበባ', 0.00, 0.00, true),
('Ministry of Transport and Logistics', 'የትራንስፖርትና ሎጂስቲክስ ሚኒስቴር', 'government', 'planning@mot.gov.et', '+251111334455', 'Ministry Building, Addis Ababa', 'ሚኒስቴር ህንፃ፣ አዲስ አበባ', 0.00, 0.00, true),
('Ethiopian Roads Authority', 'የኢትዮጵያ መንገዶች ባለስልጣን', 'government', 'urban@era.gov.et', '+251111445566', 'ERA Headquarters, Addis Ababa', 'የመንገዶች ባለስልጣን ዋና መሥሪያ ቤት', 0.00, 0.00, true),

-- Payment and Technology Partners
('Telebirr (Ethio Telecom)', 'ቴሌብር (ኢትዮ ቴሌኮም)', 'partner', 'partnerships@telebirr.et', '+251111666777', 'Telebirr Building, Addis Ababa', 'ቴሌብር ህንፃ፣ አዲስ አበባ', 0.00, 0.00, true),
('Dashen Bank', 'ዳሽን ባንክ', 'partner', 'digital@dashenbanksc.com', '+251111778899', 'Dashen Bank Building', 'ዳሽን ባንክ ህንፃ', 0.00, 0.00, true),
('Awash Bank', 'አዋሽ ባንክ', 'partner', 'partnerships@awashbank.com', '+251111889900', 'Awash Bank Headquarters', 'አዋሽ ባንክ ዋና መሥሪያ ቤት', 0.00, 0.00, true),

-- NGOs and International Organizations
('United Nations Economic Commission for Africa', 'የተባበሩት መንግሥታት የአፍሪካ ኢኮኖሚ ኮሚሽን', 'ngo', 'transport@uneca.org', '+251111990011', 'UNECA Headquarters, Addis Ababa', 'የተባበሩት መንግሥታት ዋና መሥሪያ ቤት', 5.00, 25000.00, true),
('African Union Commission', 'የአፍሪካ ህብረት ኮሚሽን', 'ngo', 'facilities@africa-union.org', '+251115517700', 'AU Headquarters, Addis Ababa', 'የአፍሪካ ህብረት ዋና መሥሪያ ቤት', 5.00, 30000.00, true)

ON CONFLICT DO NOTHING;

-- Update existing admin user with comprehensive permissions
UPDATE users SET 
  user_role = 'super_admin',
  user_type = 'admin',
  permissions = '["all", "user_management", "bike_management", "financial_reports", "system_administration", "organization_management"]'::jsonb,
  emergency_contact = '{"name": "System Administrator", "phone": "+251911000000", "relationship": "technical"}'::jsonb
WHERE email = 'admin@bikeshare.et';

-- Insert comprehensive user examples for each role type
DO $$
DECLARE
    aau_org_id UUID;
    eal_org_id UUID;
    cbe_org_id UUID;
    telecom_org_id UUID;
    city_admin_org_id UUID;
BEGIN
    -- Get organization IDs
    SELECT id INTO aau_org_id FROM organizations WHERE name = 'Addis Ababa University' LIMIT 1;
    SELECT id INTO eal_org_id FROM organizations WHERE name = 'Ethiopian Airlines' LIMIT 1;
    SELECT id INTO cbe_org_id FROM organizations WHERE name = 'Commercial Bank of Ethiopia' LIMIT 1;
    SELECT id INTO telecom_org_id FROM organizations WHERE name = 'Ethio Telecom' LIMIT 1;
    SELECT id INTO city_admin_org_id FROM organizations WHERE name = 'Addis Ababa City Administration' LIMIT 1;
    
    -- Administrative Users
    INSERT INTO users (email, phone, full_name, full_name_amharic, user_role, user_type, verified, permissions, preferred_language) VALUES
    ('ops.manager@bisklet.et', '+251911000020', 'Meron Tadesse', 'መሮን ታደሰ', 'operations_manager', 'admin', true, '["bike_management", "staff_management", "location_management"]'::jsonb, 'am'),
    ('finance.manager@bisklet.et', '+251911000021', 'Dawit Alemayehu', 'ዳዊት አለማየሁ', 'finance_manager', 'admin', true, '["financial_reports", "payment_management", "organization_billing"]'::jsonb, 'en'),
    ('support@bisklet.et', '+251911000022', 'Hanan Mohammed', 'ሃናን መሀመድ', 'customer_support', 'admin', true, '["user_support", "issue_resolution", "communication"]'::jsonb, 'am'),
    ('analyst@bisklet.et', '+251911000023', 'Yonas Bekele', 'ዮናስ በቀለ', 'data_analyst', 'admin', true, '["analytics", "reporting", "data_export"]'::jsonb, 'en')
    ON CONFLICT (email) DO NOTHING;
    
    -- Operational Staff
    INSERT INTO users (email, phone, full_name, full_name_amharic, user_role, user_type, verified, employee_id, emergency_contact, preferred_language) VALUES
    ('tech1@bisklet.et', '+251911000030', 'Tekle Hailu', 'ተክሌ ሃይሉ', 'field_technician', 'staff', true, 'TECH001', '{"name": "Almaz Tekle", "phone": "+251911000031", "relationship": "spouse"}'::jsonb, 'am'),
    ('redistributor1@bisklet.et', '+251911000032', 'Meseret Alemu', 'መሰረት አለሙ', 'redistributor', 'staff', true, 'REDIS001', '{"name": "Getachew Meseret", "phone": "+251911000033", "relationship": "brother"}'::jsonb, 'am'),
    ('charger1@bisklet.et', '+251911000034', 'Berhanu Worku', 'በርሃኑ ወርቁ', 'charging_staff', 'staff', true, 'CHARGE001', '{"name": "Tigist Berhanu", "phone": "+251911000035", "relationship": "wife"}'::jsonb, 'am'),
    ('inspector1@bisklet.et', '+251911000036', 'Almaz Tesfaye', 'አልማዝ ተስፋዬ', 'quality_inspector', 'staff', true, 'INSP001', '{"name": "Tesfaye Almaz", "phone": "+251911000037", "relationship": "father"}'::jsonb, 'am')
    ON CONFLICT (email) DO NOTHING;
    
    -- Student Users
    IF aau_org_id IS NOT NULL THEN
        INSERT INTO users (email, phone, full_name, full_name_amharic, user_role, user_type, subscription_type, subscription_expires_at, organization_id, student_id, verified, wallet_balance, preferred_language) VALUES
        ('student1@aau.edu.et', '+251911000040', 'Bethlehem Asefa', 'ቤተልሄም አሰፋ', 'student', 'end_user', 'student', NOW() + INTERVAL '1 year', aau_org_id, 'AAU2024001', true, 25.00, 'am'),
        ('student2@aau.edu.et', '+251911000041', 'Robel Girma', 'ሮቤል ግርማ', 'student', 'end_user', 'student', NOW() + INTERVAL '1 year', aau_org_id, 'AAU2024002', true, 30.00, 'en'),
        ('student3@aau.edu.et', '+251911000042', 'Mahlet Kebede', 'ማህሌት ከበደ', 'student', 'end_user', 'student', NOW() + INTERVAL '1 year', aau_org_id, 'AAU2024003', true, 15.00, 'am')
        ON CONFLICT (email) DO NOTHING;
    END IF;
    
    -- Corporate Users
    IF eal_org_id IS NOT NULL THEN
        INSERT INTO users (email, phone, full_name, full_name_amharic, user_role, user_type, subscription_type, subscription_expires_at, organization_id, employee_id, verified, wallet_balance, preferred_language) VALUES
        ('employee1@ethiopianairlines.com', '+251911000050', 'Yohannes Girma', 'ዮሃንስ ግርማ', 'corporate_user', 'end_user', 'corporate', NOW() + INTERVAL '1 year', eal_org_id, 'EAL2024001', true, 100.00, 'en'),
        ('employee2@ethiopianairlines.com', '+251911000051', 'Selamawit Tadesse', 'ሰላማዊት ታደሰ', 'corporate_user', 'end_user', 'corporate', NOW() + INTERVAL '1 year', eal_org_id, 'EAL2024002', true, 85.00, 'am')
        ON CONFLICT (email) DO NOTHING;
    END IF;
    
    -- Premium and Regular Customers
    INSERT INTO users (email, phone, full_name, full_name_amharic, user_role, user_type, subscription_type, subscription_expires_at, verified, wallet_balance, preferred_language) VALUES
    ('premium1@example.com', '+251911000060', 'Henok Bekele', 'ሄኖክ በቀለ', 'premium_customer', 'end_user', 'monthly', NOW() + INTERVAL '30 days', true, 200.00, 'am'),
    ('premium2@example.com', '+251911000061', 'Marta Haile', 'ማርታ ሃይሌ', 'premium_customer', 'end_user', 'annual', NOW() + INTERVAL '365 days', true, 500.00, 'en'),
    ('customer1@example.com', '+251911000062', 'Getachew Mekonen', 'ጌታቸው መኮንን', 'customer', 'end_user', 'pay_per_ride', null, true, 45.00, 'am'),
    ('customer2@example.com', '+251911000063', 'Hiwot Ahmed', 'ህይወት አህመድ', 'customer', 'end_user', 'weekly', NOW() + INTERVAL '7 days', true, 75.00, 'or')
    ON CONFLICT (email) DO NOTHING;
    
    -- Tourist Users
    INSERT INTO users (email, phone, full_name, user_role, user_type, subscription_type, verified, wallet_balance, preferred_language) VALUES
    ('tourist1@example.com', '+251911000070', 'John Smith', 'tourist', 'end_user', 'pay_per_ride', false, 25.00, 'en'),
    ('tourist2@example.com', '+251911000071', 'Maria Garcia', 'tourist', 'end_user', 'daily', false, 40.00, 'en'),
    ('tourist3@example.com', '+251911000072', 'Chen Wei', 'tourist', 'end_user', 'pay_per_ride', false, 15.00, 'en')
    ON CONFLICT (email) DO NOTHING;
    
    -- Partner Users
    IF cbe_org_id IS NOT NULL THEN
        INSERT INTO users (email, phone, full_name, full_name_amharic, user_role, user_type, organization_id, employee_id, verified, preferred_language) VALUES
        ('partner1@combanketh.et', '+251911000080', 'Alemayehu Tesfaye', 'አለማየሁ ተስፋዬ', 'payment_partner', 'partner', cbe_org_id, 'CBE2024001', true, 'am')
        ON CONFLICT (email) DO NOTHING;
    END IF;
    
    IF city_admin_org_id IS NOT NULL THEN
        INSERT INTO users (email, phone, full_name, full_name_amharic, user_role, user_type, organization_id, employee_id, verified, preferred_language) VALUES
        ('official1@addisababa.gov.et', '+251911000081', 'Teshome Regassa', 'ተሾመ ረጋሳ', 'government_official', 'partner', city_admin_org_id, 'AACA2024001', true, 'am')
        ON CONFLICT (email) DO NOTHING;
    END IF;
    
    -- System Accounts
    INSERT INTO users (email, phone, full_name, user_role, user_type, verified, permissions, preferred_language) VALUES
    ('api@bisklet.et', '+251911000090', 'API Service Account', 'api_service', 'system', true, '["api_access", "data_sync", "external_integration"]'::jsonb, 'en'),
    ('automation@bisklet.et', '+251911000091', 'Automated System', 'automated_system', 'system', true, '["scheduled_tasks", "monitoring", "alerts"]'::jsonb, 'en'),
    ('test@bisklet.et', '+251911000092', 'Test Account', 'test_account', 'system', true, '["testing", "development"]'::jsonb, 'en')
    ON CONFLICT (email) DO NOTHING;
END $$;

-- Insert sample staff schedules for operational staff
DO $$
DECLARE
    tech_user_id UUID;
    redis_user_id UUID;
    charge_user_id UUID;
    insp_user_id UUID;
BEGIN
    SELECT id INTO tech_user_id FROM users WHERE email = 'tech1@bisklet.et' LIMIT 1;
    SELECT id INTO redis_user_id FROM users WHERE email = 'redistributor1@bisklet.et' LIMIT 1;
    SELECT id INTO charge_user_id FROM users WHERE email = 'charger1@bisklet.et' LIMIT 1;
    SELECT id INTO insp_user_id FROM users WHERE email = 'inspector1@bisklet.et' LIMIT 1;
    
    -- Technician schedule
    IF tech_user_id IS NOT NULL THEN
        INSERT INTO staff_schedules (staff_id, shift_start, shift_end, assigned_area, assigned_area_amharic, shift_type, notes) VALUES
        (tech_user_id, NOW() + INTERVAL '1 day' + INTERVAL '8 hours', NOW() + INTERVAL '1 day' + INTERVAL '16 hours', 'Bole District', 'ቦሌ ክፍለ ከተማ', 'maintenance', 'Focus on high-traffic areas around airport'),
        (tech_user_id, NOW() + INTERVAL '2 days' + INTERVAL '8 hours', NOW() + INTERVAL '2 days' + INTERVAL '16 hours', 'Kirkos District', 'ቂርቆስ ክፍለ ከተማ', 'maintenance', 'Meskel Square area maintenance')
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Redistributor schedule
    IF redis_user_id IS NOT NULL THEN
        INSERT INTO staff_schedules (staff_id, shift_start, shift_end, assigned_area, assigned_area_amharic, shift_type, notes) VALUES
        (redis_user_id, NOW() + INTERVAL '1 day' + INTERVAL '6 hours', NOW() + INTERVAL '1 day' + INTERVAL '14 hours', 'City Center', 'ከተማ መሃል', 'redistribution', 'Morning rush hour rebalancing'),
        (redis_user_id, NOW() + INTERVAL '2 days' + INTERVAL '14 hours', NOW() + INTERVAL '2 days' + INTERVAL '22 hours', 'Bole-Kirkos Route', 'ቦሌ-ቂርቆስ መስመር', 'redistribution', 'Evening redistribution')
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Charging staff schedule
    IF charge_user_id IS NOT NULL THEN
        INSERT INTO staff_schedules (staff_id, shift_start, shift_end, assigned_area, assigned_area_amharic, shift_type, notes) VALUES
        (charge_user_id, NOW() + INTERVAL '1 day' + INTERVAL '22 hours', NOW() + INTERVAL '2 days' + INTERVAL '6 hours', 'All Districts', 'ሁሉም ክፍለ ከተማዎች', 'charging', 'Overnight battery charging and maintenance')
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Quality inspector schedule
    IF insp_user_id IS NOT NULL THEN
        INSERT INTO staff_schedules (staff_id, shift_start, shift_end, assigned_area, assigned_area_amharic, shift_type, notes) VALUES
        (insp_user_id, NOW() + INTERVAL '1 day' + INTERVAL '9 hours', NOW() + INTERVAL '1 day' + INTERVAL '17 hours', 'Random Locations', 'ዘፈቀደ ቦታዎች', 'inspection', 'Quality and safety inspection rounds')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Insert sample user permissions for different roles
DO $$
DECLARE
    ops_manager_id UUID;
    finance_manager_id UUID;
    support_id UUID;
    analyst_id UUID;
    admin_id UUID;
BEGIN
    SELECT id INTO ops_manager_id FROM users WHERE email = 'ops.manager@bisklet.et' LIMIT 1;
    SELECT id INTO finance_manager_id FROM users WHERE email = 'finance.manager@bisklet.et' LIMIT 1;
    SELECT id INTO support_id FROM users WHERE email = 'support@bisklet.et' LIMIT 1;
    SELECT id INTO analyst_id FROM users WHERE email = 'analyst@bisklet.et' LIMIT 1;
    SELECT id INTO admin_id FROM users WHERE email = 'admin@bikeshare.et' LIMIT 1;
    
    -- Operations Manager permissions
    IF ops_manager_id IS NOT NULL AND admin_id IS NOT NULL THEN
        INSERT INTO user_permissions (user_id, permission_name, resource_type, granted_by) VALUES
        (ops_manager_id, 'manage_bikes', 'bikes', admin_id),
        (ops_manager_id, 'manage_locations', 'locations', admin_id),
        (ops_manager_id, 'manage_staff_schedules', 'staff_schedules', admin_id),
        (ops_manager_id, 'view_operational_reports', 'reports', admin_id)
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Finance Manager permissions
    IF finance_manager_id IS NOT NULL AND admin_id IS NOT NULL THEN
        INSERT INTO user_permissions (user_id, permission_name, resource_type, granted_by) VALUES
        (finance_manager_id, 'view_financial_reports', 'reports', admin_id),
        (finance_manager_id, 'manage_payments', 'payments', admin_id),
        (finance_manager_id, 'manage_organizations', 'organizations', admin_id),
        (finance_manager_id, 'export_financial_data', 'reports', admin_id)
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Customer Support permissions
    IF support_id IS NOT NULL AND admin_id IS NOT NULL THEN
        INSERT INTO user_permissions (user_id, permission_name, resource_type, granted_by) VALUES
        (support_id, 'view_user_profiles', 'users', admin_id),
        (support_id, 'resolve_user_issues', 'users', admin_id),
        (support_id, 'manage_system_alerts', 'system_alerts', admin_id),
        (support_id, 'send_notifications', 'communications', admin_id)
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Data Analyst permissions
    IF analyst_id IS NOT NULL AND admin_id IS NOT NULL THEN
        INSERT INTO user_permissions (user_id, permission_name, resource_type, granted_by) VALUES
        (analyst_id, 'view_all_reports', 'reports', admin_id),
        (analyst_id, 'export_data', 'data', admin_id),
        (analyst_id, 'create_custom_reports', 'reports', admin_id),
        (analyst_id, 'access_analytics_dashboard', 'dashboard', admin_id)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;