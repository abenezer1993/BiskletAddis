import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import { Trip } from '../services/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface ActiveTripCardProps {
  trip: Trip;
  onPress: () => void;
}

const ActiveTripCard: React.FC<ActiveTripCardProps> = ({ trip, onPress }) => {
  const { t } = useLanguage();
  const [elapsedTime, setElapsedTime] = useState('00:00');

  useEffect(() => {
    const interval = setInterval(() => {
      const startTime = new Date(trip.start_time);
      const now = new Date();
      const diff = now.getTime() - startTime.getTime();
      
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      
      setElapsedTime(
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [trip.start_time]);

  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.container}
      >
        <View style={styles.header}>
          <View style={styles.statusContainer}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{t('trip.activeRide')}</Text>
          </View>
          <Icon name="directions-bike" size={24} color={colors.white} />
        </View>
        
        <View style={styles.content}>
          <View style={styles.bikeInfo}>
            <Text style={styles.bikeCode}>
              {trip.bikes?.bike_code || 'BK-0000'}
            </Text>
            <Text style={styles.bikeModel}>
              {trip.bikes?.model || 'Urban Classic'}
            </Text>
          </View>
          
          <View style={styles.timeContainer}>
            <Text style={styles.timeLabel}>{t('trip.elapsedTime')}</Text>
            <Text style={styles.timeValue}>{elapsedTime}</Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.locationContainer}>
            <Icon name="location-on" size={16} color={colors.white} />
            <Text style={styles.locationText}>
              {trip.start_location_name || t('trip.unknownLocation')}
            </Text>
          </View>
          <Text style={styles.tapToView}>{t('trip.tapToView')}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
    marginRight: spacing.xs,
  },
  statusText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.white,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  bikeInfo: {
    flex: 1,
  },
  bikeCode: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
  bikeModel: {
    fontSize: typography.sizes.sm,
    color: colors.white,
    opacity: 0.8,
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  timeLabel: {
    fontSize: typography.sizes.xs,
    color: colors.white,
    opacity: 0.8,
  },
  timeValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    fontSize: typography.sizes.sm,
    color: colors.white,
    marginLeft: spacing.xs,
    opacity: 0.9,
  },
  tapToView: {
    fontSize: typography.sizes.xs,
    color: colors.white,
    opacity: 0.7,
  },
});

export default ActiveTripCard;