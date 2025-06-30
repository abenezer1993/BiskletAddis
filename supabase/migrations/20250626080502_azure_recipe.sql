/*
  # Insert Demo Users and Organizations for Bisklet

  This migration creates demo organizations and users for testing the login system.
  It includes all user types referenced in the login page.
*/

-- Insert demo organizations first (referenced by some users)
-- Use WHERE NOT EXISTS to avoid duplicates instead of ON CONFLICT
INSERT INTO organizations (
  name,
  name_amharic,
  organization_type,
  contact_email,
  contact_phone,
  address,
  address_amharic,
  contract_start_date,
  contract_end_date,
  discount_rate,
  monthly_credit_limit,
  is_active
)
SELECT 
  'Addis Ababa University',
  'አዲስ አበባ ዩኒቨርሲቲ',
  'educational',
  'info@aau.edu.et',
  '+251-11-123-4567',
  'Arat Kilo Campus, Addis Ababa',
  'አራት ኪሎ ካምፓስ፣ አዲስ አበባ',
  '2024-01-01'::date,
  '2024-12-31'::date,
  15.00,
  50000.00,
  true
WHERE NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Addis Ababa University');

INSERT INTO organizations (
  name,
  name_amharic,
  organization_type,
  contact_email,
  contact_phone,
  address,
  address_amharic,
  contract_start_date,
  contract_end_date,
  discount_rate,
  monthly_credit_limit,
  is_active
)
SELECT 
  'Ethiopian Airlines',
  'የኢትዮጵያ አየር መንገድ',
  'corporate',
  'corporate@ethiopianairlines.com',
  '+251-11-517-8888',
  'Bole International Airport, Addis Ababa',
  'ቦሌ አለም አቀፍ አየር ማረፊያ፣ አዲስ አበባ',
  '2024-01-01'::date,
  '2025-12-31'::date,
  20.00,
  100000.00,
  true
WHERE NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Ethiopian Airlines');

INSERT INTO organizations (
  name,
  name_amharic,
  organization_type,
  contact_email,
  contact_phone,
  address,
  address_amharic,
  contract_start_date,
  contract_end_date,
  discount_rate,
  monthly_credit_limit,
  is_active
)
SELECT 
  'Commercial Bank of Ethiopia',
  'የኢትዮጵያ ንግድ ባንክ',
  'partner',
  'info@combanketh.et',
  '+251-11-551-7438',
  'Headquarters, Addis Ababa',
  'ዋና መሥሪያ ቤት፣ አዲስ አበባ',
  '2024-01-01'::date,
  '2025-12-31'::date,
  0.00,
  0.00,
  true
WHERE NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Commercial Bank of Ethiopia');

INSERT INTO organizations (
  name,
  name_amharic,
  organization_type,
  contact_email,
  contact_phone,
  address,
  address_amharic,
  contract_start_date,
  contract_end_date,
  discount_rate,
  monthly_credit_limit,
  is_active
)
SELECT 
  'Addis Ababa City Administration',
  'የአዲስ አበባ ከተማ አስተዳደር',
  'government',
  'info@addisababa.gov.et',
  '+251-11-155',
  'City Hall, Addis Ababa',
  'ከተማ አዳራሽ፣ አዲስ አበባ',
  '2024-01-01'::date,
  '2025-12-31'::date,
  0.00,
  0.00,
  true
WHERE NOT EXISTS (SELECT 1 FROM organizations WHERE name = 'Addis Ababa City Administration');

-- Insert demo users with proper organization references
DO $$
DECLARE
    aau_org_id UUID;
    eal_org_id UUID;
    cbe_org_id UUID;
    city_org_id UUID;
    admin_user_id UUID;
    ops_user_id UUID;
    finance_user_id UUID;
    support_user_id UUID;
    tech_user_id UUID;
