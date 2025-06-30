import React, { createContext, useContext, useState, useEffect } from 'react';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform, Alert } from 'react-native';

interface LocationContextType {
  location: {
    latitude: number;
    longitude: number;
  } | null;
  loading: boolean;
  error: string | null;
  requestLocation: () => Promise<void>;
  hasLocationPermission: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      setHasLocationPermission(granted);
    } else {
      // For iOS, check authorization status
      Geolocation.requestAuthorization('whenInUse').then((result) => {
        setHasLocationPermission(result === 'granted');
      });
    }
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'Bisklet needs access to your location to find nearby bikes.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      const hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
      setHasLocationPermission(hasPermission);
      return hasPermission;
    } else {
      const result = await Geolocation.requestAuthorization('whenInUse');
      const hasPermission = result === 'granted';
      setHasLocationPermission(hasPermission);
      return hasPermission;
    }
  };

  const requestLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      let hasPermission = hasLocationPermission;
      
      if (!hasPermission) {
        hasPermission = await requestLocationPermission();
      }

      if (!hasPermission) {
        throw new Error('Location permission denied');
      }

      Geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLoading(false);
        },
        (error) => {
          console.error('Location error:', error);
          setError('Unable to get your location. Please check your GPS settings.');
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Location error');
      setLoading(false);
    }
  };

  const value = {
    location,
    loading,
    error,
    requestLocation,
    hasLocationPermission,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};