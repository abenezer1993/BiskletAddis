/*
  # Add Demo User Accounts

  1. New Data
    - Insert demo user accounts for testing and demonstration
    - Covers all user types: admin, staff, partner, end_user
    - Includes various roles from super admin to customers
    - Sets up proper organization relationships where needed

  2. User Types Added
    - Super Admin (admin type)
    - Operations Manager (admin type) 
    - Finance Manager (admin type)
    - Customer Support (admin type)
    - Field Technician (staff type)
    - Student (end_user type)
    - Corporate User (end_user type)
    - Premium Customer (end_user type)
    - Payment Partner (partner type)
    - Government Official (partner type)

  3. Security
    - All users set to 'active' status
    - Verified accounts for proper access
    - Proper user_type and user_role assignments
*/

-- First, let's add some organizations that the demo users can belong to
INSERT INTO organizations (id, name, name_amharic, organization_type, contact_email, contact_phone, is_active) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Addis Ababa University', 'አዲስ አበባ ዩኒቨርሲቲ', 'educational', 'admin@aau.edu.et', '+251911123456', true),
  ('550e8400-e29b-41d4-a716-446655440002', 'Ethiopian Airlines', 'የኢትዮጵያ አየር መንገድ', 'corporate', 'hr@ethiopianairlines.com', '+251911234567', true),
  ('550e8400-e29b-41d4-a716-446655440003', 'Commercial Bank of Ethiopia', 'የኢትዮጵያ ንግድ ባንክ', 'partner', 'partnership@combanketh.et', '+251911345678', true),
  ('550e8400-e29b-41d4-a716-446655440004', 'Addis Ababa City Administration', 'አዲስ አበባ ከተማ አስተዳደር', 'government', 'info@addisababa.gov.et', '+251911456789', true)
ON CONFLICT (id) DO NOTHING;

-- Now add the demo users
INSERT INTO users (
  id,
  email,
  phone,
  full_name,
  full_name_amharic,
  user_role,
  user_type,
  verified,
  status,
  organization_id,
  student_id,
  employee_id,
  subscription_type,
  wallet_balance,
  permissions
) VALUES
  -- Super Admin
  (
    '550e8400-e29b-41d4-a716-446655440010',
    'admin@bikeshare.et',
    '+251911000001',
    'System Administrator',
    'ሲስተም አስተዳዳሪ',
    'super_admin',
    'admin',
    true,
    'active',
    NULL,
    NULL,
    NULL,
    'pay_per_ride',
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
    true,
    'active',
    NULL,
    NULL,
    'EMP001',
    'pay_per_ride',
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
    true,
    'active',
    NULL,
    NULL,
    'EMP002',
    'pay_per_ride',
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
    true,
    'active',
    NULL,
    NULL,
    'EMP003',
    'pay_per_ride',
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
    true,
    'active',
    NULL,
    NULL,
    'TECH001',
    'pay_per_ride',
    0.00,
    '["bike_maintenance", "field_operations"]'::jsonb
  ),
  
  -- Student
  (
    '550e8400-e29b-41d4-a716-446655440015',
    'student1@aau.edu.et',
    '+251911000006',
    'Student User',
    'ተማሪ ተጠቃሚ',
    'student',
    'end_user',
    true,
    'active',
    '550e8400-e29b-41d4-a716-446655440001',
    'AAU2024001',
    NULL,
    'student',
    50.00,
    '[]'::jsonb
  ),
  
  -- Corporate User
  (
    '550e8400-e29b-41d4-a716-446655440016',
    'employee1@ethiopianairlines.com',
    '+251911000007',
    'Corporate Employee',
    'የድርጅት ሰራተኛ',
    'corporate_user',
    'end_user',
    true,
    'active',
    '550e8400-e29b-41d4-a716-446655440002',
    NULL,
    'ET2024001',
    'corporate',
    100.00,
    '[]'::jsonb
  ),
  
  -- Premium Customer
  (
    '550e8400-e29b-41d4-a716-446655440017',
    'premium1@example.com',
    '+251911000008',
    'Premium Customer',
    'ፕሪሚየም ደንበኛ',
    'premium_customer',
    'end_user',
    true,
    'active',
    NULL,
    NULL,
    NULL,
    'monthly',
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
    true,
    'active',
    '550e8400-e29b-41d4-a716-446655440003',
    NULL,
    'CBE2024001',
    'pay_per_ride',
    0.00,
    '["payment_integration", "financial_reports"]'::jsonb
  ),
  
  -- Government Official
  (
    '550e8400-e29b-41d4-a716-446655440019',
    'official1@addisababa.gov.et',
    '+251911000010',
    'City Administration Official',
    'የከተማ አስተዳደር ባለስልጣን',
    'government_official',
    'partner',
    true,
    'active',
    '550e8400-e29b-41d4-a716-446655440004',
    NULL,
    'GOV2024001',
    'pay_per_ride',
    0.00,
    '["city_reports", "regulatory_access"]'::jsonb
  )
ON CONFLICT (email) DO NOTHING;

-- Update subscription expiry for monthly subscriber
UPDATE users 
SET subscription_expires_at = (CURRENT_TIMESTAMP + INTERVAL '30 days')
WHERE email = 'premium1@example.com';