BEGIN
    -- Get organization IDs
    SELECT id INTO aau_org_id FROM organizations WHERE name = 'Addis Ababa University' LIMIT 1;
    SELECT id INTO eal_org_id FROM organizations WHERE name = 'Ethiopian Airlines' LIMIT 1;
    SELECT id INTO cbe_org_id FROM organizations WHERE name = 'Commercial Bank of Ethiopia' LIMIT 1;
    SELECT id INTO city_org_id FROM organizations WHERE name = 'Addis Ababa City Administration' LIMIT 1;

    -- Insert Super Admin (only if doesn't exist)
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@bikeshare.et') THEN
        INSERT INTO users (
          email,
          phone,
          full_name,
          full_name_amharic,
          government_id,
          verified,
          wallet_balance,
          total_rides,
          preferred_language,
          status,
          user_role,
          user_type,
          subscription_type,
          employee_id,
          permissions,
          emergency_contact
        ) VALUES (
          'admin@bikeshare.et',
          '+251911123456',
          'System Administrator',
          'የስርዓት አስተዳዳሪ',
          'ID001234567',
          true,
          1000.00,
          0,
          'en',
          'active',
          'super_admin',
          'admin',
          'corporate',
          'ADMIN001',
          '["user_management", "bike_management", "financial_reports", "system_settings", "analytics"]'::jsonb,
          '{"name": "Emergency Contact", "phone": "+251911654321", "relationship": "colleague"}'::jsonb
        );
    END IF;

    -- Get admin user ID
    SELECT id INTO admin_user_id FROM users WHERE email = 'admin@bikeshare.et' LIMIT 1;

    -- Insert Operations Manager (only if doesn't exist)
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'ops.manager@bisklet.et') THEN
        INSERT INTO users (
          email,
          phone,
          full_name,
          full_name_amharic,
          government_id,
          verified,
          wallet_balance,
          total_rides,
          preferred_language,
          status,
          user_role,
          user_type,
          subscription_type,
          employee_id,
          permissions,
          emergency_contact
        ) VALUES (
          'ops.manager@bisklet.et',
          '+251911234567',
          'Operations Manager',
          'የስራ አስኪያጅ',
          'ID002345678',
          true,
          500.00,
          25,
          'en',
          'active',
          'operations_manager',
          'admin',
          'corporate',
          'OPS001',
          '["bike_management", "staff_scheduling", "maintenance_logs", "location_management"]'::jsonb,
          '{"name": "Emergency Contact", "phone": "+251911765432", "relationship": "family"}'::jsonb
        );
    END IF;

    -- Get ops user ID
    SELECT id INTO ops_user_id FROM users WHERE email = 'ops.manager@bisklet.et' LIMIT 1;

    -- Insert Finance Manager (only if doesn't exist)
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'finance.manager@bisklet.et') THEN
        INSERT INTO users (
          email,
          phone,
          full_name,
          full_name_amharic,
          government_id,
          verified,
          wallet_balance,
          total_rides,
          preferred_language,
          status,
          user_role,
          user_type,
          subscription_type,
          employee_id,
          permissions,
          emergency_contact
        ) VALUES (
          'finance.manager@bisklet.et',
          '+251911345678',
          'Finance Manager',
          'የፋይናንስ አስኪያጅ',
          'ID003456789',
          true,
          300.00,
          15,
          'en',
          'active',
          'finance_manager',
          'admin',
          'corporate',
          'FIN001',
          '["financial_reports", "payment_management", "billing", "analytics"]'::jsonb,
          '{"name": "Emergency Contact", "phone": "+251911876543", "relationship": "spouse"}'::jsonb
        );
    END IF;

    -- Get finance user ID
    SELECT id INTO finance_user_id FROM users WHERE email = 'finance.manager@bisklet.et' LIMIT 1;

    -- Insert Customer Support (only if doesn't exist)
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'support@bisklet.et') THEN
        INSERT INTO users (
          email,
          phone,
          full_name,
          full_name_amharic,
          government_id,
          verified,
          wallet_balance,
          total_rides,
          preferred_language,
          status,
          user_role,
          user_type,
          subscription_type,
          employee_id,
          permissions,
          emergency_contact
        ) VALUES (
          'support@bisklet.et',
          '+251911456789',
          'Customer Support Agent',
          'የደንበኞች አገልግሎት ወኪል',
          'ID004567890',
          true,
          200.00,
          50,
          'am',
          'active',
          'customer_support',
          'admin',
          'corporate',
          'SUP001',
          '["user_support", "trip_management", "payment_support", "communication"]'::jsonb,
          '{"name": "Emergency Contact", "phone": "+251911987654", "relationship": "parent"}'::jsonb
        );
    END IF;

    -- Get support user ID
    SELECT id INTO support_user_id FROM users WHERE email = 'support@bisklet.et' LIMIT 1;

    -- Insert Field Technician (only if doesn't exist)
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'tech1@bisklet.et') THEN
        INSERT INTO users (
          email,
          phone,
          full_name,
          full_name_amharic,
          government_id,
          verified,
          wallet_balance,
          total_rides,
          preferred_language,
          status,
          user_role,
          user_type,
          subscription_type,
          employee_id,
          permissions,
          emergency_contact
        ) VALUES (
          'tech1@bisklet.et',
          '+251911567890',
          'Field Technician',
          'የሜዳ ቴክኒሻን',
          'ID005678901',
          true,
          150.00,
          30,
          'am',
          'active',
          'field_technician',
          'staff',
          'corporate',
          'TECH001',
          '["bike_maintenance", "field_operations", "maintenance_logs"]'::jsonb,
          '{"name": "Emergency Contact", "phone": "+251911098765", "relationship": "sibling"}'::jsonb
        );
    END IF;

    -- Get tech user ID
    SELECT id INTO tech_user_id FROM users WHERE email = 'tech1@bisklet.et' LIMIT 1;

    -- Insert Student (with organization, only if doesn't exist)
    IF aau_org_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE email = 'student1@aau.edu.et') THEN
        INSERT INTO users (
          email,
          phone,
          full_name,
          full_name_amharic,
          government_id,
          verified,
          wallet_balance,
          total_rides,
          preferred_language,
          status,
          user_role,
          user_type,
          subscription_type,
          subscription_expires_at,
          organization_id,
          student_id,
          permissions,
          emergency_contact
        ) VALUES (
          'student1@aau.edu.et',
          '+251911678901',
          'University Student',
          'የዩኒቨርሲቲ ተማሪ',
          'ID006789012',
          true,
          75.00,
          120,
          'am',
          'active',
          'student',
          'end_user',
          'student',
          NOW() + INTERVAL '1 year',
          aau_org_id,
          'AAU/2023/001234',
          '[]'::jsonb,
          '{"name": "Parent", "phone": "+251911109876", "relationship": "parent"}'::jsonb
        );
    END IF;

    -- Insert Corporate Employee (with organization, only if doesn't exist)
    IF eal_org_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE email = 'employee1@ethiopianairlines.com') THEN
        INSERT INTO users (
          email,
          phone,
          full_name,
          full_name_amharic,
          government_id,
          verified,
          wallet_balance,
          total_rides,
          preferred_language,
          status,
          user_role,
          user_type,
          subscription_type,
          subscription_expires_at,
          organization_id,
          employee_id,
          permissions,
          emergency_contact
        ) VALUES (
          'employee1@ethiopianairlines.com',
          '+251911789012',
          'Corporate Employee',
          'የድርጅት ሰራተኛ',
          'ID007890123',
          true,
          250.00,
          85,
          'en',
          'active',
          'corporate_user',
          'end_user',
          'corporate',
          NOW() + INTERVAL '1 year',
          eal_org_id,
          'ET001234',
          '[]'::jsonb,
          '{"name": "Spouse", "phone": "+251911210987", "relationship": "spouse"}'::jsonb
        );
    END IF;

    -- Insert Premium Customer (only if doesn't exist)
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'premium1@example.com') THEN
        INSERT INTO users (
          email,
          phone,
          full_name,
          full_name_amharic,
          government_id,
          verified,
          wallet_balance,
          total_rides,
          preferred_language,
          status,
          user_role,
          user_type,
          subscription_type,
          subscription_expires_at,
          permissions,
          emergency_contact
        ) VALUES (
          'premium1@example.com',
          '+251911890123',
          'Premium Customer',
          'ፕሪሚየም ደንበኛ',
          'ID008901234',
          true,
          500.00,
          200,
          'en',
          'active',
          'premium_customer',
          'end_user',
          'monthly',
          NOW() + INTERVAL '1 month',
          '[]'::jsonb,
          '{"name": "Friend", "phone": "+251911321098", "relationship": "friend"}'::jsonb
        );
    END IF;

    -- Insert Payment Partner (with organization, only if doesn't exist)
    IF cbe_org_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE email = 'partner1@combanketh.et') THEN
        INSERT INTO users (
          email,
          phone,
          full_name,
          full_name_amharic,
          government_id,
          verified,
          wallet_balance,
          total_rides,
          preferred_language,
          status,
          user_role,
          user_type,
          subscription_type,
          organization_id,
          employee_id,
          permissions,
          emergency_contact
        ) VALUES (
          'partner1@combanketh.et',
          '+251911901234',
          'Payment Partner Representative',
          'የክፍያ አጋር ተወካይ',
          'ID009012345',
          true,
          100.00,
          10,
          'am',
          'active',
          'payment_partner',
          'partner',
          'corporate',
          cbe_org_id,
          'CBE001',
          '["payment_integration", "financial_reporting"]'::jsonb,
          '{"name": "Colleague", "phone": "+251911432109", "relationship": "colleague"}'::jsonb
        );
    END IF;

    -- Insert Government Official (with organization, only if doesn't exist)
    IF city_org_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users WHERE email = 'official1@addisababa.gov.et') THEN
        INSERT INTO users (
          email,
          phone,
          full_name,
          full_name_amharic,
          government_id,
          verified,
          wallet_balance,
          total_rides,
          preferred_language,
          status,
          user_role,
          user_type,
          subscription_type,
          organization_id,
          employee_id,
          permissions,
          emergency_contact
        ) VALUES (
          'official1@addisababa.gov.et',
          '+251911012345',
          'Government Official',
          'የመንግስት ባለስልጣን',
          'ID010123456',
          true,
          50.00,
          5,
          'am',
          'active',
          'government_official',
          'partner',
          'corporate',
          city_org_id,
          'GOV001',
          '["regulatory_oversight", "policy_management"]'::jsonb,
          '{"name": "Assistant", "phone": "+251911543210", "relationship": "colleague"}'::jsonb
        );
    END IF;

    -- Grant permissions to admin users (only if users exist and admin_user_id is available)
    IF admin_user_id IS NOT NULL THEN
        -- Super Admin permissions (only if not already granted)
        IF NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = admin_user_id AND permission_name = 'full_system_access') THEN
            INSERT INTO user_permissions (user_id, permission_name, resource_type, granted_by, is_active) VALUES 
            (admin_user_id, 'full_system_access', 'system', admin_user_id, true),
            (admin_user_id, 'user_management', 'users', admin_user_id, true),
            (admin_user_id, 'bike_management', 'bikes', admin_user_id, true),
            (admin_user_id, 'financial_reports', 'payments', admin_user_id, true),
            (admin_user_id, 'system_settings', 'system', admin_user_id, true);
        END IF;

        -- Operations Manager permissions
        IF ops_user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = ops_user_id AND permission_name = 'bike_management') THEN
            INSERT INTO user_permissions (user_id, permission_name, resource_type, granted_by, is_active) VALUES 
            (ops_user_id, 'bike_management', 'bikes', admin_user_id, true),
            (ops_user_id, 'staff_scheduling', 'staff', admin_user_id, true),
            (ops_user_id, 'maintenance_logs', 'maintenance', admin_user_id, true),
            (ops_user_id, 'location_management', 'locations', admin_user_id, true);
        END IF;

        -- Finance Manager permissions
        IF finance_user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = finance_user_id AND permission_name = 'financial_reports') THEN
            INSERT INTO user_permissions (user_id, permission_name, resource_type, granted_by, is_active) VALUES 
            (finance_user_id, 'financial_reports', 'payments', admin_user_id, true),
            (finance_user_id, 'payment_management', 'payments', admin_user_id, true),
            (finance_user_id, 'billing', 'billing', admin_user_id, true);
        END IF;

        -- Customer Support permissions
        IF support_user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = support_user_id AND permission_name = 'user_support') THEN
            INSERT INTO user_permissions (user_id, permission_name, resource_type, granted_by, is_active) VALUES 
            (support_user_id, 'user_support', 'users', admin_user_id, true),
            (support_user_id, 'trip_management', 'trips', admin_user_id, true),
            (support_user_id, 'payment_support', 'payments', admin_user_id, true);
        END IF;

        -- Field Technician permissions
        IF tech_user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM user_permissions WHERE user_id = tech_user_id AND permission_name = 'bike_maintenance') THEN
            INSERT INTO user_permissions (user_id, permission_name, resource_type, granted_by, is_active) VALUES 
            (tech_user_id, 'bike_maintenance', 'bikes', admin_user_id, true),
            (tech_user_id, 'field_operations', 'operations', admin_user_id, true),
            (tech_user_id, 'maintenance_logs', 'maintenance', admin_user_id, true);
        END IF;
    END IF;
END $$;