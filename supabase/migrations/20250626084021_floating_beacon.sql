/*
  # Insert Demo Users for Login Testing

  This migration inserts the demo users that are referenced in the login page.
  Uses simple INSERT statements with proper conflict handling.
*/

-- Insert demo users directly
INSERT INTO users (
  email,
  phone,
  full_name,
  full_name_amharic,
  verified,
  wallet_balance,
  total_rides,
  preferred_language,
  status,
  user_role,
  user_type,
  subscription_type,
  permissions
) VALUES 
-- Super Admin
(
  'admin@bikeshare.et',
  '+251911000001',
  'Admin User',
  'አድሚን ተጠቃሚ',
  true,
  1000.00,
  0,
  'en',
  'active',
  'super_admin',
  'admin',
  'corporate',
  '["all"]'::jsonb
),
-- Operations Manager
(
  'ops.manager@bisklet.et',
  '+251911000002',
  'Operations Manager',
  'የስራ አስኪያጅ',
  true,
  500.00,
  25,
  'en',
  'active',
  'operations_manager',
  'admin',
  'corporate',
  '["bike_management", "staff_scheduling"]'::jsonb
),
-- Finance Manager
(
  'finance.manager@bisklet.et',
  '+251911000003',
  'Finance Manager',
  'የፋይናንስ አስኪያጅ',
  true,
  300.00,
  15,
  'en',
  'active',
  'finance_manager',
  'admin',
  'corporate',
  '["financial_reports", "payment_management"]'::jsonb
),
-- Customer Support
(
  'support@bisklet.et',
  '+251911000004',
  'Customer Support',
  'የደንበኞች አገልግሎት',
  true,
  200.00,
  50,
  'am',
  'active',
  'customer_support',
  'admin',
  'corporate',
  '["user_support", "communication"]'::jsonb
),
-- Field Technician
(
  'tech1@bisklet.et',
  '+251911000005',
  'Field Technician',
  'የሜዳ ቴክኒሻን',
  true,
  150.00,
  30,
  'am',
  'active',
  'field_technician',
  'staff',
  'corporate',
  '["bike_maintenance"]'::jsonb
),
-- Student
(
  'student1@aau.edu.et',
  '+251911000006',
  'University Student',
  'የዩኒቨርሲቲ ተማሪ',
  true,
  75.00,
  120,
  'am',
  'active',
  'student',
  'end_user',
  'student',
  '[]'::jsonb
),
-- Corporate Employee
(
  'employee1@ethiopianairlines.com',
  '+251911000007',
  'Corporate Employee',
  'የድርጅት ሰራተኛ',
  true,
  250.00,
  85,
  'en',
  'active',
  'corporate_user',
  'end_user',
  'corporate',
  '[]'::jsonb
),
-- Premium Customer
(
  'premium1@example.com',
  '+251911000008',
  'Premium Customer',
  'ፕሪሚየም ደንበኛ',
  true,
  500.00,
  200,
  'en',
  'active',
  'premium_customer',
  'end_user',
  'monthly',
  '[]'::jsonb
),
-- Payment Partner
(
  'partner1@combanketh.et',
  '+251911000009',
  'Payment Partner',
  'የክፍያ አጋር',
  true,
  100.00,
  10,
  'am',
  'active',
  'payment_partner',
  'partner',
  'corporate',
  '["payment_integration"]'::jsonb
),
-- Government Official
(
  'official1@addisababa.gov.et',
  '+251911000010',
  'Government Official',
  'የመንግስት ባለስልጣን',
  true,
  50.00,
  5,
  'am',
  'active',
  'government_official',
  'partner',
  'corporate',
  '["regulatory_oversight"]'::jsonb
)
ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  user_role = EXCLUDED.user_role,
  user_type = EXCLUDED.user_type,
  verified = EXCLUDED.verified,
  status = EXCLUDED.status;