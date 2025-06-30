import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { LocationProvider } from './contexts/LocationContext';
import AppNavigator from './navigation/AppNavigator';
import { supabase } from './services/supabase';
import { colors } from './theme/colors';
import './i18n/i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App: React.FC = () => {
  useEffect(() => {
    // Initialize Supabase session
    supabase.auth.getSession();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <LanguageProvider>
            <AuthProvider>
              <LocationProvider>
                <NavigationContainer>
                  <StatusBar
                    barStyle="light-content"
                    backgroundColor={colors.primary}
                  />
                  <AppNavigator />
                  <Toast />
                </NavigationContainer>
              </LocationProvider>
            </AuthProvider>
          </LanguageProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

export default App;