# Bisklet Mobile App - React Native

## 🇪🇹 Ethiopian Bike Sharing Mobile Application

A comprehensive React Native mobile application for the Bisklet bike-sharing service in Addis Ababa, Ethiopia.

## ✨ Features

### 🔐 **Authentication & User Management**
- Multi-language onboarding (English, Amharic, Oromo)
- Email/password authentication with Supabase
- Phone number verification
- User profile management with Ethiopian localization

### 🗺️ **Map & Location Services**
- Real-time bike location tracking
- Interactive map with Ethiopian landmarks
- Location search with Amharic/Oromo support
- GPS-based bike finding

### 🚲 **Bike Management**
- QR code scanning for bike unlock
- Real-time bike availability
- Battery level monitoring
- Bike reservation system

### 🛣️ **Trip Management**
- Start/end trip functionality
- Real-time trip tracking
- Trip history with detailed analytics
- Ethiopian location names in multiple languages

### 💳 **Ethiopian Payment Integration**
- **Telebirr** - Ethiopia's leading mobile payment
- **CBE Birr** - Commercial Bank of Ethiopia
- **Dashen Bank** - Digital banking services
- **Awash Bank** - Mobile banking
- Wallet system with ETB currency

### 🌍 **Ethiopian Localization**
- **English** - International users
- **Amharic (አማርኛ)** - Primary Ethiopian language
- **Oromo (Afaan Oromoo)** - Largest ethnic group language
- Ethiopian calendar integration
- Local currency (ETB) formatting

## 🏗️ **Architecture**

### **State Management**
- **Zustand** for global state management
- **React Query** for server state and caching
- **Context API** for authentication and language

### **Navigation**
- **React Navigation 6** with bottom tabs
- Stack navigation for detailed screens
- Deep linking support

### **Real-time Features**
- **Supabase Realtime** for live bike updates
- WebSocket connections for trip tracking
- Push notifications for trip events

## 📱 **Screens**

### **Authentication Flow**
- Onboarding with Ethiopian imagery
- Language selection
- Login/Register
- Phone verification

### **Main App (Bottom Tabs)**
- **Home** - Dashboard with quick actions
- **Map** - Interactive bike map
- **Ride** - Active trip management
- **Wallet** - Payment and balance
- **Profile** - User settings

### **Additional Screens**
- Bike details and reservation
- QR code scanner
- Trip history and analytics
- Payment methods management
- Settings and preferences

## 🛠️ **Setup Instructions**

### **Prerequisites**
```bash
# Install Node.js 16+
# Install React Native CLI
npm install -g react-native-cli

# For iOS development
# Install Xcode and CocoaPods
### Quick Start Commands

1. **Install Dependencies:**
```bash
npm install
```

2. **Start Metro Bundler:**
```bash
npm run metro
# OR
npm start
```

3. **Run on Android:**
```bash
# In a new terminal
npm run android
```

### Troubleshooting

If you encounter issues:

```bash
# Clean cache and restart
npm run reset-cache

# Clean build
npm run clean

# Reinstall dependencies
rm -rf node_modules
npm install
```

## 🔧 **Configuration**

### **Maps Setup**
```bash
# Add Google Maps API key to:
# iOS: ios/Bisklet/AppDelegate.m
# Android: android/app/src/main/AndroidManifest.xml
```

### **Push Notifications**
```bash
# Configure Firebase for push notifications
# Add google-services.json (Android)
# Add GoogleService-Info.plist (iOS)
```

### **Ethiopian Payment Integration**
```typescript
// Configure payment providers in:
// src/services/payment/
// - TelebirrService.ts
// - CBEBirrService.ts
// - DashenBankService.ts
// - AwashBankService.ts
```

## 📊 **Key Components**

### **Authentication**
```typescript
// src/contexts/AuthContext.tsx
// Handles user authentication with Supabase
// Manages user session and profile data
```

### **Location Services**
```typescript
// src/contexts/LocationContext.tsx
// GPS location tracking
// Permission management
// Ethiopian location search
```

### **Language Support**
```typescript
// src/contexts/LanguageContext.tsx
// Multi-language support
// Ethiopian calendar integration
// RTL support preparation
```

### **Payment Processing**
```typescript
// src/services/payment/
// Ethiopian payment method integration
// Secure transaction handling
// Wallet management
```

## 🎨 **Design System**

### **Colors**
- **Primary**: #2ECC71 (Ethiopian green)
- **Secondary**: #3498DB (Sky blue)
- **Accent**: #F39C12 (Ethiopian gold)
- **Ethiopian Flag**: Green, Yellow, Red gradients

### **Typography**
- **Font**: System fonts
- **Sizes**: Responsive scale from 12px to 32px
- **Weights**: Regular, Medium, SemiBold, Bold

### **Spacing**
- **System**: 4px base unit (4, 8, 16, 24, 32, 48, 64)
- **Consistent**: Applied throughout the app

## 🔒 **Security Features**

### **Data Protection**
- Encrypted local storage
- Secure token management
- Biometric authentication support
- PCI DSS compliant payment handling

### **Privacy**
- Location data encryption
- User consent management
- GDPR compliance ready
- Ethiopian data protection standards

## 🚀 **Performance Optimizations**

### **Caching Strategy**
- Image caching with react-native-fast-image
- API response caching with React Query
- Offline-first architecture

### **Bundle Optimization**
- Code splitting by feature
- Lazy loading of screens
- Optimized asset delivery

## 🧪 **Testing**

```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 📦 **Build & Deployment**

### **Android Build**
```bash
# Create release build
cd android
./gradlew assembleRelease
```

### **iOS Build**
```bash
# Create release build
cd ios
xcodebuild -workspace Bisklet.xcworkspace -scheme Bisklet -configuration Release
```

### **App Store Deployment**
- Configure app signing
- Update version numbers
- Submit to App Store Connect / Google Play Console

## 🌟 **Ethiopian-Specific Features**

### **Cultural Integration**
- Ethiopian flag colors and imagery
- Local landmarks and districts
- Cultural holidays and events
- Traditional greetings and phrases

### **Language Support**
- **Amharic**: Native script support
- **Oromo**: Latin script with special characters
- **English**: International accessibility

### **Payment Methods**
- **Telebirr**: Most popular mobile payment
- **Bank Integration**: Major Ethiopian banks
- **Cash Support**: Traditional payment option

### **Location Services**
- **Addis Ababa Focus**: City-specific features
- **District Names**: Both English and Amharic
- **Popular Landmarks**: Meskel Square, Bole Airport, etc.

## 📈 **Analytics & Monitoring**

### **User Analytics**
- Trip patterns and usage
- Popular locations and routes
- Payment method preferences
- Language usage statistics

### **Performance Monitoring**
- Crash reporting
- Performance metrics
- User experience tracking
- Ethiopian market insights

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Follow the coding standards
4. Add tests for new features
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 **Support**

For technical support or questions:
- Email: support@bisklet.et
- Phone: +251-11-XXX-XXXX
- Website: https://bisklet.et

---

**Built with ❤️ for Ethiopia 🇪🇹**

*Empowering sustainable transportation in Addis Ababa through innovative bike-sharing technology.*