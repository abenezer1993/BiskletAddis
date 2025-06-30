/*
  # Enhanced User Schema with Role-Based Access

  1. User Roles and Permissions
    - Add user_role and user_type fields
    - Create role-based access control
    - Support for multiple user categories

  2. User Profiles
    - Extended profile information
    - Subscription and membership details
    - Corporate and student verification

  3. Staff and Partner Management
    - Operational staff accounts
    - Partner organization links
    - Permission levels and access control
*/

-- Add new columns to users table for enhanced role management
DO $$
BEGIN
  -- Add user_role column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'user_role'
  ) THEN
    ALTER TABLE users ADD COLUMN user_role TEXT DEFAULT 'customer' 
    CHECK (user_role IN (
      'customer', 'premium_customer', 'student', 'corporate_user', 'tourist',
      'super_admin', 'operations_manager', 'finance_manager', 'customer_support', 'data_analyst',
      'field_technician', 'redistributor', 'charging_staff', 'quality_inspector',
      'payment_partner', 'location_partner', 'corporate_partner', 'government_official',
      'api_service', 'automated_system', 'test_account'
    ));
  END IF;

  -- Add user_type column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'user_type'
  ) THEN
    ALTER TABLE users ADD COLUMN user_type TEXT DEFAULT 'end_user'
    CHECK (user_type IN ('end_user', 'admin', 'staff', 'partner', 'system'));
  END IF;

  -- Add subscription_type column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'subscription_type'
  ) THEN
    ALTER TABLE users ADD COLUMN subscription_type TEXT DEFAULT 'pay_per_ride'
    CHECK (subscription_type IN ('pay_per_ride', 'daily', 'weekly', 'monthly', 'annual', 'corporate', 'student'));
  END IF;

  -- Add subscription_expires_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'subscription_expires_at'
  ) THEN
    ALTER TABLE users ADD COLUMN subscription_expires_at TIMESTAMPTZ;
  END IF;

  -- Add organization_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE users ADD COLUMN organization_id UUID;
  END IF;

  -- Add student_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'student_id'
  ) THEN
    ALTER TABLE users ADD COLUMN student_id TEXT;
  END IF;

  -- Add employee_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'employee_id'
  ) THEN
    ALTER TABLE users ADD COLUMN employee_id TEXT;
  END IF;

  -- Add permissions column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'permissions'
  ) THEN
    ALTER TABLE users ADD COLUMN permissions JSONB DEFAULT '[]'::jsonb;
  END IF;

  -- Add emergency_contact column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'emergency_contact'
  ) THEN
    ALTER TABLE users ADD COLUMN emergency_contact JSONB;
  END IF;
END $$;

-- Organizations table for corporate and partner management
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

-- Staff schedules table for operational staff
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

-- Create indexes for new columns
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

-- RLS Policies for organizations
CREATE POLICY "Admin can manage organizations" ON organizations
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'user_type' = 'admin');

CREATE POLICY "Users can read own organization" ON organizations
  FOR SELECT TO authenticated
  USING (id = (SELECT organization_id FROM users WHERE id = auth.uid()));

-- RLS Policies for user_permissions
CREATE POLICY "Admin can manage permissions" ON user_permissions
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'user_type' = 'admin');

CREATE POLICY "Users can read own permissions" ON user_permissions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for staff_schedules
CREATE POLICY "Admin can manage schedules" ON staff_schedules
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'user_type' = 'admin');

CREATE POLICY "Staff can read own schedules" ON staff_schedules
  FOR SELECT TO authenticated
  USING (staff_id = auth.uid());

-- Update existing users with appropriate roles
UPDATE users SET 
  user_role = 'super_admin',
  user_type = 'admin',
  permissions = '["all"]'::jsonb
WHERE email = 'admin@bikeshare.et';

-- Insert sample organizations
INSERT INTO organizations (name, name_amharic, organization_type, contact_email, contact_phone, discount_rate, monthly_credit_limit) VALUES
('Addis Ababa University', 'አዲስ አበባ ዩኒቨርሲቲ', 'educational', 'transport@aau.edu.et', '+251111234567', 20.00, 50000.00),
('Ethiopian Airlines', 'የኢትዮጵያ አየር መንገድ', 'corporate', 'facilities@ethiopianairlines.com', '+251116617000', 15.00, 100000.00),
('Addis Ababa City Administration', 'የአዲስ አበባ ከተማ አስተዳደር', 'government', 'transport@addisababa.gov.et', '+251111122334', 0.00, 0.00),
('Commercial Bank of Ethiopia', 'የኢትዮጵያ ንግድ ባንክ', 'partner', 'partnerships@combanketh.et', '+251111557700', 0.00, 0.00)
ON CONFLICT DO NOTHING;

