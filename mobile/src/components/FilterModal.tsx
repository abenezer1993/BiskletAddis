import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Slider,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useLanguage } from '../contexts/LanguageContext';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface FilterModalProps {
  visible: boolean;
  filters: {
    batteryLevel: number;
    maxDistance: number;
    bikeType: string;
  };
  onFiltersChange: (filters: any) => void;
  onClose: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  filters,
  onFiltersChange,
  onClose,
}) => {
  const { t } = useLanguage();

  const handleBatteryChange = (value: number) => {
    onFiltersChange({ ...filters, batteryLevel: value });
  };

  const handleDistanceChange = (value: number) => {
    onFiltersChange({ ...filters, maxDistance: value });
  };

  const handleBikeTypeChange = (type: string) => {
    onFiltersChange({ ...filters, bikeType: type });
  };

  const handleReset = () => {
    onFiltersChange({
      batteryLevel: 0,
      maxDistance: 5,
      bikeType: 'all',
    });
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
                <Text style={styles.title}>{t('map.filterTitle')}</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Icon name="close" size={24} color={colors.text.secondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>{t('map.batteryLevel')}</Text>
                <View style={styles.sliderContainer}>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={100}
                    step={10}
                    value={filters.batteryLevel}
                    onValueChange={handleBatteryChange}
                    minimumTrackTintColor={colors.primary}
                    maximumTrackTintColor={colors.lightGray}
                    thumbTintColor={colors.primary}
                  />
                  <View style={styles.sliderLabels}>
                    <Text style={styles.sliderValue}>{filters.batteryLevel}%</Text>
                    <Text style={styles.sliderDescription}>
                      {filters.batteryLevel === 0 ? 'Any battery level' : `Min ${filters.batteryLevel}% battery`}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>{t('map.maxDistance')}</Text>
                <View style={styles.sliderContainer}>
                  <Slider
                    style={styles.slider}
                    minimumValue={1}
                    maximumValue={10}
                    step={1}
                    value={filters.maxDistance}
                    onValueChange={handleDistanceChange}
                    minimumTrackTintColor={colors.primary}
                    maximumTrackTintColor={colors.lightGray}
                    thumbTintColor={colors.primary}
                  />
                  <View style={styles.sliderLabels}>
                    <Text style={styles.sliderValue}>{filters.maxDistance} km</Text>
                    <Text style={styles.sliderDescription}>
                      Maximum distance from your location
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>{t('map.bikeType')}</Text>
                <View style={styles.bikeTypeContainer}>
                  {['all', 'Urban Classic', 'City Cruiser', 'Electric Pro'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.bikeTypeButton,
                        filters.bikeType === type && styles.bikeTypeButtonActive,
                      ]}
                      onPress={() => handleBikeTypeChange(type)}
                    >
                      <Text
                        style={[
                          styles.bikeTypeText,
                          filters.bikeType === type && styles.bikeTypeTextActive,
                        ]}
                      >
                        {type === 'all' ? 'All Types' : type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                  <Text style={styles.resetButtonText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.applyButton} onPress={onClose}>
                  <Text style={styles.applyButtonText}>Apply Filters</Text>
                </TouchableOpacity>
              </View>
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
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  closeButton: {
    padding: spacing.xs,
  },
  filterSection: {
    marginBottom: spacing.lg,
  },
  filterLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  sliderContainer: {
    
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderValue: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semiBold,
    color: colors.primary,
  },
  sliderDescription: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  bikeTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  bikeTypeButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.lightGray,
    margin: spacing.xs,
  },
  bikeTypeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  bikeTypeText: {
    fontSize: typography.sizes.sm,
    color: colors.text.primary,
  },
  bikeTypeTextActive: {
    color: colors.white,
    fontWeight: typography.weights.medium,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  resetButton: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 12,
    marginRight: spacing.sm,
  },
  resetButtonText: {
    fontSize: typography.sizes.md,
    color: colors.text.primary,
  },
  applyButton: {
    flex: 2,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: 12,
  },
  applyButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semiBold,
    color: colors.white,
  },
});

export default FilterModal;