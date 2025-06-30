# Bisklet Mobile App Architecture Design

## 🏗️ **Complete Flutter Architecture for Ethiopian Bike Sharing**

This document outlines the complete mobile app architecture, screen flows, state management, and Ethiopian-specific features for the Bisklet mobile application.

---

## 📋 **Table of Contents**

1. [App Architecture Overview](#app-architecture-overview)
2. [Screen Flow & Navigation](#screen-flow--navigation)
3. [State Management Pattern](#state-management-pattern)
4. [Ethiopian-Specific Features](#ethiopian-specific-features)
5. [Folder Structure](#folder-structure)
6. [Core Services](#core-services)
7. [UI Components](#ui-components)
8. [Data Models](#data-models)
9. [Security & Performance](#security--performance)

---

## 🏛️ **App Architecture Overview**

### **Clean Architecture Pattern**
```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │     Screens     │  │     Widgets     │  │    Bloc/     │ │
│  │   (UI Views)    │  │  (Components)   │  │  Cubit       │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                     DOMAIN LAYER                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   Use Cases     │  │    Entities     │  │ Repositories │ │
│  │  (Business      │  │   (Models)      │  │ (Interfaces) │ │
│  │   Logic)        │  │                 │  │              │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                            │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   Data Sources  │  │   Repository    │  │   External   │ │
│  │   (Supabase,    │  │ Implementation  │  │     APIs     │ │
│  │   Local DB)     │  │                 │  │  (Telebirr)  │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### **Key Architectural Principles**
- **🔄 Reactive Programming**: Using Streams and BLoC pattern
- **🌐 Offline-First**: Local caching with sync capabilities
- **🔒 Security-First**: Secure token management and data encryption
- **🇪🇹 Ethiopian-Centric**: Built for Ethiopian users and payment systems
- **📱 Mobile-Optimized**: Designed for mobile-first experience

---

## 🗺️ **Screen Flow & Navigation**

### **1. Authentication Flow**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Splash Screen │───▶│  Onboarding     │───▶│  Language       │
│                 │    │  (3 screens)    │    │  Selection      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Login Screen  │◀───│  Registration   │◀───│  Phone Number   │
│                 │    │  Screen         │    │  Verification   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │
         ▼
┌─────────────────┐
│   Main App      │
│   (Tab Bar)     │
└─────────────────┘
```

### **2. Main App Navigation (Bottom Tab Bar)**
```
┌─────────────────────────────────────────────────────────────┐
│                     Main App Container                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    Screen Content Area                      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  🏠 Home  │  🗺️ Map  │  🚲 Ride  │  💳 Wallet  │  👤 Profile │
└─────────────────────────────────────────────────────────────┘
```

### **3. Detailed Screen Flows**

#### **Home Tab Flow**
```
Home Screen
├── Quick Actions
│   ├── Find Bike ────────────▶ Map Screen
│   ├── Scan QR Code ─────────▶ QR Scanner ────▶ Bike Details
│   └── Trip History ─────────▶ Trip History Screen
├── Active Trip Card ────────▶ Active Trip Screen
├── Wallet Balance ──────────▶ Wallet Screen
└── Recent Activity ─────────▶ Activity Details
```

#### **Map Tab Flow**
```
Map Screen
├── Bike Markers ───────────▶ Bike Details Modal
│                            ├── Reserve Bike
│                            └── Get Directions
├── Location Search ────────▶ Search Results
├── Filter Options ─────────▶ Filter Modal
└── Current Location ───────▶ Location Services
```

#### **Ride Tab Flow**
```
Ride Screen
├── No Active Ride
│   ├── Scan QR Code ───────▶ QR Scanner
│   └── Find Nearby ───────▶ Map Screen
└── Active Ride
    ├── Trip Timer
    ├── Current Location
    ├── End Ride ──────────▶ Trip Summary
    └── Emergency ─────────▶ Emergency Contact
```

#### **Wallet Tab Flow**
```
Wallet Screen
├── Balance Display
├── Top Up ────────────────▶ Payment Methods
│                           ├── Telebirr ──────▶ Telebirr Flow
│                           ├── CBE Birr ──────▶ Bank Flow
│                           └── Other Banks ───▶ Bank Selection
├── Transaction History ───▶ Transaction Details
└── Payment Methods ───────▶ Manage Payment Methods
```

#### **Profile Tab Flow**
```
Profile Screen
├── User Info ─────────────▶ Edit Profile
├── Subscription ──────────▶ Subscription Management
├── Trip Statistics ───────▶ Detailed Statistics
├── Settings ──────────────▶ Settings Screen
│                           ├── Language ──────▶ Language Selection
│                           ├── Notifications ─▶ Notification Settings
│                           └── Privacy ───────▶ Privacy Settings
├── Help & Support ────────▶ Help Center
└── Logout ────────────────▶ Confirmation Dialog
```

---

## 🔄 **State Management Pattern**

### **BLoC Architecture Implementation**

#### **1. Authentication BLoC**
```dart
// lib/blocs/auth/auth_bloc.dart
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final AuthRepository _authRepository;
  final UserRepository _userRepository;
  
  AuthBloc({
    required AuthRepository authRepository,
    required UserRepository userRepository,
  }) : _authRepository = authRepository,
       _userRepository = userRepository,
       super(AuthInitial()) {
    
    on<AuthStarted>(_onAuthStarted);
    on<AuthLoginRequested>(_onLoginRequested);
    on<AuthRegisterRequested>(_onRegisterRequested);
    on<AuthLogoutRequested>(_onLogoutRequested);
    on<AuthUserChanged>(_onUserChanged);
  }
  
  Future<void> _onAuthStarted(AuthStarted event, Emitter<AuthState> emit) async {
    try {
      final user = await _authRepository.getCurrentUser();
      if (user != null) {
        final userProfile = await _userRepository.getUserProfile(user.id);
        emit(AuthAuthenticated(user: userProfile));
      } else {
        emit(AuthUnauthenticated());
      }
    } catch (e) {
      emit(AuthUnauthenticated());
    }
  }
  
  Future<void> _onLoginRequested(
    AuthLoginRequested event, 
    Emitter<AuthState> emit
  ) async {
    emit(AuthLoading());
    try {
      final user = await _authRepository.signIn(
        email: event.email,
        password: event.password,
      );
      final userProfile = await _userRepository.getUserProfile(user.id);
      emit(AuthAuthenticated(user: userProfile));
    } catch (e) {
      emit(AuthError(message: e.toString()));
    }
  }
}

// States
abstract class AuthState extends Equatable {
  @override
  List<Object?> get props => [];
}

class AuthInitial extends AuthState {}
class AuthLoading extends AuthState {}
class AuthAuthenticated extends AuthState {
  final UserProfile user;
  AuthAuthenticated({required this.user});
  
  @override
  List<Object?> get props => [user];
}
class AuthUnauthenticated extends AuthState {}
class AuthError extends AuthState {
  final String message;
  AuthError({required this.message});
  
  @override
  List<Object?> get props => [message];
}

// Events
abstract class AuthEvent extends Equatable {
  @override
  List<Object?> get props => [];
}

class AuthStarted extends AuthEvent {}
class AuthLoginRequested extends AuthEvent {
  final String email;
  final String password;
  
  AuthLoginRequested({required this.email, required this.password});
  
  @override
  List<Object?> get props => [email, password];
}
```

#### **2. Bike Management BLoC**
```dart
// lib/blocs/bike/bike_bloc.dart
class BikeBloc extends Bloc<BikeEvent, BikeState> {
  final BikeRepository _bikeRepository;
  final LocationRepository _locationRepository;
  StreamSubscription? _bikeSubscription;
  
  BikeBloc({
    required BikeRepository bikeRepository,
    required LocationRepository locationRepository,
  }) : _bikeRepository = bikeRepository,
       _locationRepository = locationRepository,
       super(BikeInitial()) {
    
    on<BikeLoadRequested>(_onLoadRequested);
    on<BikeNearbyRequested>(_onNearbyRequested);
    on<BikeDetailsRequested>(_onDetailsRequested);
    on<BikeReserveRequested>(_onReserveRequested);
    on<BikeUpdated>(_onBikeUpdated);
  }
  
  Future<void> _onLoadRequested(
    BikeLoadRequested event, 
    Emitter<BikeState> emit
  ) async {
    emit(BikeLoading());
    try {
      // Start real-time subscription
      _bikeSubscription?.cancel();
      _bikeSubscription = _bikeRepository.watchAvailableBikes().listen(
        (bikes) => add(BikeUpdated(bikes: bikes)),
      );
      
      final bikes = await _bikeRepository.getAvailableBikes();
      emit(BikeLoaded(bikes: bikes));
    } catch (e) {
      emit(BikeError(message: e.toString()));
    }
  }
  
  Future<void> _onNearbyRequested(
    BikeNearbyRequested event, 
    Emitter<BikeState> emit
  ) async {
    try {
      final bikes = await _bikeRepository.getBikesNearLocation(
        latitude: event.latitude,
        longitude: event.longitude,
        radiusKm: event.radiusKm,
      );
      emit(BikeLoaded(bikes: bikes));
    } catch (e) {
      emit(BikeError(message: e.toString()));
    }
  }
  
  @override
  Future<void> close() {
    _bikeSubscription?.cancel();
    return super.close();
  }
}
```

#### **3. Trip Management BLoC**
```dart
// lib/blocs/trip/trip_bloc.dart
class TripBloc extends Bloc<TripEvent, TripState> {
  final TripRepository _tripRepository;
  final PaymentRepository _paymentRepository;
  Timer? _tripTimer;
  
  TripBloc({
    required TripRepository tripRepository,
    required PaymentRepository paymentRepository,
  }) : _tripRepository = tripRepository,
       _paymentRepository = paymentRepository,
       super(TripInitial()) {
    
    on<TripStartRequested>(_onStartRequested);
    on<TripEndRequested>(_onEndRequested);
    on<TripTimerTick>(_onTimerTick);
    on<TripLoadActive>(_onLoadActive);
  }
  
  Future<void> _onStartRequested(
    TripStartRequested event, 
    Emitter<TripState> emit
  ) async {
    emit(TripStarting());
    try {
      final trip = await _tripRepository.startTrip(
        bikeId: event.bikeId,
        startLatitude: event.startLatitude,
        startLongitude: event.startLongitude,
        startLocationName: event.startLocationName,
      );
      
      // Start trip timer
      _startTripTimer();
      
      emit(TripActive(
        trip: trip,
        elapsedTime: Duration.zero,
      ));
    } catch (e) {
      emit(TripError(message: e.toString()));
    }
  }
  
  void _startTripTimer() {
    _tripTimer?.cancel();
    _tripTimer = Timer.periodic(Duration(seconds: 1), (timer) {
      if (state is TripActive) {
        final currentState = state as TripActive;
        add(TripTimerTick(
          elapsedTime: currentState.elapsedTime + Duration(seconds: 1),
        ));
      }
    });
  }
  
  @override
  Future<void> close() {
    _tripTimer?.cancel();
    return super.close();
  }
}
```

---

## 🇪🇹 **Ethiopian-Specific Features**

### **1. Multi-Language Support**
```dart
// lib/l10n/app_localizations.dart
class AppLocalizations {
  static const LocalizationsDelegate<AppLocalizations> delegate = 
      _AppLocalizationsDelegate();
  
  static const List<Locale> supportedLocales = [
    Locale('en', 'US'), // English
    Locale('am', 'ET'), // Amharic
    Locale('or', 'ET'), // Oromo
  ];
  
  final Locale locale;
  AppLocalizations(this.locale);
  
  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations)!;
  }
  
  // Common translations
  String get appName => _localizedValues[locale.languageCode]!['app_name']!;
  String get welcome => _localizedValues[locale.languageCode]!['welcome']!;
  String get findBike => _localizedValues[locale.languageCode]!['find_bike']!;
  String get startRide => _localizedValues[locale.languageCode]!['start_ride']!;
  String get endRide => _localizedValues[locale.languageCode]!['end_ride']!;
  String get walletBalance => _localizedValues[locale.languageCode]!['wallet_balance']!;
  
  static const Map<String, Map<String, String>> _localizedValues = {
    'en': {
      'app_name': 'Bisklet',
      'welcome': 'Welcome to Bisklet',
      'find_bike': 'Find a Bike',
      'start_ride': 'Start Ride',
      'end_ride': 'End Ride',
      'wallet_balance': 'Wallet Balance',
      'payment_methods': 'Payment Methods',
      'trip_history': 'Trip History',
      'telebirr': 'Telebirr',
      'cbe_birr': 'CBE Birr',
      'meskel_square': 'Meskel Square',
      'bole_airport': 'Bole Airport',
    },
    'am': {
      'app_name': 'ቢስክሌት',
      'welcome': 'ወደ ቢስክሌት እንኳን ደህና መጡ',
      'find_bike': 'ብስክሌት ፈልግ',
      'start_ride': 'ጉዞ ጀምር',
      'end_ride': 'ጉዞ አጠናቅቅ',
      'wallet_balance': 'የኪስ ቦርሳ ሂሳብ',
      'payment_methods': 'የክፍያ ዘዴዎች',
      'trip_history': 'የጉዞ ታሪክ',
      'telebirr': 'ቴሌብር',
      'cbe_birr': 'ሲቢኢ ብር',
      'meskel_square': 'መስቀል አደባባይ',
      'bole_airport': 'ቦሌ አየር ማረፊያ',
    },
    'or': {
      'app_name': 'Biskileet',
      'welcome': 'Gara Biskileet Baga Nagaan Dhuftan',
      'find_bike': 'Biskileetii Barbaadi',
      'start_ride': 'Imala Jalqabi',
      'end_ride': 'Imala Xumuri',
      'wallet_balance': 'Baalaansii Korojoo',
      'payment_methods': 'Mala Kaffaltii',
      'trip_history': 'Seenaa Imalaa',
      'telebirr': 'Telebirr',
      'cbe_birr': 'CBE Birr',
      'meskel_square': 'Oromtii Masqalaa',
      'bole_airport': 'Buufata Xayyaaraatii Boolee',
    },
  };
}
```

### **2. Ethiopian Payment Integration**
```dart
// lib/services/payment/ethiopian_payment_service.dart
class EthiopianPaymentService {
  static const Map<PaymentMethod, PaymentProvider> _providers = {
    PaymentMethod.telebirr: TelebirrProvider(),
    PaymentMethod.cbeBirr: CBEBirrProvider(),
    PaymentMethod.dashenBank: DashenBankProvider(),
    PaymentMethod.awashBank: AwashBankProvider(),
  };
  
  Future<PaymentResult> processPayment({
    required PaymentMethod method,
    required double amount,
    required String phoneNumber,
    Map<String, dynamic>? metadata,
  }) async {
    final provider = _providers[method];
    if (provider == null) {
      throw UnsupportedPaymentMethodException(method);
    }
    
    return await provider.processPayment(
      amount: amount,
      phoneNumber: phoneNumber,
      metadata: metadata,
    );
  }
}

// Telebirr Integration
class TelebirrProvider implements PaymentProvider {
  @override
  Future<PaymentResult> processPayment({
    required double amount,
    required String phoneNumber,
    Map<String, dynamic>? metadata,
  }) async {
    try {
      // Integrate with Telebirr API
      final response = await _callTelebirrAPI(
        amount: amount,
        phoneNumber: phoneNumber,
      );
      
      return PaymentResult.success(
        transactionId: response['transaction_id'],
        reference: response['reference'],
      );
    } catch (e) {
      return PaymentResult.failure(
        error: e.toString(),
      );
    }
  }
  
  Future<Map<String, dynamic>> _callTelebirrAPI({
    required double amount,
    required String phoneNumber,
  }) async {
    // Implementation for Telebirr API integration
    // This would include proper authentication, encryption, etc.
    throw UnimplementedError('Telebirr API integration pending');
  }
}
```

### **3. Ethiopian Calendar Integration**
```dart
// lib/utils/ethiopian_calendar.dart
class EthiopianCalendar {
  static const List<String> _monthNames = [
    'መስከረም', 'ጥቅምት', 'ህዳር', 'ታህሳስ', 'ጥር', 'የካቲት',
    'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜን'
  ];
  
  static const List<String> _dayNames = [
    'እሑድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ'
  ];
  
  static EthiopianDate fromGregorian(DateTime gregorianDate) {
    // Simplified conversion algorithm
    // In production, use a proper Ethiopian calendar library
    final year = gregorianDate.year - 7;
    final month = gregorianDate.month;
    final day = gregorianDate.day;
    
    return EthiopianDate(
      year: year,
      month: month,
      day: day,
      monthName: _monthNames[month - 1],
      dayName: _dayNames[gregorianDate.weekday % 7],
    );
  }
  
  static String formatEthiopianDate(DateTime gregorianDate) {
    final ethDate = fromGregorian(gregorianDate);
    return '${ethDate.day} ${ethDate.monthName} ${ethDate.year}';
  }
}

class EthiopianDate {
  final int year;
  final int month;
  final int day;
  final String monthName;
  final String dayName;
  
  EthiopianDate({
    required this.year,
    required this.month,
    required this.day,
    required this.monthName,
    required this.dayName,
  });
}
```

### **4. Ethiopian Location Services**
```dart
// lib/services/location/ethiopian_location_service.dart
class EthiopianLocationService {
  static const List<EthiopianLocation> popularLocations = [
    EthiopianLocation(
      id: 'meskel_square',
      name: 'Meskel Square',
      nameAmharic: 'መስቀል አደባባይ',
      nameOromo: 'Oromtii Masqalaa',
      district: 'Addis Ketema',
      districtAmharic: 'አዲስ ከተማ',
      latitude: 9.0054,
      longitude: 38.7578,
      isPopular: true,
    ),
    EthiopianLocation(
      id: 'bole_airport',
      name: 'Bole International Airport',
      nameAmharic: 'ቦሌ አለም አቀፍ አየር ማረፊያ',
      nameOromo: 'Buufata Xayyaaraatii Boolee',
      district: 'Bole',
      districtAmharic: 'ቦሌ',
      latitude: 8.9806,
      longitude: 38.7992,
      isPopular: true,
    ),
    // Add more locations...
  ];
  
  static List<EthiopianLocation> searchLocations(String query, String language) {
    return popularLocations.where((location) {
      switch (language) {
        case 'am':
          return location.nameAmharic.contains(query) ||
                 location.districtAmharic?.contains(query) == true;
        case 'or':
          return location.nameOromo?.contains(query) == true;
        default:
          return location.name.toLowerCase().contains(query.toLowerCase()) ||
                 location.district.toLowerCase().contains(query.toLowerCase());
      }
    }).toList();
  }
}

class EthiopianLocation {
  final String id;
  final String name;
  final String nameAmharic;
  final String? nameOromo;
  final String district;
  final String? districtAmharic;
  final double latitude;
  final double longitude;
  final bool isPopular;
  
  const EthiopianLocation({
    required this.id,
    required this.name,
    required this.nameAmharic,
    this.nameOromo,
    required this.district,
    this.districtAmharic,
    required this.latitude,
    required this.longitude,
    required this.isPopular,
  });
}
```

---

## 📁 **Folder Structure**

```
lib/
├── main.dart
├── app/
│   ├── app.dart
│   ├── routes/
│   │   ├── app_router.dart
│   │   └── route_names.dart
│   └── themes/
│       ├── app_theme.dart
│       ├── colors.dart
│       └── text_styles.dart
├── core/
│   ├── constants/
│   │   ├── api_constants.dart
│   │   ├── app_constants.dart
│   │   └── storage_keys.dart
│   ├── errors/
│   │   ├── exceptions.dart
│   │   ├── failures.dart
│   │   └── error_handler.dart
│   ├── network/
│   │   ├── network_info.dart
│   │   └── api_client.dart
│   ├── utils/
│   │   ├── validators.dart
│   │   ├── formatters.dart
│   │   ├── ethiopian_calendar.dart
│   │   └── location_utils.dart
│   └── services/
│       ├── dependency_injection.dart
│       ├── local_storage_service.dart
│       └── notification_service.dart
├── features/
│   ├── authentication/
│   │   ├── data/
│   │   │   ├── datasources/
│   │   │   │   ├── auth_remote_datasource.dart
│   │   │   │   └── auth_local_datasource.dart
│   │   │   ├── models/
│   │   │   │   ├── user_model.dart
│   │   │   │   └── auth_response_model.dart
│   │   │   └── repositories/
│   │   │       └── auth_repository_impl.dart
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── user.dart
│   │   │   ├── repositories/
│   │   │   │   └── auth_repository.dart
│   │   │   └── usecases/
│   │   │       ├── login_user.dart
│   │   │       ├── register_user.dart
│   │   │       └── logout_user.dart
│   │   └── presentation/
│   │       ├── blocs/
│   │       │   ├── auth_bloc.dart
│   │       │   ├── auth_event.dart
│   │       │   └── auth_state.dart
│   │       ├── pages/
│   │       │   ├── login_page.dart
│   │       │   ├── register_page.dart
│   │       │   ├── onboarding_page.dart
│   │       │   └── language_selection_page.dart
│   │       └── widgets/
│   │           ├── login_form.dart
│   │           ├── register_form.dart
│   │           └── language_selector.dart
│   ├── bikes/
│   │   ├── data/
│   │   │   ├── datasources/
│   │   │   │   ├── bike_remote_datasource.dart
│   │   │   │   └── bike_local_datasource.dart
│   │   │   ├── models/
│   │   │   │   └── bike_model.dart
│   │   │   └── repositories/
│   │   │       └── bike_repository_impl.dart
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── bike.dart
│   │   │   ├── repositories/
│   │   │   │   └── bike_repository.dart
│   │   │   └── usecases/
│   │   │       ├── get_available_bikes.dart
│   │   │       ├── get_bikes_nearby.dart
│   │   │       └── get_bike_details.dart
│   │   └── presentation/
│   │       ├── blocs/
│   │       │   ├── bike_bloc.dart
│   │       │   ├── bike_event.dart
│   │       │   └── bike_state.dart
│   │       ├── pages/
│   │       │   ├── bike_map_page.dart
│   │       │   ├── bike_details_page.dart
│   │       │   └── qr_scanner_page.dart
│   │       └── widgets/
│   │           ├── bike_marker.dart
│   │           ├── bike_card.dart
│   │           ├── bike_filter.dart
│   │           └── qr_scanner_widget.dart
│   ├── trips/
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   ├── payments/
│   │   ├── data/
│   │   │   ├── datasources/
│   │   │   │   ├── payment_remote_datasource.dart
│   │   │   │   ├── telebirr_datasource.dart
│   │   │   │   ├── cbe_birr_datasource.dart
│   │   │   │   └── bank_datasource.dart
│   │   │   ├── models/
│   │   │   │   ├── payment_model.dart
│   │   │   │   └── payment_method_model.dart
│   │   │   └── repositories/
│   │   │       └── payment_repository_impl.dart
│   │   ├── domain/
│   │   └── presentation/
│   ├── wallet/
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   └── profile/
│       ├── data/
│       ├── domain/
│       └── presentation/
├── l10n/
│   ├── app_localizations.dart
│   ├── app_localizations_en.dart
│   ├── app_localizations_am.dart
│   └── app_localizations_or.dart
└── shared/
    ├── widgets/
    │   ├── custom_button.dart
    │   ├── custom_text_field.dart
    │   ├── loading_widget.dart
    │   ├── error_widget.dart
    │   ├── ethiopian_flag_widget.dart
    │   └── currency_display.dart
    ├── models/
    │   ├── api_response.dart
    │   └── ethiopian_location.dart
    └── extensions/
        ├── string_extensions.dart
        ├── datetime_extensions.dart
        └── context_extensions.dart
```

---

## 🔧 **Core Services**

### **1. Dependency Injection Setup**
```dart
// lib/core/services/dependency_injection.dart
final GetIt getIt = GetIt.instance;

Future<void> setupDependencyInjection() async {
  // External dependencies
  getIt.registerLazySingleton<SupabaseClient>(() => Supabase.instance.client);
  getIt.registerLazySingleton<SharedPreferences>(() => SharedPreferences.getInstance());
  
  // Core services
  getIt.registerLazySingleton<NetworkInfo>(() => NetworkInfoImpl());
  getIt.registerLazySingleton<LocalStorageService>(() => LocalStorageServiceImpl());
  getIt.registerLazySingleton<NotificationService>(() => NotificationServiceImpl());
  
  // Data sources
  getIt.registerLazySingleton<AuthRemoteDataSource>(
    () => AuthRemoteDataSourceImpl(client: getIt()),
  );
  getIt.registerLazySingleton<BikeRemoteDataSource>(
    () => BikeRemoteDataSourceImpl(client: getIt()),
  );
  
  // Repositories
  getIt.registerLazySingleton<AuthRepository>(
    () => AuthRepositoryImpl(
      remoteDataSource: getIt(),
      localDataSource: getIt(),
      networkInfo: getIt(),
    ),
  );
  
  // Use cases
  getIt.registerLazySingleton(() => LoginUser(getIt()));
  getIt.registerLazySingleton(() => RegisterUser(getIt()));
  getIt.registerLazySingleton(() => GetAvailableBikes(getIt()));
  
  // BLoCs
  getIt.registerFactory(() => AuthBloc(
    authRepository: getIt(),
    userRepository: getIt(),
  ));
  getIt.registerFactory(() => BikeBloc(
    bikeRepository: getIt(),
    locationRepository: getIt(),
  ));
}
```

### **2. Local Storage Service**
```dart
// lib/core/services/local_storage_service.dart
abstract class LocalStorageService {
  Future<void> setString(String key, String value);
  Future<String?> getString(String key);
  Future<void> setBool(String key, bool value);
  Future<bool?> getBool(String key);
  Future<void> setObject<T>(String key, T object);
  Future<T?> getObject<T>(String key, T Function(Map<String, dynamic>) fromJson);
  Future<void> remove(String key);
  Future<void> clear();
}

class LocalStorageServiceImpl implements LocalStorageService {
  final SharedPreferences _prefs;
  
  LocalStorageServiceImpl(this._prefs);
  
  @override
  Future<void> setString(String key, String value) async {
    await _prefs.setString(key, value);
  }
  
  @override
  Future<String?> getString(String key) async {
    return _prefs.getString(key);
  }
  
  @override
  Future<void> setObject<T>(String key, T object) async {
    final jsonString = jsonEncode(object);
    await setString(key, jsonString);
  }
  
  @override
  Future<T?> getObject<T>(String key, T Function(Map<String, dynamic>) fromJson) async {
    final jsonString = await getString(key);
    if (jsonString == null) return null;
    
    try {
      final jsonMap = jsonDecode(jsonString) as Map<String, dynamic>;
      return fromJson(jsonMap);
    } catch (e) {
      return null;
    }
  }
}
```

### **3. Notification Service**
```dart
// lib/core/services/notification_service.dart
class NotificationService {
  static final FlutterLocalNotificationsPlugin _notifications = 
      FlutterLocalNotificationsPlugin();
  
  static Future<void> initialize() async {
    const androidSettings = AndroidInitializationSettings('@mipmap/ic_launcher');
    const iosSettings = DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
    );
    
    const settings = InitializationSettings(
      android: androidSettings,
      iOS: iosSettings,
    );
    
    await _notifications.initialize(settings);
  }
  
  static Future<void> showTripNotification({
    required String title,
    required String body,
    String? payload,
  }) async {
    const androidDetails = AndroidNotificationDetails(
      'trip_channel',
      'Trip Notifications',
      channelDescription: 'Notifications for active trips',
      importance: Importance.high,
      priority: Priority.high,
      icon: '@mipmap/ic_launcher',
    );
    
    const iosDetails = DarwinNotificationDetails(
      presentAlert: true,
      presentBadge: true,
      presentSound: true,
    );
    
    const details = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );
    
    await _notifications.show(
      DateTime.now().millisecondsSinceEpoch.remainder(100000),
      title,
      body,
      details,
      payload: payload,
    );
  }
}
```

---

## 🎨 **UI Components**

### **1. Custom Button Component**
```dart
// lib/shared/widgets/custom_button.dart
class CustomButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final ButtonType type;
  final ButtonSize size;
  final bool isLoading;
  final Widget? icon;
  
  const CustomButton({
    Key? key,
    required this.text,
    this.onPressed,
    this.type = ButtonType.primary,
    this.size = ButtonSize.medium,
    this.isLoading = false,
    this.icon,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colors = _getColors(theme);
    final dimensions = _getDimensions();
    
    return SizedBox(
      height: dimensions.height,
      child: ElevatedButton(
        onPressed: isLoading ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: colors.background,
          foregroundColor: colors.foreground,
          elevation: type == ButtonType.primary ? 2 : 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
            side: type == ButtonType.outline 
                ? BorderSide(color: colors.border!) 
                : BorderSide.none,
          ),
          padding: EdgeInsets.symmetric(
            horizontal: dimensions.horizontalPadding,
            vertical: dimensions.verticalPadding,
          ),
        ),
        child: isLoading
            ? SizedBox(
                height: 20,
                width: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  valueColor: AlwaysStoppedAnimation(colors.foreground),
                ),
              )
            : Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (icon != null) ...[
                    icon!,
                    SizedBox(width: 8),
                  ],
                  Text(
                    text,
                    style: TextStyle(
                      fontSize: dimensions.fontSize,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
      ),
    );
  }
  
  _ButtonColors _getColors(ThemeData theme) {
    switch (type) {
      case ButtonType.primary:
        return _ButtonColors(
          background: theme.primaryColor,
          foreground: Colors.white,
        );
      case ButtonType.secondary:
        return _ButtonColors(
          background: theme.colorScheme.secondary,
          foreground: Colors.white,
        );
      case ButtonType.outline:
        return _ButtonColors(
          background: Colors.transparent,
          foreground: theme.primaryColor,
          border: theme.primaryColor,
        );
      case ButtonType.text:
        return _ButtonColors(
          background: Colors.transparent,
          foreground: theme.primaryColor,
        );
    }
  }
  
  _ButtonDimensions _getDimensions() {
    switch (size) {
      case ButtonSize.small:
        return _ButtonDimensions(
          height: 36,
          horizontalPadding: 16,
          verticalPadding: 8,
          fontSize: 14,
        );
      case ButtonSize.medium:
        return _ButtonDimensions(
          height: 48,
          horizontalPadding: 24,
          verticalPadding: 12,
          fontSize: 16,
        );
      case ButtonSize.large:
        return _ButtonDimensions(
          height: 56,
          horizontalPadding: 32,
          verticalPadding: 16,
          fontSize: 18,
        );
    }
  }
}

enum ButtonType { primary, secondary, outline, text }
enum ButtonSize { small, medium, large }

class _ButtonColors {
  final Color background;
  final Color foreground;
  final Color? border;
  
  _ButtonColors({
    required this.background,
    required this.foreground,
    this.border,
  });
}

class _ButtonDimensions {
  final double height;
  final double horizontalPadding;
  final double verticalPadding;
  final double fontSize;
  
  _ButtonDimensions({
    required this.height,
    required this.horizontalPadding,
    required this.verticalPadding,
    required this.fontSize,
  });
}
```

### **2. Ethiopian Currency Display**
```dart
// lib/shared/widgets/currency_display.dart
class CurrencyDisplay extends StatelessWidget {
  final double amount;
  final CurrencyDisplayStyle style;
  final bool showSymbol;
  final String? language;
  
  const CurrencyDisplay({
    Key? key,
    required this.amount,
    this.style = CurrencyDisplayStyle.normal,
    this.showSymbol = true,
    this.language,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    final locale = language ?? Localizations.localeOf(context).languageCode;
    final formattedAmount = _formatAmount(amount, locale);
    final symbol = _getCurrencySymbol(locale);
    
    return Text(
      showSymbol ? '$symbol $formattedAmount' : formattedAmount,
      style: _getTextStyle(context),
    );
  }
  
  String _formatAmount(double amount, String locale) {
    final formatter = NumberFormat.currency(
      locale: locale == 'am' ? 'am_ET' : 'en_ET',
      symbol: '',
      decimalDigits: 2,
    );
    return formatter.format(amount);
  }
  
  String _getCurrencySymbol(String locale) {
    switch (locale) {
      case 'am':
        return 'ብር';
      case 'or':
        return 'Birr';
      default:
        return 'ETB';
    }
  }
  
  TextStyle _getTextStyle(BuildContext context) {
    final theme = Theme.of(context);
    switch (style) {
      case CurrencyDisplayStyle.large:
        return theme.textTheme.headlineMedium!.copyWith(
          fontWeight: FontWeight.bold,
          color: theme.primaryColor,
        );
      case CurrencyDisplayStyle.medium:
        return theme.textTheme.titleLarge!.copyWith(
          fontWeight: FontWeight.w600,
        );
      case CurrencyDisplayStyle.small:
        return theme.textTheme.bodyMedium!;
      case CurrencyDisplayStyle.normal:
      default:
        return theme.textTheme.bodyLarge!.copyWith(
          fontWeight: FontWeight.w500,
        );
    }
  }
}

enum CurrencyDisplayStyle { small, normal, medium, large }
```

---

## 📊 **Data Models**

### **1. User Model**
```dart
// lib/features/authentication/data/models/user_model.dart
class UserModel extends User {
  const UserModel({
    required String id,
    required String email,
    required String phone,
    required String fullName,
    String? fullNameAmharic,
    String? fullNameOromo,
    required bool verified,
    required double walletBalance,
    required int totalRides,
    required String preferredLanguage,
    required String status,
    required String userRole,
    required String subscriptionType,
    DateTime? subscriptionExpiresAt,
    String? organizationId,
    String? studentId,
    String? employeeId,
    List<String>? permissions,
    Map<String, dynamic>? emergencyContact,
    required DateTime createdAt,
    required DateTime lastActive,
  }) : super(
    id: id,
    email: email,
    phone: phone,
    fullName: fullName,
    fullNameAmharic: fullNameAmharic,
    fullNameOromo: fullNameOromo,
    verified: verified,
    walletBalance: walletBalance,
    totalRides: totalRides,
    preferredLanguage: preferredLanguage,
    status: status,
    userRole: userRole,
    subscriptionType: subscriptionType,
    subscriptionExpiresAt: subscriptionExpiresAt,
    organizationId: organizationId,
    studentId: studentId,
    employeeId: employeeId,
    permissions: permissions,
    emergencyContact: emergencyContact,
    createdAt: createdAt,
    lastActive: lastActive,
  );
  
  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'],
      email: json['email'],
      phone: json['phone'],
      fullName: json['full_name'],
      fullNameAmharic: json['full_name_amharic'],
      fullNameOromo: json['full_name_oromo'],
      verified: json['verified'] ?? false,
      walletBalance: (json['wallet_balance'] ?? 0.0).toDouble(),
      totalRides: json['total_rides'] ?? 0,
      preferredLanguage: json['preferred_language'] ?? 'en',
      status: json['status'] ?? 'pending',
      userRole: json['user_role'] ?? 'customer',
      subscriptionType: json['subscription_type'] ?? 'pay_per_ride',
      subscriptionExpiresAt: json['subscription_expires_at'] != null
          ? DateTime.parse(json['subscription_expires_at'])
          : null,
      organizationId: json['organization_id'],
      studentId: json['student_id'],
      employeeId: json['employee_id'],
      permissions: json['permissions'] != null
          ? List<String>.from(json['permissions'])
          : null,
      emergencyContact: json['emergency_contact'],
      createdAt: DateTime.parse(json['created_at']),
      lastActive: DateTime.parse(json['last_active']),
    );
  }
  
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'phone': phone,
      'full_name': fullName,
      'full_name_amharic': fullNameAmharic,
      'full_name_oromo': fullNameOromo,
      'verified': verified,
      'wallet_balance': walletBalance,
      'total_rides': totalRides,
      'preferred_language': preferredLanguage,
      'status': status,
      'user_role': userRole,
      'subscription_type': subscriptionType,
      'subscription_expires_at': subscriptionExpiresAt?.toIso8601String(),
      'organization_id': organizationId,
      'student_id': studentId,
      'employee_id': employeeId,
      'permissions': permissions,
      'emergency_contact': emergencyContact,
      'created_at': createdAt.toIso8601String(),
      'last_active': lastActive.toIso8601String(),
    };
  }
}
```

### **2. Bike Model**
```dart
// lib/features/bikes/data/models/bike_model.dart
class BikeModel extends Bike {
  const BikeModel({
    required String id,
    required String bikeCode,
    required String qrCode,
    required String model,
    double? latitude,
    double? longitude,
    String? currentLocationName,
    String? currentLocationAmharic,
    required int batteryLevel,
    required BikeStatus status,
    DateTime? lastMaintenance,
    required int totalRides,
    required double totalDistanceKm,
    required DateTime createdAt,
    required DateTime updatedAt,
  }) : super(
    id: id,
    bikeCode: bikeCode,
    qrCode: qrCode,
    model: model,
    latitude: latitude,
    longitude: longitude,
    currentLocationName: currentLocationName,
    currentLocationAmharic: currentLocationAmharic,
    batteryLevel: batteryLevel,
    status: status,
    lastMaintenance: lastMaintenance,
    totalRides: totalRides,
    totalDistanceKm: totalDistanceKm,
    createdAt: createdAt,
    updatedAt: updatedAt,
  );
  
  factory BikeModel.fromJson(Map<String, dynamic> json) {
    return BikeModel(
      id: json['id'],
      bikeCode: json['bike_code'],
      qrCode: json['qr_code'],
      model: json['model'],
      latitude: json['latitude']?.toDouble(),
      longitude: json['longitude']?.toDouble(),
      currentLocationName: json['current_location_name'],
      currentLocationAmharic: json['current_location_amharic'],
      batteryLevel: json['battery_level'] ?? 0,
      status: BikeStatus.values.firstWhere(
        (status) => status.name == json['status'],
        orElse: () => BikeStatus.unavailable,
      ),
      lastMaintenance: json['last_maintenance'] != null
          ? DateTime.parse(json['last_maintenance'])
          : null,
      totalRides: json['total_rides'] ?? 0,
      totalDistanceKm: (json['total_distance_km'] ?? 0.0).toDouble(),
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }
}

enum BikeStatus { available, inUse, maintenance, unavailable }
```

---

## 🔒 **Security & Performance**

### **1. Security Best Practices**
```dart
// lib/core/security/security_service.dart
class SecurityService {
  static const String _keyAlias = 'bisklet_secure_key';
  
  // Encrypt sensitive data before storing locally
  static Future<String> encryptData(String data) async {
    final key = await _getOrCreateKey();
    final encrypter = Encrypter(AES(key));
    final iv = IV.fromSecureRandom(16);
    final encrypted = encrypter.encrypt(data, iv: iv);
    return '${iv.base64}:${encrypted.base64}';
  }
  
  static Future<String> decryptData(String encryptedData) async {
    final parts = encryptedData.split(':');
    if (parts.length != 2) throw Exception('Invalid encrypted data format');
    
    final key = await _getOrCreateKey();
    final encrypter = Encrypter(AES(key));
    final iv = IV.fromBase64(parts[0]);
    final encrypted = Encrypted.fromBase64(parts[1]);
    
    return encrypter.decrypt(encrypted, iv: iv);
  }
  
  static Future<Key> _getOrCreateKey() async {
    // In production, use Android Keystore / iOS Keychain
    // This is a simplified implementation
    final prefs = await SharedPreferences.getInstance();
    String? keyString = prefs.getString(_keyAlias);
    
    if (keyString == null) {
      final key = Key.fromSecureRandom(32);
      await prefs.setString(_keyAlias, key.base64);
      return key;
    }
    
    return Key.fromBase64(keyString);
  }
  
  // Validate Ethiopian phone numbers
  static bool isValidEthiopianPhone(String phone) {
    final regex = RegExp(r'^\+251[0-9]{9}$');
    return regex.hasMatch(phone);
  }
  
  // Sanitize user input
  static String sanitizeInput(String input) {
    return input.trim().replaceAll(RegExp(r'[<>"\']'), '');
  }
}
```

### **2. Performance Optimization**
```dart
// lib/core/performance/performance_service.dart
class PerformanceService {
  static final Map<String, dynamic> _cache = {};
  static const Duration _cacheExpiry = Duration(minutes: 5);
  static final Map<String, DateTime> _cacheTimestamps = {};
  
  // Cache frequently accessed data
  static void cacheData(String key, dynamic data) {
    _cache[key] = data;
    _cacheTimestamps[key] = DateTime.now();
  }
  
  static T? getCachedData<T>(String key) {
    final timestamp = _cacheTimestamps[key];
    if (timestamp == null) return null;
    
    if (DateTime.now().difference(timestamp) > _cacheExpiry) {
      _cache.remove(key);
      _cacheTimestamps.remove(key);
      return null;
    }
    
    return _cache[key] as T?;
  }
  
  // Debounce search queries
  static Timer? _searchTimer;
  static void debounceSearch(String query, Function(String) onSearch) {
    _searchTimer?.cancel();
    _searchTimer = Timer(Duration(milliseconds: 300), () {
      onSearch(query);
    });
  }
  
  // Optimize image loading
  static Widget optimizedImage(String url, {double? width, double? height}) {
    return CachedNetworkImage(
      imageUrl: url,
      width: width,
      height: height,
      fit: BoxFit.cover,
      placeholder: (context, url) => Container(
        width: width,
        height: height,
        color: Colors.grey[300],
        child: Center(child: CircularProgressIndicator()),
      ),
      errorWidget: (context, url, error) => Container(
        width: width,
        height: height,
        color: Colors.grey[300],
        child: Icon(Icons.error),
      ),
      memCacheWidth: width?.toInt(),
      memCacheHeight: height?.toInt(),
    );
  }
}
```

---

## 🚀 **Next Steps for Implementation**

### **Phase 1: Foundation (Week 1-2)**
1. ✅ Set up Flutter project with folder structure
2. ✅ Configure Supabase integration
3. ✅ Implement dependency injection
4. ✅ Set up BLoC state management
5. ✅ Create core services and utilities

### **Phase 2: Authentication (Week 3)**
1. ✅ Build onboarding screens
2. ✅ Implement login/registration
3. ✅ Add phone number verification
4. ✅ Set up multi-language support

### **Phase 3: Core Features (Week 4-5)**
1. ✅ Build bike map with real-time updates
2. ✅ Implement QR code scanning
3. ✅ Create trip management system
4. ✅ Add basic payment integration

### **Phase 4: Ethiopian Integration (Week 6)**
1. ✅ Integrate Telebirr payment
2. ✅ Add CBE Birr support
3. ✅ Implement Ethiopian calendar
4. ✅ Add Amharic/Oromo translations

### **Phase 5: Polish & Testing (Week 7-8)**
1. ✅ Performance optimization
2. ✅ Security hardening
3. ✅ Comprehensive testing
4. ✅ App store preparation

This architecture provides a solid foundation for building a world-class Ethiopian bike-sharing mobile app! 🇪🇹📱🚲