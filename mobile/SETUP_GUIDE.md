# Bisklet Mobile App - Android Studio Cloud Setup Guide

## 🚀 Getting Started with Android Studio Cloud

### Prerequisites
- Android Studio Cloud account
- Node.js 16+ installed
- React Native CLI

### 1. Project Structure
Your mobile app is located in the `/mobile` directory with the following structure:

```
mobile/
├── src/
│   ├── components/          # Reusable UI components
│   ├── contexts/           # React contexts (Auth, Language, Location)
│   ├── navigation/         # Navigation setup
│   ├── screens/           # App screens
│   │   ├── auth/          # Authentication screens
│   │   └── main/          # Main app screens
│   ├── services/          # API and external services
│   ├── theme/             # Colors, typography, spacing
│   └── i18n/              # Multi-language support
├── android/               # Android-specific files
├── ios/                   # iOS-specific files (if needed)
├── package.json           # Dependencies
└── README.md             # Detailed documentation
```

### 2. Key Features Already Implemented

#### 🔐 Authentication System
- Multi-language onboarding (English, Amharic, Oromo)
- Email/password authentication with Supabase
- Phone number verification
- User profile management

#### 🗺️ Map & Location Services
- Real-time bike location tracking
- Interactive map with Ethiopian landmarks
- Location search with Amharic/Oromo support
- GPS-based bike finding

#### 🚲 Bike Management
- QR code scanning for bike unlock
- Real-time bike availability
- Battery level monitoring
- Bike reservation system

#### 💳 Ethiopian Payment Integration
- **Telebirr** - Ethiopia's leading mobile payment
- **CBE Birr** - Commercial Bank of Ethiopia
- **Dashen Bank** - Digital banking services
- **Awash Bank** - Mobile banking
- Wallet system with ETB currency

#### 🌍 Ethiopian Localization
- **English** - International users
- **Amharic (አማርኛ)** - Primary Ethiopian language
- **Oromo (Afaan Oromoo)** - Largest ethnic group language
- Ethiopian calendar integration
- Local currency (ETB) formatting

### 3. Android Studio Cloud Setup Steps

#### Step 1: Import Project
1. Open Android Studio Cloud
2. Select "Open an existing project"
3. Navigate to the `/mobile` directory
4. Wait for Gradle sync to complete

#### Step 2: Configure Environment
1. Create `.env` file in the mobile directory:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. Add Google Maps API key:
   - Get API key from Google Cloud Console
   - Add to `android/app/src/main/AndroidManifest.xml`:
```xml
<meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="YOUR_API_KEY_HERE" />
```

#### Step 3: Install Dependencies
Run in the mobile directory:
```bash
npm install
```

For Android:
```bash
cd android
./gradlew clean
cd ..
```

#### Step 4: Run the App
```bash
# Start Metro bundler
npm start

# Run on Android (in another terminal)
npm run android
```

### 4. Key Configuration Files

#### package.json Dependencies
```json
{
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.72.6",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/bottom-tabs": "^6.5.11",
    "@supabase/supabase-js": "^2.39.0",
    "react-native-maps": "^1.8.0",
    "react-native-qrcode-scanner": "^1.5.5",
    "react-native-vector-icons": "^10.0.2",
    "zustand": "^4.4.7",
    "react-query": "^3.39.3"
  }
}
```

#### Android Permissions (android/app/src/main/AndroidManifest.xml)
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.VIBRATE" />
```

### 5. Main App Screens

#### Authentication Flow
- `OnboardingScreen` - Welcome and language selection
- `LoginScreen` - User login
- `RegisterScreen` - User registration
- `PhoneVerificationScreen` - Phone number verification

#### Main App (Bottom Tabs)
- **Home** - Dashboard with quick actions
- **Map** - Interactive bike map
- **Ride** - Active trip management
- **Wallet** - Payment and balance
- **Profile** - User settings

### 6. Ethiopian-Specific Features

#### Multi-Language Support
The app supports three languages:
- English (en)
- Amharic (am) - አማርኛ
- Oromo (or) - Afaan Oromoo

#### Payment Methods
- Telebirr (Most popular)
- CBE Birr
- Dashen Bank
- Awash Bank
- Cash payments

#### Ethiopian Locations
Pre-configured with major Addis Ababa locations:
- Meskel Square (መስቀል አደባባይ)
- Bole Airport (ቦሌ አየር ማረፊያ)
- Piazza (ፒያሳ)
- Mexico Square (ሜክሲኮ አደባባይ)
- Mercato (መርካቶ)
- Unity Park (አንድነት ፓርክ)

### 7. Development Workflow

#### Running the App
1. Start Metro bundler: `npm start`
2. Run on Android: `npm run android`
3. For iOS: `npm run ios` (if needed)

#### Testing
```bash
npm test                # Unit tests
npm run test:e2e       # End-to-end tests
npm run lint           # Code linting
```

#### Building for Production
```bash
# Android Release Build
cd android
./gradlew assembleRelease
```

### 8. Troubleshooting

#### Common Issues
1. **Metro bundler not starting**: Clear cache with `npm start --reset-cache`
2. **Android build fails**: Clean with `cd android && ./gradlew clean`
3. **Maps not showing**: Check Google Maps API key configuration
4. **Location not working**: Verify location permissions

#### Debug Commands
```bash
# Clear React Native cache
npx react-native start --reset-cache

# Clean Android build
cd android && ./gradlew clean && cd ..

# Reinstall dependencies
rm -rf node_modules && npm install
```

### 9. Next Steps

1. **Configure Supabase**: Add your Supabase credentials to `.env`
2. **Setup Google Maps**: Add your Google Maps API key
3. **Test Authentication**: Try the login/register flow
4. **Test Payments**: Configure Ethiopian payment providers
5. **Customize Branding**: Update colors, logos, and text

### 10. Support

For technical issues:
- Check the detailed README.md in the mobile directory
- Review the API documentation in `docs/mobile-api-documentation.md`
- Check the architecture guide in `docs/mobile-architecture-design.md`

---

**Built with ❤️ for Ethiopia 🇪🇹**

*Empowering sustainable transportation in Addis Ababa through innovative bike-sharing technology.*