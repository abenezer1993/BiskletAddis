/*
  # Seed Demo Users for Login Testing
  
  This migration inserts demo users that are referenced in the login page.
  Uses ON CONFLICT to handle existing users gracefully.
*/

-- Insert demo users with conflict handling
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
  permissions,
  emergency_contact
) VALUES 
-- Super Admin
(
  'admin@bikeshare.et',
  '+251911123456',
  'System Administrator',
  'ሲስተም አስተዳዳሪ',
  'ID001234567',
  true,
  0.00,
  0,
  'en',
  'active',
  'super_admin',
  'admin',
  'pay_per_ride',
  '["user_management", "bike_management", "financial_reports", "system_settings", "analytics"]'::jsonb,
  '{"name": "Emergency Contact", "phone": "+251911987654"}'::jsonb
),

-- Operations Manager
(
  'ops.manager@bisklet.et',
  '+251911234567',
  'Operations Manager',
  'ኦፕሬሽን ማኔጀር',
  'ID001234568',
  true,
  0.00,
  0,
  'en',
  'active',
  'operations_manager',
  'admin',
  'pay_per_ride',
  '["bike_management", "staff_management", "maintenance_logs", "location_management"]'::jsonb,
  '{"name": "Emergency Contact", "phone": "+251911987655"}'::jsonb
),

-- Finance Manager
(
  'finance.manager@bisklet.et',
  '+251911345678',
  'Finance Manager',
  'ፋይናንስ ማኔጀር',
  'ID001234569',
  true,
  0.00,
  0,
  'en',
  'active',
  'finance_manager',
  'admin',
  'pay_per_ride',
  '["financial_reports", "payment_management", "billing", "analytics"]'::jsonb,
  '{"name": "Emergency Contact", "phone": "+251911987656"}'::jsonb
),

-- Customer Support
(
  'support@bisklet.et',
  '+251911456789',
  'Customer Support Agent',
  'ደንበኛ አገልግሎት ወኪል',
  'ID001234570',
  true,
  0.00,
  0,
  'en',
  'active',
  'customer_support',
  'admin',
  'pay_per_ride',
  '["user_support", "trip_management", "payment_support", "communication"]'::jsonb,
  '{"name": "Emergency Contact", "phone": "+251911987657"}'::jsonb
),

-- Field Technician
(
  'tech1@bisklet.et',
  '+251911567890',
  'Field Technician',
  'የመስክ ቴክኒሻን',
  'ID001234571',
  true,
  0.00,
  0,
  'en',
  'active',
  'field_technician',
  'staff',
  'pay_per_ride',
  '["bike_maintenance", "repair_logs", "inspection", "field_operations"]'::jsonb,
  '{"name": "Emergency Contact", "phone": "+251911987658"}'::jsonb
),

-- Student
(
  'student1@aau.edu.et',
  '+251911678901',
  'Addis Ababa University Student',
  'አዲስ አበባ ዩኒቨርሲቲ ተማሪ',
  'ID001234572',
  true,
  50.00,
  15,
  'en',
  'active',
  'student',
  'end_user',
  'student',
  '["bike_rental", "trip_history", "payment"]'::jsonb,
  '{"name": "Parent Contact", "phone": "+251911987659"}'::jsonb
),

-- Corporate User
(
  'employee1@ethiopianairlines.com',
  '+251911789012',
  'Ethiopian Airlines Employee',
  'የኢትዮጵያ አየር መንገድ ሰራተኛ',
  'ID001234573',
  true,
  100.00,
  25,
  'en',
  'active',
  'corporate_user',
  'end_user',
  'corporate',
  '["bike_rental", "trip_history", "corporate_billing"]'::jsonb,
  '{"name": "HR Department", "phone": "+251911987660"}'::jsonb
),

-- Premium Customer
(
  'premium1@example.com',
  '+251911890123',
  'Premium Customer',
  'ፕሪሚየም ደንበኛ',
  'ID001234574',
  true,
  200.00,
  50,
  'en',
  'active',
  'premium_customer',
  'end_user',
  'monthly',
  '["bike_rental", "trip_history", "premium_features", "priority_support"]'::jsonb,
  '{"name": "Emergency Contact", "phone": "+251911987661"}'::jsonb
),

