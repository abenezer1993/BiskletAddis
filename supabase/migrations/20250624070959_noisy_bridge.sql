/*
  # Insert Sample Data for Bisklet

  1. Ethiopian Locations
  2. Sample Bikes
  3. Ethiopian Holidays
  4. Sample Users (for testing)
  5. Sample Trips and Payments
*/

-- Insert Ethiopian Locations
INSERT INTO locations (name, name_amharic, district, district_amharic, coordinates, is_popular, bike_capacity, current_bikes, demand_level) VALUES
('Meskel Square', 'መስቀል አደባባይ', 'Kirkos', 'ቂርቆስ', ST_GeogFromText('POINT(38.7578 9.0054)'), true, 50, 45, 'high'),
('Bole Airport', 'ቦሌ አየር ማረፊያ', 'Bole', 'ቦሌ', ST_GeogFromText('POINT(38.7988 8.9806)'), true, 30, 23, 'medium'),
('Piazza', 'ፒያሳ', 'Arada', 'አራዳ', ST_GeogFromText('POINT(38.7369 9.0348)'), true, 40, 67, 'high'),
('Mexico Square', 'ሜክሲኮ አደባባይ', 'Kirkos', 'ቂርቆስ', ST_GeogFromText('POINT(38.7489 9.0189)'), true, 35, 34, 'medium'),
('Mercato', 'መርካቶ', 'Addis Ketema', 'አዲስ ከተማ', ST_GeogFromText('POINT(38.7369 9.0348)'), true, 45, 56, 'high'),
('Unity Park', 'አንድነት ፓርክ', 'Addis Ketema', 'አዲስ ከተማ', ST_GeogFromText('POINT(38.7614 9.0227)'), true, 25, 28, 'low'),
('Arat Kilo', 'አራት ኪሎ', 'Gulele', 'ጉለሌ', ST_GeogFromText('POINT(38.7614 9.0427)'), false, 20, 15, 'medium'),
('Kazanchis', 'ካዛንቺስ', 'Bole', 'ቦሌ', ST_GeogFromText('POINT(38.7789 9.0189)'), false, 25, 18, 'medium'),
('Stadium', 'ስታዲየም', 'Kirkos', 'ቂርቆስ', ST_GeogFromText('POINT(38.7489 9.0089)'), false, 30, 22, 'low'),
('Legehar', 'ለገሃር', 'Arada', 'አራዳ', ST_GeogFromText('POINT(38.7269 9.0248)'), false, 20, 12, 'low');

-- Insert Sample Bikes
INSERT INTO bikes (bike_code, qr_code, model, current_location, current_location_name, current_location_amharic, battery_level, status, last_maintenance, total_rides, total_distance_km) VALUES
('BK-1234', 'QR-BK-1234-2024', 'Urban Classic', ST_GeogFromText('POINT(38.7578 9.0054)'), 'Meskel Square', 'መስቀል አደባባይ', 85, 'available', '2024-01-15', 342, 1250.75),
('BK-5678', 'QR-BK-5678-2024', 'City Cruiser', ST_GeogFromText('POINT(38.7988 8.9806)'), 'Bole Airport', 'ቦሌ አየር ማረፊያ', 67, 'in_use', '2024-01-10', 298, 980.50),
('BK-9012', 'QR-BK-9012-2024', 'Urban Classic', ST_GeogFromText('POINT(38.7369 9.0348)'), 'Service Center', 'የአገልግሎት ማዕከል', 23, 'maintenance', '2024-01-05', 456, 1680.25),
('BK-3456', 'QR-BK-3456-2024', 'Electric Pro', ST_GeogFromText('POINT(38.7369 9.0348)'), 'Piazza', 'ፒያሳ', 92, 'available', '2024-01-20', 189, 720.00),
('BK-7890', 'QR-BK-7890-2024', 'City Cruiser', ST_GeogFromText('POINT(38.7489 9.0189)'), 'Mexico Square', 'ሜክሲኮ አደባባይ', 12, 'unavailable', '2023-12-28', 523, 2100.80),
('BK-2468', 'QR-BK-2468-2024', 'Urban Classic', ST_GeogFromText('POINT(38.7369 9.0348)'), 'Mercato', 'መርካቶ', 78, 'available', '2024-01-18', 267, 890.30),
('BK-1357', 'QR-BK-1357-2024', 'Electric Pro', ST_GeogFromText('POINT(38.7614 9.0227)'), 'Unity Park', 'አንድነት ፓርክ', 95, 'available', '2024-01-22', 145, 560.75),
('BK-8642', 'QR-BK-8642-2024', 'City Cruiser', ST_GeogFromText('POINT(38.7614 9.0427)'), 'Arat Kilo', 'አራት ኪሎ', 45, 'available', '2024-01-12', 378, 1340.60);

