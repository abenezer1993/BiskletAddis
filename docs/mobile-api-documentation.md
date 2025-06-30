# Bisklet Mobile API Documentation

## 🚀 **Complete REST API Guide for Flutter Development**

This documentation provides everything needed to build the Bisklet mobile app using Flutter with Supabase backend.

---

## 📋 **Table of Contents**

1. [Authentication & User Management](#authentication--user-management)
2. [Bike Management](#bike-management)
3. [Trip Management](#trip-management)
4. [Payment Integration](#payment-integration)
5. [Location Services](#location-services)
6. [Real-time Features](#real-time-features)
7. [Ethiopian Localization](#ethiopian-localization)
8. [Error Handling](#error-handling)
9. [Flutter Implementation Examples](#flutter-implementation-examples)

---

## 🔐 **Authentication & User Management**

### **Base Configuration**
```dart
// lib/services/supabase_service.dart
import 'package:supabase_flutter/supabase_flutter.dart';

class SupabaseService {
  static const String supabaseUrl = 'YOUR_SUPABASE_URL';
  static const String supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
  
  static SupabaseClient get client => Supabase.instance.client;
}
```

### **1. User Registration**
```http
POST /auth/v1/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "data": {
    "full_name": "Abebe Kebede",
    "full_name_amharic": "አበበ ከበደ",
    "phone": "+251911234567",
    "preferred_language": "am"
  }
}
```

**Flutter Implementation:**
```dart
Future<AuthResponse> registerUser({
  required String email,
  required String password,
  required String fullName,
  String? fullNameAmharic,
  required String phone,
  String preferredLanguage = 'en',
}) async {
  return await SupabaseService.client.auth.signUp(
    email: email,
    password: password,
    data: {
      'full_name': fullName,
      'full_name_amharic': fullNameAmharic,
      'phone': phone,
      'preferred_language': preferredLanguage,
    },
  );
}
```

### **2. User Login**
```http
POST /auth/v1/token?grant_type=password
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Flutter Implementation:**
```dart
Future<AuthResponse> loginUser({
  required String email,
  required String password,
}) async {
  return await SupabaseService.client.auth.signInWithPassword(
    email: email,
    password: password,
  );
}
```

### **3. Get User Profile**
```http
GET /rest/v1/users?id=eq.{user_id}
Authorization: Bearer {jwt_token}
```

**Flutter Implementation:**
```dart
Future<Map<String, dynamic>?> getUserProfile() async {
  final user = SupabaseService.client.auth.currentUser;
  if (user == null) return null;
  
  final response = await SupabaseService.client
      .from('users')
      .select('''
        id, email, phone, full_name, full_name_amharic,
        verified, wallet_balance, total_rides, preferred_language,
        status, user_role, subscription_type, subscription_expires_at,
        organizations(name, name_amharic)
      ''')
      .eq('id', user.id)
      .single();
      
  return response;
}
```

### **4. Update User Profile**
```http
PATCH /rest/v1/users?id=eq.{user_id}
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "full_name": "Updated Name",
  "phone": "+251911234567",
  "preferred_language": "am"
}
```

---

## 🚲 **Bike Management**

### **1. Get Available Bikes**
```http
GET /rest/v1/bikes?status=eq.available&select=*
Authorization: Bearer {jwt_token}
```

**Flutter Implementation:**
```dart
Future<List<Map<String, dynamic>>> getAvailableBikes() async {
  final response = await SupabaseService.client
      .from('bikes')
      .select('''
        id, bike_code, model, current_location_name,
        current_location_amharic, battery_level, status,
        total_rides, total_distance_km
      ''')
      .eq('status', 'available')
      .order('battery_level', ascending: false);
      
  return List<Map<String, dynamic>>.from(response);
}
```

### **2. Get Bikes Near Location**
```http
GET /rest/v1/rpc/bikes_near_location
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "lat": 9.0054,
  "lng": 38.7578,
  "radius_km": 2.0
}
```

**PostgreSQL Function (for reference):**
```sql
CREATE OR REPLACE FUNCTION bikes_near_location(lat FLOAT, lng FLOAT, radius_km FLOAT)
RETURNS TABLE(
  id UUID,
  bike_code TEXT,
  model TEXT,
  current_location_name TEXT,
  current_location_amharic TEXT,
  battery_level INTEGER,
  distance_km FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.bike_code,
    b.model,
    b.current_location_name,
    b.current_location_amharic,
    b.battery_level,
    ST_Distance(
      ST_GeogFromText('POINT(' || lng || ' ' || lat || ')'),
      b.current_location
    ) / 1000 AS distance_km
  FROM bikes b
  WHERE b.status = 'available'
    AND ST_DWithin(
      ST_GeogFromText('POINT(' || lng || ' ' || lat || ')'),
      b.current_location,
      radius_km * 1000
    )
  ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql;
```

### **3. Get Bike Details by QR Code**
```http
GET /rest/v1/bikes?qr_code=eq.{qr_code}&select=*
Authorization: Bearer {jwt_token}
```

**Flutter Implementation:**
```dart
Future<Map<String, dynamic>?> getBikeByQRCode(String qrCode) async {
  final response = await SupabaseService.client
      .from('bikes')
      .select('*')
      .eq('qr_code', qrCode)
      .maybeSingle();
      
  return response;
}
```

---

## 🛣️ **Trip Management**

### **1. Start a Trip**
```http
POST /rest/v1/trips
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "bike_id": "bike-uuid",
  "start_location": "POINT(38.7578 9.0054)",
  "start_location_name": "Meskel Square"
}
```

**Flutter Implementation:**
```dart
Future<Map<String, dynamic>> startTrip({
  required String bikeId,
  required double startLat,
  required double startLng,
  String? startLocationName,
}) async {
  final user = SupabaseService.client.auth.currentUser;
  if (user == null) throw Exception('User not authenticated');
  
  // First, update bike status to 'in_use'
  await SupabaseService.client
      .from('bikes')
      .update({'status': 'in_use'})
      .eq('id', bikeId);
  
  // Create trip record
  final response = await SupabaseService.client
      .from('trips')
      .insert({
        'user_id': user.id,
        'bike_id': bikeId,
        'start_location': 'POINT($startLng $startLat)',
        'start_location_name': startLocationName,
        'status': 'active',
      })
      .select()
      .single();
      
  return response;
}
```

### **2. End a Trip**
```http
PATCH /rest/v1/trips?id=eq.{trip_id}
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "end_time": "2024-01-07T14:30:00Z",
  "end_location": "POINT(38.7992 8.9806)",
  "end_location_name": "Bole Airport",
  "distance_km": 5.2,
  "duration_minutes": 25,
  "cost_etb": 15.50,
  "status": "completed"
}
```

**Flutter Implementation:**
```dart
Future<Map<String, dynamic>> endTrip({
  required String tripId,
  required String bikeId,
  required double endLat,
  required double endLng,
  String? endLocationName,
  required double distanceKm,
  required int durationMinutes,
  required double costEtb,
}) async {
  // Update bike status back to 'available'
  await SupabaseService.client
      .from('bikes')
      .update({'status': 'available'})
      .eq('id', bikeId);
  
  // Update trip record
  final response = await SupabaseService.client
      .from('trips')
      .update({
        'end_time': DateTime.now().toIso8601String(),
        'end_location': 'POINT($endLng $endLat)',
        'end_location_name': endLocationName,
        'distance_km': distanceKm,
        'duration_minutes': durationMinutes,
        'cost_etb': costEtb,
        'status': 'completed',
      })
      .eq('id', tripId)
      .select()
      .single();
      
  return response;
}
```

### **3. Get User Trip History**
```http
GET /rest/v1/trips?user_id=eq.{user_id}&order=created_at.desc
Authorization: Bearer {jwt_token}
```

**Flutter Implementation:**
```dart
Future<List<Map<String, dynamic>>> getUserTripHistory({
  int limit = 50,
  int offset = 0,
}) async {
  final user = SupabaseService.client.auth.currentUser;
  if (user == null) return [];
  
  final response = await SupabaseService.client
      .from('trips')
      .select('''
        id, start_time, end_time, start_location_name,
        end_location_name, distance_km, duration_minutes,
        cost_etb, payment_status, status,
        bikes(bike_code, model)
      ''')
      .eq('user_id', user.id)
      .order('created_at', ascending: false)
      .range(offset, offset + limit - 1);
      
  return List<Map<String, dynamic>>.from(response);
}
```

### **4. Get Active Trip**
```http
GET /rest/v1/trips?user_id=eq.{user_id}&status=eq.active
Authorization: Bearer {jwt_token}
```

---

## 💳 **Payment Integration**

### **1. Ethiopian Payment Methods**
```dart
enum PaymentMethod {
  telebirr('telebirr', 'Telebirr', '📱'),
  cbeBirr('cbe_birr', 'CBE Birr', '🏦'),
  dashenBank('dashen_bank', 'Dashen Bank', '💳'),
  awashBank('awash_bank', 'Awash Bank', '🏛️'),
  wallet('wallet', 'Wallet', '💰'),
  cash('cash', 'Cash', '💵');
  
  const PaymentMethod(this.value, this.displayName, this.icon);
  final String value;
  final String displayName;
  final String icon;
}
```

### **2. Create Payment**
```http
POST /rest/v1/payments
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "trip_id": "trip-uuid",
  "amount_etb": 15.50,
  "payment_method": "telebirr",
  "payment_type": "ride"
}
```

**Flutter Implementation:**
```dart
Future<Map<String, dynamic>> createPayment({
  String? tripId,
  required double amountEtb,
  required PaymentMethod paymentMethod,
  String paymentType = 'ride',
  Map<String, dynamic>? metadata,
}) async {
  final user = SupabaseService.client.auth.currentUser;
  if (user == null) throw Exception('User not authenticated');
  
  final response = await SupabaseService.client
      .from('payments')
      .insert({
        'user_id': user.id,
        'trip_id': tripId,
        'amount_etb': amountEtb,
        'payment_method': paymentMethod.value,
        'payment_type': paymentType,
        'status': 'pending',
        'metadata': metadata,
      })
      .select()
      .single();
      
  return response;
}
```

### **3. Process Telebirr Payment**
```dart
Future<bool> processTelebirrPayment({
  required String paymentId,
  required double amount,
  required String phoneNumber,
}) async {
  // This would integrate with Telebirr API
  // For now, simulate payment processing
  
  try {
    // Simulate API call to Telebirr
    await Future.delayed(Duration(seconds: 2));
    
    // Update payment status
    await SupabaseService.client
        .from('payments')
        .update({
          'status': 'completed',
          'processed_at': DateTime.now().toIso8601String(),
          'transaction_id': 'TXN_${DateTime.now().millisecondsSinceEpoch}',
          'external_reference': phoneNumber,
        })
        .eq('id', paymentId);
        
    return true;
  } catch (e) {
    // Update payment status to failed
    await SupabaseService.client
        .from('payments')
        .update({'status': 'failed'})
        .eq('id', paymentId);
        
    return false;
  }
}
```

### **4. Wallet Top-up**
```http
POST /rest/v1/payments
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "amount_etb": 100.00,
  "payment_method": "telebirr",
  "payment_type": "wallet_topup"
}
```

---

## 📍 **Location Services**

### **1. Get Popular Ethiopian Locations**
```http
GET /rest/v1/locations?is_popular=eq.true&order=name
Authorization: Bearer {jwt_token}
```

**Flutter Implementation:**
```dart
Future<List<Map<String, dynamic>>> getPopularLocations() async {
  final response = await SupabaseService.client
      .from('locations')
      .select('''
        id, name, name_amharic, district, district_amharic,
        is_popular, bike_capacity, current_bikes, demand_level
      ''')
      .eq('is_popular', true)
      .order('name');
      
  return List<Map<String, dynamic>>.from(response);
}
```

### **2. Search Locations**
```http
GET /rest/v1/locations?or=(name.ilike.%{query}%,name_amharic.ilike.%{query}%)
Authorization: Bearer {jwt_token}
```

**Flutter Implementation:**
```dart
Future<List<Map<String, dynamic>>> searchLocations(String query) async {
  final response = await SupabaseService.client
      .from('locations')
      .select('*')
      .or('name.ilike.%$query%,name_amharic.ilike.%$query%')
      .limit(10);
      
  return List<Map<String, dynamic>>.from(response);
}
```

---

## 🔄 **Real-time Features**

### **1. Real-time Bike Status Updates**
```dart
class BikeStatusService {
  static StreamSubscription<List<Map<String, dynamic>>>? _subscription;
  
  static Stream<List<Map<String, dynamic>>> watchAvailableBikes() {
    return SupabaseService.client
        .from('bikes')
        .stream(primaryKey: ['id'])
        .eq('status', 'available')
        .order('battery_level', ascending: false);
  }
  
  static void startWatching(Function(List<Map<String, dynamic>>) onUpdate) {
    _subscription = watchAvailableBikes().listen(onUpdate);
  }
  
  static void stopWatching() {
    _subscription?.cancel();
    _subscription = null;
  }
}
```

### **2. Real-time Trip Updates**
```dart
Stream<Map<String, dynamic>?> watchActiveTrip() {
  final user = SupabaseService.client.auth.currentUser;
  if (user == null) return Stream.value(null);
  
  return SupabaseService.client
      .from('trips')
      .stream(primaryKey: ['id'])
      .eq('user_id', user.id)
      .eq('status', 'active')
      .map((trips) => trips.isNotEmpty ? trips.first : null);
}
```

---

## 🌍 **Ethiopian Localization**

### **1. Multi-language Support**
```dart
class LocalizationService {
  static const Map<String, Map<String, String>> _translations = {
    'en': {
      'welcome': 'Welcome to Bisklet',
      'find_bike': 'Find a Bike',
      'start_ride': 'Start Ride',
      'end_ride': 'End Ride',
      'payment_methods': 'Payment Methods',
      'trip_history': 'Trip History',
      'wallet_balance': 'Wallet Balance',
    },
    'am': {
      'welcome': 'ወደ ቢስክሌት እንኳን ደህና መጡ',
      'find_bike': 'ብስክሌት ፈልግ',
      'start_ride': 'ጉዞ ጀምር',
      'end_ride': 'ጉዞ አጠናቅቅ',
      'payment_methods': 'የክፍያ ዘዴዎች',
      'trip_history': 'የጉዞ ታሪክ',
      'wallet_balance': 'የኪስ ቦርሳ ሂሳብ',
    },
    'or': {
      'welcome': 'Gara Bisklet Baga Nagaan Dhuftan',
      'find_bike': 'Biskileetii Barbaadi',
      'start_ride': 'Imala Jalqabi',
      'end_ride': 'Imala Xumuri',
      'payment_methods': 'Mala Kaffaltii',
      'trip_history': 'Seenaa Imalaa',
      'wallet_balance': 'Baalaansii Korojoo',
    },
  };
  
  static String translate(String key, String languageCode) {
    return _translations[languageCode]?[key] ?? 
           _translations['en']?[key] ?? 
           key;
  }
}
```

### **2. Ethiopian Calendar Integration**
```dart
class EthiopianCalendar {
  static String formatEthiopianDate(DateTime gregorianDate) {
    // Simple conversion (approximate)
    final ethiopianYear = gregorianDate.year - 7;
    final ethiopianMonths = [
      'መስከረም', 'ጥቅምት', 'ህዳር', 'ታህሳስ', 'ጥር', 'የካቲት',
      'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜን'
    ];
    
    final month = ethiopianMonths[gregorianDate.month - 1];
    return '${gregorianDate.day} $month $ethiopianYear';
  }
}
```

---

## ⚠️ **Error Handling**

### **1. Custom Exception Classes**
```dart
class BiskletException implements Exception {
  final String message;
  final String? code;
  final dynamic details;
  
  BiskletException(this.message, {this.code, this.details});
  
  @override
  String toString() => 'BiskletException: $message';
}

class AuthenticationException extends BiskletException {
  AuthenticationException(String message) : super(message, code: 'AUTH_ERROR');
}

class BikeNotAvailableException extends BiskletException {
  BikeNotAvailableException(String bikeId) 
      : super('Bike $bikeId is not available', code: 'BIKE_UNAVAILABLE');
}

class PaymentFailedException extends BiskletException {
  PaymentFailedException(String reason) 
      : super('Payment failed: $reason', code: 'PAYMENT_FAILED');
}
```

### **2. Error Handler Service**
```dart
class ErrorHandlerService {
  static void handleError(dynamic error, {String? context}) {
    String message = 'An unexpected error occurred';
    
    if (error is PostgrestException) {
      message = _handlePostgrestError(error);
    } else if (error is AuthException) {
      message = _handleAuthError(error);
    } else if (error is BiskletException) {
      message = error.message;
    }
    
    // Log error for debugging
    print('Error in $context: $message');
    
    // Show user-friendly message
    _showErrorToUser(message);
  }
  
  static String _handlePostgrestError(PostgrestException error) {
    switch (error.code) {
      case '23505': // Unique violation
        return 'This information is already in use';
      case '23503': // Foreign key violation
        return 'Invalid reference data';
      default:
        return 'Database error occurred';
    }
  }
  
  static String _handleAuthError(AuthException error) {
    switch (error.message) {
      case 'Invalid login credentials':
        return 'Invalid email or password';
      case 'Email not confirmed':
        return 'Please verify your email address';
      default:
        return 'Authentication error';
    }
  }
  
  static void _showErrorToUser(String message) {
    // Implement your preferred error display method
    // (SnackBar, Dialog, Toast, etc.)
  }
}
```

---

## 📱 **Flutter Implementation Examples**

### **1. Main App Structure**
```dart
// lib/main.dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  await Supabase.initialize(
    url: SupabaseService.supabaseUrl,
    anonKey: SupabaseService.supabaseAnonKey,
  );
  
  runApp(BiskletApp());
}

class BiskletApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Bisklet - Ethiopian Bike Share',
      theme: ThemeData(
        primarySwatch: Colors.green,
        fontFamily: 'Inter',
      ),
      home: AuthWrapper(),
      routes: {
        '/login': (context) => LoginScreen(),
        '/home': (context) => HomeScreen(),
        '/map': (context) => MapScreen(),
        '/trip': (context) => TripScreen(),
        '/profile': (context) => ProfileScreen(),
      },
    );
  }
}
```

### **2. Authentication Wrapper**
```dart
// lib/screens/auth_wrapper.dart
class AuthWrapper extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return StreamBuilder<AuthState>(
      stream: SupabaseService.client.auth.onAuthStateChange,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return SplashScreen();
        }
        
        final session = snapshot.data?.session;
        if (session != null) {
          return HomeScreen();
        } else {
          return LoginScreen();
        }
      },
    );
  }
}
```

### **3. Bike Map Screen**
```dart
// lib/screens/map_screen.dart
class MapScreen extends StatefulWidget {
  @override
  _MapScreenState createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  GoogleMapController? _mapController;
  List<Map<String, dynamic>> _bikes = [];
  Position? _currentPosition;
  
