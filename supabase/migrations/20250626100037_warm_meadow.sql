/*
  # Add Demo Users for Login Testing

  1. New Data
    - Insert demo user accounts for all user types and roles
    - Includes admin, staff, end users, and partners
    - Covers different organizations and subscription types

  2. Users Added
    - Super Admin (admin@bikeshare.et)
    - Operations Manager (ops.manager@bisklet.et)
    - Finance Manager (finance.manager@bisklet.et)
    - Customer Support (support@bisklet.et)
    - Field Technician (tech1@bisklet.et)
    - Student (student1@aau.edu.et)
    - Corporate User (employee1@ethiopianairlines.com)
    - Premium Customer (premium1@example.com)
    - Payment Partner (partner1@combanketh.et)
    - Government Official (official1@addisababa.gov.et)

  3. Organizations
    - Creates necessary organizations for corporate and institutional users
*/

-- First, insert organizations that will be referenced by users
INSERT INTO organizations (id, name, name_amharic, organization_type, contact_email, contact_phone, is_active) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Addis Ababa University', 'አዲስ አበባ ዩኒቨርሲቲ', 'educational', 'admin@aau.edu.et', '+251911123456', true),
  ('550e8400-e29b-41d4-a716-446655440002', 'Ethiopian Airlines', 'የኢትዮጵያ አየር መንገድ', 'corporate', 'hr@ethiopianairlines.com', '+251911234567', true),
  ('550e8400-e29b-41d4-a716-446655440003', 'Commercial Bank of Ethiopia', 'የኢትዮጵያ ንግድ ባንክ', 'partner', 'info@combanketh.et', '+251911345678', true),
  ('550e8400-e29b-41d4-a716-446655440004', 'Addis Ababa City Administration', 'አዲስ አበባ ከተማ አስተዳደር', 'government', 'info@addisababa.gov.et', '+251911456789', true)
ON CONFLICT (id) DO NOTHING;

-- Insert demo users
INSERT INTO users (
  id, 
  email, 
  phone, 
  full_name, 
  full_name_amharic, 
  user_role, 
  user_type, 
  subscription_type,
  organization_id,
  student_id,
  employee_id,
  verified,
  status,
  wallet_balance,
  permissions
) VALUES
  -- Super Admin
  (
    '550e8400-e29b-41d4-a716-446655440010',
    'admin@bikeshare.et',
    '+251911000001',
    'System Administrator',
    'የስርዓት አስተዳዳሪ',
    'super_admin',
    'admin',
    'pay_per_ride',
    NULL,
    NULL,
    NULL,
    true,
    'active',
    0.00,
    '["all"]'::jsonb
  ),
  
  -- Operations Manager
  (
    '550e8400-e29b-41d4-a716-446655440011',
    'ops.manager@bisklet.et',
    '+251911000002',
    'Operations Manager',
    'የስራ አስኪያጅ',
    'operations_manager',
    'admin',
    'pay_per_ride',
    NULL,
    NULL,
    'EMP001',
    true,
    'active',
    0.00,
    '["bike_management", "staff_management", "location_management"]'::jsonb
  ),
  
  -- Finance Manager
  (
    '550e8400-e29b-41d4-a716-446655440012',
    'finance.manager@bisklet.et',
    '+251911000003',
    'Finance Manager',
    'የፋይናንስ አስኪያጅ',
    'finance_manager',
    'admin',
    'pay_per_ride',
    NULL,
    NULL,
    'EMP002',
    true,
    'active',
    0.00,
    '["financial_reports", "payment_management", "billing"]'::jsonb
  ),
  
  -- Customer Support
  (
    '550e8400-e29b-41d4-a716-446655440013',
    'support@bisklet.et',
    '+251911000004',
    'Customer Support Agent',
    'የደንበኞች አገልግሎት ወኪል',
    'customer_support',
    'admin',
    'pay_per_ride',
    NULL,
    NULL,
    'EMP003',
    true,
    'active',
    0.00,
    '["user_support", "communication", "basic_reports"]'::jsonb
  ),
  
  -- Field Technician
  (
    '550e8400-e29b-41d4-a716-446655440014',
    'tech1@bisklet.et',
    '+251911000005',
    'Field Technician',
    'የሜዳ ቴክኒሻን',
    'field_technician',
    'staff',
    'pay_per_ride',
    NULL,
    NULL,
    'TECH001',
    true,
    'active',
    0.00,
    '["bike_maintenance", "field_operations"]'::jsonb
  ),
  
  -- Student
  (
    '550e8400-e29b-41d4-a716-446655440015',
    'student1@aau.edu.et',
    '+251911000006',
    'Abebe Kebede',
    'አበበ ከበደ',
    'student',
    'end_user',
    'student',
    '550e8400-e29b-41d4-a716-446655440001',
    'AAU2024001',
    NULL,
    true,
    'active',
    50.00,
    '[]'::jsonb
  ),
  
  -- Corporate User
  (
    '550e8400-e29b-41d4-a716-446655440016',
    'employee1@ethiopianairlines.com',
    '+251911000007',
    'Tigist Haile',
    'ትግስት ሃይሌ',
    'corporate_user',
    'end_user',
    'corporate',
    '550e8400-e29b-41d4-a716-446655440002',
    NULL,
    'ET2024001',
    true,
    'active',
    100.00,
    '[]'::jsonb
  ),
  
  -- Premium Customer
  (
    '550e8400-e29b-41d4-a716-446655440017',
    'premium1@example.com',
    '+251911000008',
    'Meron Tadesse',
    'መሮን ታደሰ',
    'premium_customer',
    'end_user',
    'monthly',
    NULL,
    NULL,
    NULL,
    true,
    'active',
    200.00,
    '[]'::jsonb
  ),
  
  -- Payment Partner
  (
    '550e8400-e29b-41d4-a716-446655440018',
    'partner1@combanketh.et',
    '+251911000009',
    'Bank Partnership Manager',
    'የባንክ አጋርነት አስኪያጅ',
    'payment_partner',
    'partner',
    'pay_per_ride',
    '550e8400-e29b-41d4-a716-446655440003',
    NULL,
    'CBE001',
    true,
    'active',
    0.00,
    '["payment_integration", "financial_reports"]'::jsonb
  ),
  
  -- Government Official
  (
    '550e8400-e29b-41d4-a716-446655440019',
    'official1@addisababa.gov.et',
    '+251911000010',
    'City Transport Official',
    'የከተማ ትራንስፖርት ባለስልጣን',
    'government_official',
    'partner',
    'pay_per_ride',
    '550e8400-e29b-41d4-a716-446655440004',
    NULL,
    'GOV001',
    true,
    'active',
    0.00,
    '["regulatory_reports", "city_planning"]'::jsonb
  )
ON CONFLICT (email) DO NOTHING;

-- Update subscription expiry for monthly subscriber
UPDATE users 
SET subscription_expires_at = (CURRENT_TIMESTAMP + INTERVAL '30 days')
WHERE email = 'premium1@example.com';