import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Bike } from '../services/supabase';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface BikeMarkerProps {
  bike: Bike;
}

const BikeMarker: React.FC<BikeMarkerProps> = ({ bike }) => {
  const getBatteryColor = () => {
    if (bike.battery_level > 70) return colors.success;
    if (bike.battery_level > 30) return colors.warning;
    return colors.error;
  };

  return (
    <View style={styles.container}>
      <View style={styles.markerContainer}>
        <Icon name="directions-bike" size={16} color={colors.white} />
        <View style={[styles.batteryIndicator, { backgroundColor: getBatteryColor() }]}>
          <Text style={styles.batteryText}>{bike.battery_level}%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  markerContainer: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  batteryIndicator: {
    position: 'absolute',
    bottom: -10,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.white,
  },
  batteryText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
});

export default BikeMarker;