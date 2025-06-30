# Bisklet Mobile App - Android Studio Cloud Setup Guide

## 🚀 Getting Started with Android Studio Cloud

This guide will help you set up and run the Bisklet mobile app in Android Studio Cloud.

### Prerequisites
- Android Studio Cloud account
- Basic knowledge of React Native and Android development

## Step 1: Import Project

1. Open Android Studio Cloud
2. Select **File > Open** or click **Open an existing project**
3. Navigate to the `/mobile` directory in your project
4. Click **OK** to open the project

## Step 2: Configure Environment

1. Create a `.env` file in the mobile directory with your Supabase credentials:
   ```
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

2. Update the Google Maps API key in `android/app/src/main/AndroidManifest.xml`:
   ```xml
   <meta-data
     android:name="com.google.android.geo.API_KEY"
     android:value="YOUR_GOOGLE_MAPS_API_KEY" />
   ```

## Step 3: Install Dependencies

1. Open a terminal in Android Studio (View > Tool Windows > Terminal)
2. Run the following commands:
   ```bash
   npm install
   ```

## Step 4: Configure Android SDK

1. Go to **File > Project Structure**
2. Under **SDK Location**, make sure the correct Android SDK is selected
3. Click **OK** to save changes

## Step 5: Run the App

1. In the terminal, start the Metro bundler:
   ```bash
   npm start
   ```

2. In a new terminal tab, run the Android app:
   ```bash
   npm run android
   ```

3. Android Studio will build and launch the app in the emulator

## Troubleshooting

### Common Issues

1. **Build failures**:
   ```bash
   cd android && ./gradlew clean && cd ..
   npm run android
   ```

2. **Metro bundler issues**:
   ```bash
   npm start --reset-cache
   ```

3. **Missing dependencies**:
   ```bash
   npm install
   cd ios && pod install && cd ..
   ```

4. **Permission issues**:
   - Make sure location and camera permissions are enabled in the emulator settings

## Key Features

- **Authentication**: Email/password login with Supabase
- **Maps**: Real-time bike locations with Google Maps
- **Payments**: Ethiopian payment methods integration
- **Multilingual**: English, Amharic, and Oromo language support
- **QR Scanning**: Bike unlocking via QR codes

## Project Structure

```
mobile/
├── android/                # Android-specific files
├── src/
│   ├── components/         # Reusable UI components
│   ├── contexts/           # React contexts (Auth, Language, Location)
│   ├── navigation/         # Navigation setup
│   ├── screens/            # App screens
│   │   ├── auth/           # Authentication screens
│   │   └── main/           # Main app screens
│   ├── services/           # API and external services
│   ├── theme/              # Colors, typography, spacing
│   └── i18n/               # Multi-language support
├── index.js                # Entry point
└── package.json            # Dependencies
```

## Testing in Android Studio

1. **Run on different devices**:
   - Use the AVD Manager to create different virtual devices
   - Test on various screen sizes and Android versions

2. **Debug mode**:
   - Use Chrome DevTools for JavaScript debugging
   - Use Android Studio's debugger for native code

3. **Performance profiling**:
   - Use Android Studio's CPU and memory profilers
   - Monitor app performance on different devices

## Additional Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Supabase Documentation](https://supabase.io/docs)
- [Android Studio Documentation](https://developer.android.com/studio/intro)

---

**Built with ❤️ for Ethiopia 🇪🇹**

*Empowering sustainable transportation in Addis Ababa through innovative bike-sharing technology.*