-- Insert Ethiopian Holidays
INSERT INTO ethiopian_holidays (name, name_amharic, date, holiday_type, description, impact_on_operations, is_recurring) VALUES
('Timkat', 'ጥምቀት', '2024-01-19', 'religious', 'Ethiopian Orthodox Epiphany celebration', 'High bike usage expected around Meskel Square and churches', true),
('Meskel', 'መስቀል', '2024-09-27', 'religious', 'Finding of the True Cross celebration', 'Major celebration at Meskel Square - deploy extra bikes', true),
('Ethiopian New Year', 'እንቁጣጣሽ', '2024-09-11', 'cultural', 'Ethiopian New Year celebration', 'Increased city movement and family visits', true),
('Adwa Victory Day', 'የአድዋ ድል በዓል', '2024-03-02', 'national', 'Victory of Adwa commemoration', 'Parade routes may affect bike placement', true),
('Genna', 'ገና', '2024-01-07', 'religious', 'Ethiopian Orthodox Christmas', 'Family gatherings - moderate bike usage', true),
('Fasika', 'ፋሲካ', '2024-05-05', 'religious', 'Ethiopian Orthodox Easter', 'Church visits and family gatherings', true),
('Labour Day', 'የሰራተኞች ቀን', '2024-05-01', 'national', 'International Workers Day', 'Government offices closed - normal operations', true),
('Patriots Day', 'የአርበኞች ቀን', '2024-05-05', 'national', 'Patriots Victory Day', 'Commemorative events in the city', true);

-- Insert Sample Users (for testing - in production, users register through the app)
INSERT INTO users (email, phone, full_name, full_name_amharic, verified, wallet_balance, total_rides, preferred_language, status) VALUES
('abebe.kebede@email.com', '+251911234567', 'Abebe Kebede', 'አበበ ከበደ', true, 250.50, 45, 'am', 'active'),
('hanna.tadesse@email.com', '+251922345678', 'Hanna Tadesse', 'ሃና ታደሰ', true, 125.75, 28, 'en', 'active'),
('dawit.mekonen@email.com', '+251933456789', 'Dawit Mekonen', 'ዳዊት መኮንን', false, 0.00, 0, 'en', 'pending'),
('sara.ahmed@email.com', '+251944567890', 'Sara Ahmed', 'ሳራ አህመድ', true, 78.25, 62, 'or', 'active'),
('michael.bekele@email.com', '+251955678901', 'Michael Bekele', 'ሚካኤል በቀለ', true, 15.00, 12, 'en', 'suspended'),
('almaz.tesfaye@email.com', '+251966789012', 'Almaz Tesfaye', 'አልማዝ ተስፋዬ', true, 180.00, 89, 'am', 'active'),
('yohannes.girma@email.com', '+251977890123', 'Yohannes Girma', 'ዮሃንስ ግርማ', true, 95.50, 34, 'en', 'active');

-- Insert Sample System Alerts
INSERT INTO system_alerts (alert_type, title, message, severity, entity_type, entity_id) VALUES
('low_battery', 'Low Battery Alert', '15 bikes need charging in the next 2 hours', 'high', 'bike', null),
('maintenance_due', 'Maintenance Due', '8 bikes require scheduled maintenance this week', 'medium', 'bike', null),
('high_demand', 'High Demand Area', 'Bole area needs more bikes - current demand exceeds supply', 'medium', 'location', null),
('holiday_preparation', 'Timkat Preparation', 'Extra bikes needed at Meskel Square for upcoming Timkat celebration', 'low', 'location', null),
('payment_issue', 'Payment Gateway Issue', 'Telebirr payment processing experiencing delays', 'high', 'system', null);

-- Insert Sample Maintenance Logs
INSERT INTO maintenance_logs (bike_id, maintenance_type, description, cost_etb, technician_name, status, scheduled_date, completed_date) VALUES
((SELECT id FROM bikes WHERE bike_code = 'BK-9012'), 'repair', 'Chain replacement and brake adjustment', 150.00, 'Tekle Hailu', 'completed', '2024-01-05', '2024-01-05'),
((SELECT id FROM bikes WHERE bike_code = 'BK-7890'), 'battery', 'Battery replacement required', 300.00, 'Meseret Alemu', 'in_progress', '2024-01-25', null),
((SELECT id FROM bikes WHERE bike_code = 'BK-1234'), 'routine', 'Monthly inspection and cleaning', 50.00, 'Dawit Bekele', 'completed', '2024-01-15', '2024-01-15'),
((SELECT id FROM bikes WHERE bike_code = 'BK-5678'), 'inspection', 'Safety inspection after 300 rides', 75.00, 'Hanna Worku', 'scheduled', '2024-01-30', null);