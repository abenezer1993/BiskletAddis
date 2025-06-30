import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import LinearGradient from 'react-native-linear-gradient';

import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useLocation } from '../../contexts/LocationContext';
import { supabase, Trip } from '../../services/supabase';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

const RideScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { location } = useLocation();
  
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [elapsedTime, setElapsedTime] = useState('00:00');
  const [distance, setDistance] = useState(0);
  const [cost, setCost] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadActiveTrip();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (activeTrip) {
      timer = setInterval(() => {
        const startTime = new Date(activeTrip.start_time);
        const now = new Date();
        const diff = now.getTime() - startTime.getTime();
        
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        setElapsedTime(
          `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
        
        // Calculate approximate distance and cost
        const newDistance = minutes * 0.2; // 200m per minute
        setDistance(newDistance);
        
        // 5 ETB base + 2 ETB per km
        const newCost = 5 + (newDistance * 2);
        setCost(newCost);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [activeTrip]);

  const loadActiveTrip = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('trips')
        .select(`
          *,
          bikes(bike_code, model)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;
      setActiveTrip(data);
    } catch (error) {
      console.error('Error loading active trip:', error);
    }
  };

  const handleEndRide = async () => {
    if (!activeTrip || !location) return;

    Alert.alert(
      'End Ride',
      'Are you sure you want to end this ride?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'End Ride', onPress: confirmEndRide }
      ]
    );
  };

  const confirmEndRide = async () => {
    if (!activeTrip || !location) return;

    setLoading(true);
    try {
      // Update bike status back to 'available'
      await supabase
        .from('bikes')
        .update({ status: 'available' })
        .eq('id', activeTrip.bike_id);
      
      // Update trip record
      await supabase
        .from('trips')
        .update({
          end_time: new Date().toISOString(),
          end_location: `POINT(${location.longitude} ${location.latitude})`,
          end_location_name: 'Current Location',
          distance_km: distance,
          duration_minutes: parseInt(elapsedTime.split(':')[0]),
          cost_etb: cost,
          status: 'completed',
        })
        .eq('id', activeTrip.id);
      
      // Create payment record
      await supabase
        .from('payments')
        .insert({
          user_id: user?.id,
          trip_id: activeTrip.id,
          amount_etb: cost,
          payment_method: 'wallet',
          payment_type: 'ride',
          status: 'pending',
        });
      
      Alert.alert(
        'Ride Completed',
        `Thank you for riding with Bisklet!\nDistance: ${distance.toFixed(2)} km\nCost: ETB ${cost.toFixed(2)}`,
        [{ text: 'OK', onPress: () => navigation.navigate('Home' as never) }]
      );
    } catch (error) {
      console.error('Error ending trip:', error);
      Alert.alert('Error', 'Failed to end trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleScanQR = () => {
    navigation.navigate('QRScanner' as never);
  };

  const handleFindNearby = () => {
    navigation.navigate('Map' as never);
  };

  if (!activeTrip) {
    return (
      <View style={styles.container}>
        <View style={styles.noRideContainer}>
          <Icon name="directions-bike" size={80} color={colors.lightGray} />
          <Text style={styles.noRideTitle}>No Active Ride</Text>
          <Text style={styles.noRideSubtitle}>Start a ride to track your journey</Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleScanQR}>
              <Icon name="qr-code-scanner" size={24} color={colors.white} />
              <Text style={styles.actionButtonText}>Scan QR Code</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleFindNearby}>
              <Icon name="search" size={24} color={colors.white} />
              <Text style={styles.actionButtonText}>Find Nearby</Text>
            </TouchableOpacity>
          </View>
          
          <Image
            source={{ uri: 'https://images.pexels.com/photos/1149601/pexels-photo-1149601.jpeg?auto=compress&cs=tinysrgb&w=800' }}
            style={styles.bikeImage}
            resizeMode="cover"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.accent]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.tripInfo}>
            <Text style={styles.tripTitle}>{t('trip.activeRide')}</Text>
            <Text style={styles.bikeCode}>{activeTrip.bikes?.bike_code || 'BK-0000'}</Text>
            <Text style={styles.bikeModel}>{activeTrip.bikes?.model || 'Urban Classic'}</Text>
          </View>
          
          <View style={styles.timeContainer}>
            <Text style={styles.timeLabel}>{t('trip.elapsedTime')}</Text>
            <Text style={styles.timeValue}>{elapsedTime}</Text>
          </View>
        </View>
      </LinearGradient>
      
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: location?.latitude || 9.0054,
            longitude: location?.longitude || 38.7578,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation
        >
          {location && (
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Your Location"
            />
          )}
        </MapView>
      </View>
      
      <View style={styles.tripDetails}>
        <ScrollView>
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Icon name="straighten" size={24} color={colors.primary} />
                <Text style={styles.detailLabel}>Distance</Text>
                <Text style={styles.detailValue}>{distance.toFixed(2)} km</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Icon name="attach-money" size={24} color={colors.primary} />
                <Text style={styles.detailLabel}>Cost</Text>
                <Text style={styles.detailValue}>ETB {cost.toFixed(2)}</Text>
              </View>
            </View>
            
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Icon name="access-time" size={24} color={colors.primary} />
                <Text style={styles.detailLabel}>Start Time</Text>
                <Text style={styles.detailValue}>
                  {new Date(activeTrip.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
              
              <View style={styles.detailItem}>
                <Icon name="location-on" size={24} color={colors.primary} />
                <Text style={styles.detailLabel}>Start Location</Text>
                <Text style={styles.detailValue}>
                  {activeTrip.start_location_name || 'Unknown'}
                </Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity
            style={[styles.endRideButton, loading && styles.endRideButtonDisabled]}
            onPress={handleEndRide}
            disabled={loading}
          >
            <Icon name="stop-circle" size={24} color={colors.white} />
            <Text style={styles.endRideButtonText}>
              {loading ? 'Ending Ride...' : t('trip.endRide')}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.helpCard}>
            <Icon name="help-outline" size={20} color={colors.text.secondary} />
            <Text style={styles.helpText}>
              Need help with your ride? Contact our support team at +251-11-123-4567
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  noRideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  noRideTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginTop: spacing.lg,
  },
  noRideSubtitle: {
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: spacing.xl,
  },
  actionButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
  },
  actionButtonText: {
    color: colors.white,
    fontWeight: typography.weights.semiBold,
    marginLeft: spacing.sm,
  },
  bikeImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  header: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tripInfo: {
    flex: 1,
  },
  tripTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.white,
    opacity: 0.9,
  },
  bikeCode: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.white,
    marginTop: spacing.xs,
  },
  bikeModel: {
    fontSize: typography.sizes.sm,
    color: colors.white,
    opacity: 0.8,
  },
  timeContainer: {
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: typography.sizes.sm,
    color: colors.white,
    opacity: 0.8,
  },
  timeValue: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
  mapContainer: {
    height: '40%',
  },
  map: {
    flex: 1,
  },
  tripDetails: {
    flex: 1,
    padding: spacing.md,
  },
  detailCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  detailItem: {
    alignItems: 'center',
    width: '48%',
  },
  detailLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  detailValue: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semiBold,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  endRideButton: {
    backgroundColor: colors.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  endRideButtonDisabled: {
    opacity: 0.6,
  },
  endRideButtonText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semiBold,
    color: colors.white,
    marginLeft: spacing.sm,
  },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    padding: spacing.md,
    borderRadius: 12,
  },
  helpText: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
});

export default RideScreen;