-- Payment Partner
(
  'partner1@combanketh.et',
  '+251911901234',
  'Commercial Bank Partnership',
  'የንግድ ባንክ አጋርነት',
  'ID001234575',
  true,
  0.00,
  0,
  'en',
  'active',
  'payment_partner',
  'partner',
  'pay_per_ride',
  '["payment_processing", "financial_integration", "reporting"]'::jsonb,
  '{"name": "Bank Manager", "phone": "+251911987662"}'::jsonb
),

-- Government Official
(
  'official1@addisababa.gov.et',
  '+251911012345',
  'City Administration Official',
  'የከተማ አስተዳደር ባለስልጣን',
  'ID001234576',
  true,
  0.00,
  5,
  'en',
  'active',
  'government_official',
  'partner',
  'pay_per_ride',
  '["policy_oversight", "regulatory_compliance", "city_planning"]'::jsonb,
  '{"name": "Office Contact", "phone": "+251911987663"}'::jsonb
)
ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  full_name_amharic = EXCLUDED.full_name_amharic,
  user_role = EXCLUDED.user_role,
  user_type = EXCLUDED.user_type,
  subscription_type = EXCLUDED.subscription_type,
  verified = EXCLUDED.verified,
  status = EXCLUDED.status,
  permissions = EXCLUDED.permissions,
  emergency_contact = EXCLUDED.emergency_contact;

-- Handle phone conflicts separately since phone is also unique
DO $$
BEGIN
  -- Update phone numbers for existing users to avoid conflicts
  UPDATE users SET phone = '+251911123456' WHERE email = 'admin@bikeshare.et';
  UPDATE users SET phone = '+251911234567' WHERE email = 'ops.manager@bisklet.et';
  UPDATE users SET phone = '+251911345678' WHERE email = 'finance.manager@bisklet.et';
  UPDATE users SET phone = '+251911456789' WHERE email = 'support@bisklet.et';
  UPDATE users SET phone = '+251911567890' WHERE email = 'tech1@bisklet.et';
  UPDATE users SET phone = '+251911678901' WHERE email = 'student1@aau.edu.et';
  UPDATE users SET phone = '+251911789012' WHERE email = 'employee1@ethiopianairlines.com';
  UPDATE users SET phone = '+251911890123' WHERE email = 'premium1@example.com';
  UPDATE users SET phone = '+251911901234' WHERE email = 'partner1@combanketh.et';
  UPDATE users SET phone = '+251911012345' WHERE email = 'official1@addisababa.gov.et';
EXCEPTION
  WHEN OTHERS THEN
    -- Ignore errors if users don't exist yet
    NULL;
END $$;

-- Set subscription expiry for monthly users
UPDATE users SET subscription_expires_at = (now() + interval '30 days')
WHERE subscription_type = 'monthly' AND email IN (
  'admin@bikeshare.et',
  'ops.manager@bisklet.et',
  'finance.manager@bisklet.et',
  'support@bisklet.et',
  'tech1@bisklet.et',
  'student1@aau.edu.et',
  'employee1@ethiopianairlines.com',
  'premium1@example.com',
  'partner1@combanketh.et',
  'official1@addisababa.gov.et'
);

-- Set subscription expiry for student users  
UPDATE users SET subscription_expires_at = (now() + interval '1 year')
WHERE subscription_type = 'student' AND email IN (
  'admin@bikeshare.et',
  'ops.manager@bisklet.et',
  'finance.manager@bisklet.et',
  'support@bisklet.et',
  'tech1@bisklet.et',
  'student1@aau.edu.et',
  'employee1@ethiopianairlines.com',
  'premium1@example.com',
  'partner1@combanketh.et',
  'official1@addisababa.gov.et'
);

-- Set subscription expiry for corporate users
UPDATE users SET subscription_expires_at = (now() + interval '1 year')
WHERE subscription_type = 'corporate' AND email IN (
  'admin@bikeshare.et',
  'ops.manager@bisklet.et',
  'finance.manager@bisklet.et',
  'support@bisklet.et',
  'tech1@bisklet.et',
  'student1@aau.edu.et',
  'employee1@ethiopianairlines.com',
  'premium1@example.com',
  'partner1@combanketh.et',
  'official1@addisababa.gov.et'
);