-- Insert sample enhanced users with different roles
DO $$
DECLARE
    aau_org_id UUID;
    eal_org_id UUID;
BEGIN
    -- Get organization IDs
    SELECT id INTO aau_org_id FROM organizations WHERE name = 'Addis Ababa University' LIMIT 1;
    SELECT id INTO eal_org_id FROM organizations WHERE name = 'Ethiopian Airlines' LIMIT 1;
    
    -- Insert operations manager
    INSERT INTO users (email, phone, full_name, full_name_amharic, user_role, user_type, verified, preferred_language) 
    VALUES ('ops.manager@bikeshare.et', '+251911000010', 'Meron Tadesse', 'መሮን ታደሰ', 'operations_manager', 'admin', true, 'am')
    ON CONFLICT (email) DO NOTHING;
    
    -- Insert field technician
    INSERT INTO users (email, phone, full_name, full_name_amharic, user_role, user_type, verified, employee_id, preferred_language) 
    VALUES ('tech1@bikeshare.et', '+251911000011', 'Tekle Hailu', 'ተክሌ ሃይሉ', 'field_technician', 'staff', true, 'TECH001', 'am')
    ON CONFLICT (email) DO NOTHING;
    
    -- Insert student user
    IF aau_org_id IS NOT NULL THEN
        INSERT INTO users (email, phone, full_name, full_name_amharic, user_role, user_type, subscription_type, organization_id, student_id, verified, preferred_language) 
        VALUES ('student1@aau.edu.et', '+251911000012', 'Hanan Mohammed', 'ሃናን መሀመድ', 'student', 'end_user', 'student', aau_org_id, 'AAU2024001', true, 'en')
        ON CONFLICT (email) DO NOTHING;
    END IF;
    
    -- Insert corporate user
    IF eal_org_id IS NOT NULL THEN
        INSERT INTO users (email, phone, full_name, full_name_amharic, user_role, user_type, subscription_type, organization_id, employee_id, verified, preferred_language) 
        VALUES ('employee1@ethiopianairlines.com', '+251911000013', 'Yonas Bekele', 'ዮናስ በቀለ', 'corporate_user', 'end_user', 'corporate', eal_org_id, 'EAL2024001', true, 'en')
        ON CONFLICT (email) DO NOTHING;
    END IF;
    
    -- Insert premium user
    INSERT INTO users (email, phone, full_name, full_name_amharic, user_role, user_type, subscription_type, subscription_expires_at, verified, wallet_balance, preferred_language) 
    VALUES ('premium1@example.com', '+251911000014', 'Bethlehem Asefa', 'ቤተልሄም አሰፋ', 'premium_customer', 'end_user', 'monthly', NOW() + INTERVAL '30 days', true, 200.00, 'am')
    ON CONFLICT (email) DO NOTHING;
    
    -- Insert tourist user
    INSERT INTO users (email, phone, full_name, user_role, user_type, subscription_type, verified, preferred_language) 
    VALUES ('tourist1@example.com', '+251911000015', 'John Smith', 'tourist', 'end_user', 'pay_per_ride', false, 'en')
    ON CONFLICT (email) DO NOTHING;
END $$;

-- Insert sample staff schedules
DO $$
DECLARE
    tech_user_id UUID;
BEGIN
    SELECT id INTO tech_user_id FROM users WHERE email = 'tech1@bikeshare.et' LIMIT 1;
    
    IF tech_user_id IS NOT NULL THEN
        INSERT INTO staff_schedules (staff_id, shift_start, shift_end, assigned_area, assigned_area_amharic, shift_type) 
        VALUES (
            tech_user_id, 
            NOW() + INTERVAL '1 day' + INTERVAL '8 hours', 
            NOW() + INTERVAL '1 day' + INTERVAL '16 hours', 
            'Bole District', 
            'ቦሌ ክፍለ ከተማ', 
            'maintenance'
        )
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Create triggers for new tables
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();