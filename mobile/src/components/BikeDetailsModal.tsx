import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Bike } from '../services/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface BikeDetailsModalProps {
  visible: boolean;
  bike: Bike | null;
  onClose: () => void;
  onReserve: (bike: Bike) => void;
}

const BikeDetailsModal: React.FC<BikeDetailsModalProps> = ({
  visible,
  bike,
  onClose,
  onReserve,
}) => {
  const { t } = useLanguage();

  if (!bike) return null;

  const getBatteryColor = () => {
    if (bike.battery_level > 70) return colors.success;
    if (bike.battery_level > 30) return colors.warning;
    return colors.error;
  };

  const getBatteryIcon = () => {
    if (bike.battery_level > 70) return 'battery-full';
    if (bike.battery_level > 30) return 'battery-std';
    return 'battery-alert';
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <View style={styles.header}>
                <View>
                  <Text style={styles.bikeCode}>{bike.bike_code}</Text>
                  <Text style={styles.bikeModel}>{bike.model}</Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Icon name="close" size={24} color={colors.text.secondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                  <Icon name={getBatteryIcon()} size={24} color={getBatteryColor()} />
                  <View style={styles.detailText}>
                    <Text style={styles.detailLabel}>Battery</Text>
                    <Text style={[styles.detailValue, { color: getBatteryColor() }]}>
                      {bike.battery_level}%
                    </Text>
                  </View>
                </View>

                <View style={styles.detailItem}>
                  <Icon name="location-on" size={24} color={colors.primary} />
                  <View style={styles.detailText}>
                    <Text style={styles.detailLabel}>Location</Text>
                    <Text style={styles.detailValue}>{bike.current_location_name || 'Unknown'}</Text>
                    {bike.current_location_amharic && (
                      <Text style={styles.detailValueAmharic}>{bike.current_location_amharic}</Text>
                    )}
                  </View>
                </View>

                <View style={styles.detailItem}>
                  <Icon name="history" size={24} color={colors.text.secondary} />
                  <View style={styles.detailText}>
                    <Text style={styles.detailLabel}>Total Rides</Text>
                    <Text style={styles.detailValue}>{bike.total_rides}</Text>
                  </View>
                </View>

                <View style={styles.detailItem}>
                  <Icon name="straighten" size={24} color={colors.text.secondary} />
                  <View style={styles.detailText}>
                    <Text style={styles.detailLabel}>Total Distance</Text>
                    <Text style={styles.detailValue}>{bike.total_distance_km.toFixed(2)} km</Text>
                  </View>
                </View>
              </View>

              <View style={styles.pricing}>
                <Text style={styles.pricingTitle}>Pricing</Text>
                <View style={styles.pricingDetails}>
                  <View style={styles.pricingItem}>
                    <Text style={styles.pricingLabel}>Base Fee</Text>
                    <Text style={styles.pricingValue}>ETB 5.00</Text>
                  </View>
                  <View style={styles.pricingItem}>
                    <Text style={styles.pricingLabel}>Per Minute</Text>
                    <Text style={styles.pricingValue}>ETB 0.50</Text>
                  </View>
                  <View style={styles.pricingItem}>
                    <Text style={styles.pricingLabel}>Per Kilometer</Text>
                    <Text style={styles.pricingValue}>ETB 2.00</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.reserveButton}
                onPress={() => onReserve(bike)}
              >
                <Icon name="directions-bike" size={20} color={colors.white} />
                <Text style={styles.reserveButtonText}>Reserve Bike</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  bikeCode: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  bikeModel: {
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
  },
  closeButton: {
    padding: spacing.xs,
  },
  detailsContainer: {
    marginBottom: spacing.lg,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  detailText: {
    marginLeft: spacing.md,
  },
  detailLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  detailValue: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semiBold,
    color: colors.text.primary,
  },
  detailValueAmharic: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  pricing: {
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  pricingTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  pricingDetails: {
    
  },
  pricingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  pricingLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  pricingValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
  },
  reserveButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: 12,
  },
  reserveButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semiBold,
    color: colors.white,
    marginLeft: spacing.sm,
  },
});

export default BikeDetailsModal;