import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Trip } from '../services/supabase';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface RecentActivityCardProps {
  trip: Trip;
  onPress?: () => void;
}

const RecentActivityCard: React.FC<RecentActivityCardProps> = ({ trip, onPress }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return colors.success;
      case 'cancelled': return colors.error;
      default: return colors.text.secondary;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return colors.success;
      case 'pending': return colors.warning;
      case 'failed': return colors.error;
      default: return colors.text.secondary;
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Icon name="directions-bike" size={24} color={colors.white} />
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.bikeCode}>{trip.bikes?.bike_code || 'BK-0000'}</Text>
          <Text style={[styles.status, { color: getStatusColor(trip.status) }]}>
            {trip.status}
          </Text>
        </View>
        
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Icon name="schedule" size={14} color={colors.text.secondary} />
            <Text style={styles.detailText}>{formatDate(trip.start_time)}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Icon name="location-on" size={14} color={colors.text.secondary} />
            <Text style={styles.detailText} numberOfLines={1}>
              {trip.start_location_name || 'Unknown location'}
            </Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.cost}>ETB {trip.cost_etb.toFixed(2)}</Text>
          <Text style={[styles.paymentStatus, { color: getPaymentStatusColor(trip.payment_status) }]}>
            {trip.payment_status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  bikeCode: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semiBold,
    color: colors.text.primary,
  },
  status: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    textTransform: 'capitalize',
  },
  details: {
    marginBottom: spacing.xs,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  detailText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cost: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semiBold,
    color: colors.text.primary,
  },
  paymentStatus: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    textTransform: 'capitalize',
  },
});

export default RecentActivityCard;