  @override
  void initState() {
    super.initState();
    _getCurrentLocation();
    _loadNearbyBikes();
  }
  
  Future<void> _getCurrentLocation() async {
    try {
      _currentPosition = await Geolocator.getCurrentPosition();
      setState(() {});
    } catch (e) {
      ErrorHandlerService.handleError(e, context: 'Getting location');
    }
  }
  
  Future<void> _loadNearbyBikes() async {
    try {
      final bikes = await getAvailableBikes();
      setState(() {
        _bikes = bikes;
      });
    } catch (e) {
      ErrorHandlerService.handleError(e, context: 'Loading bikes');
    }
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Find a Bike'),
        backgroundColor: Colors.green,
      ),
      body: _currentPosition == null
          ? Center(child: CircularProgressIndicator())
          : GoogleMap(
              initialCameraPosition: CameraPosition(
                target: LatLng(
                  _currentPosition!.latitude,
                  _currentPosition!.longitude,
                ),
                zoom: 15,
              ),
              onMapCreated: (controller) => _mapController = controller,
              markers: _buildBikeMarkers(),
              myLocationEnabled: true,
              myLocationButtonEnabled: true,
            ),
    );
  }
  
  Set<Marker> _buildBikeMarkers() {
    return _bikes.map((bike) {
      return Marker(
        markerId: MarkerId(bike['id']),
        position: LatLng(
          bike['latitude'] ?? 9.0054, // Default to Meskel Square
          bike['longitude'] ?? 38.7578,
        ),
        icon: BitmapDescriptor.defaultMarkerWithHue(
          bike['battery_level'] > 50 
              ? BitmapDescriptor.hueGreen 
              : BitmapDescriptor.hueOrange,
        ),
        infoWindow: InfoWindow(
          title: bike['bike_code'],
          snippet: '${bike['battery_level']}% battery',
          onTap: () => _showBikeDetails(bike),
        ),
      );
    }).toSet();
  }
  
  void _showBikeDetails(Map<String, dynamic> bike) {
    showModalBottomSheet(
      context: context,
      builder: (context) => BikeDetailsSheet(bike: bike),
    );
  }
}
```

---

## 🔧 **Required Flutter Packages**

Add these to your `pubspec.yaml`:

```yaml
dependencies:
  flutter:
    sdk: flutter
  
  # Supabase & Authentication
  supabase_flutter: ^2.0.0
  
  # Maps & Location
  google_maps_flutter: ^2.5.0
  geolocator: ^10.1.0
  geocoding: ^2.1.1
  
  # QR Code Scanning
  qr_code_scanner: ^1.0.1
  
  # State Management
  flutter_bloc: ^8.1.3
  
  # UI & Utilities
  cached_network_image: ^3.3.0
  connectivity_plus: ^5.0.2
  permission_handler: ^11.0.1
  
  # Ethiopian Calendar (if needed)
  intl: ^0.18.1
```

---

## 🚀 **Next Steps**

1. **Set up Flutter project** with the packages above
2. **Configure Supabase** with your project credentials
3. **Implement authentication flow** using the examples provided
4. **Build map interface** with real-time bike locations
5. **Add QR code scanning** for bike unlock functionality
6. **Integrate Ethiopian payment methods** (Telebirr, CBE Birr, etc.)
7. **Add multi-language support** for Amharic and Oromo
8. **Test with real data** from your Supabase database

This documentation provides everything needed to build a production-ready Ethiopian bike-sharing mobile app! 🇪🇹🚲