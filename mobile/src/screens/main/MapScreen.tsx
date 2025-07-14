import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { useLocation } from '../../contexts/LocationContext';
import { useLanguage } from '../../contexts/LanguageContext';
import BikeMarker from '../../components/BikeMarker';
import BikeDetailsModal from '../../components/BikeDetailsModal';
import FilterModal from '../../components/FilterModal';

interface Bike {
  id: string;
  code: string;
  latitude: number;
  longitude: number;
  batteryLevel: number;
  status: 'available' | 'in_use' | 'maintenance';
  model: string;
  location: string;
  locationAmharic: string;
}

const MapScreen: React.FC = () => {
  const navigation = useNavigation();
  const { currentLocation, requestLocationPermission } = useLocation();
  const { t } = useLanguage();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);
  const [showBikeDetails, setShowBikeDetails] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: 9.0054, // Meskel Square
    longitude: 38.7578,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Mock bike data with Ethiopian locations
  const [bikes] = useState<Bike[]>([
    {
      id: '1',
      code: 'BK-001',
      latitude: 9.0054,
      longitude: 38.7578,
      batteryLevel: 85,
      status: 'available',
      model: 'EcoBike Pro',
      location: 'Meskel Square',
      locationAmharic: 'መስቀል አደባባይ',
    },
    {
      id: '2',
      code: 'BK-002',
      latitude: 8.9806,
      longitude: 38.7992,
      batteryLevel: 92,
      status: 'available',
      model: 'EcoBike Standard',
      location: 'Bole Airport',
      locationAmharic: 'ቦሌ አየር ማረፊያ',
    },
    {
      id: '3',
      code: 'BK-003',
      latitude: 9.0348,
      longitude: 38.7469,
      batteryLevel: 67,
      status: 'available',
      model: 'EcoBike Pro',
      location: 'Piazza',
      locationAmharic: 'ፒያሳ',
    },
    {
      id: '4',
      code: 'BK-004',
      latitude: 9.0189,
      longitude: 38.7489,
      batteryLevel: 78,
      status: 'available',
      model: 'EcoBike Standard',
      location: 'Mexico Square',
      locationAmharic: 'ሜክሲኮ አደባባይ',
    },
    {
      id: '5',
      code: 'BK-005',
      latitude: 9.0157,
      longitude: 38.7297,
      batteryLevel: 45,
      status: 'available',
      model: 'EcoBike Pro',
      location: 'Mercato',
      locationAmharic: 'መርካቶ',
    },
  ]);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (currentLocation) {
      setMapRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [currentLocation]);

  const handleBikePress = (bike: Bike) => {
    setSelectedBike(bike);
    setShowBikeDetails(true);
  };

  const handleReserveBike = (bike: Bike) => {
    Alert.alert(
      'Reserve Bike',
      `Would you like to reserve ${bike.code}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reserve',
          onPress: () => {
            Alert.alert('Success', 'Bike reserved successfully!');
            setShowBikeDetails(false);
          },
        },
      ]
    );
  };

  const handleGetDirections = (bike: Bike) => {
    Alert.alert(
      'Directions',
      `Getting directions to ${bike.location} (${bike.locationAmharic})`,
      [{ text: 'OK' }]
    );
  };

  const filteredBikes = bikes.filter(bike =>
    bike.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bike.locationAmharic.includes(searchQuery)
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color={colors.text.secondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('map.searchPlaceholder')}
            placeholderTextColor={colors.text.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilter(true)}
        >
          <Icon name="tune" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Map */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={mapRegion}
        onRegionChangeComplete={setMapRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {filteredBikes.map((bike) => (
          <BikeMarker
            key={bike.id}
            bike={bike}
            onPress={() => handleBikePress(bike)}
          />
        ))}
      </MapView>

      {/* Bike Count */}
      <View style={styles.bikeCountContainer}>
        <Icon name="pedal-bike" size={20} color={colors.primary} />
        <Text style={styles.bikeCountText}>
          {filteredBikes.length} {t('map.bikesAvailable')}
        </Text>
      </View>

      {/* My Location Button */}
      <TouchableOpacity
        style={styles.myLocationButton}
        onPress={() => {
          if (currentLocation) {
            setMapRegion({
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
          }
        }}
      >
        <Icon name="my-location" size={24} color={colors.primary} />
      </TouchableOpacity>

      {/* Bike Details Modal */}
      <BikeDetailsModal
        visible={showBikeDetails}
        bike={selectedBike}
        onClose={() => setShowBikeDetails(false)}
        onReserve={handleReserveBike}
        onGetDirections={handleGetDirections}
      />

      {/* Filter Modal */}
      <FilterModal
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        onApplyFilters={(filters) => {
          console.log('Applied filters:', filters);
          setShowFilter(false);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    marginRight: spacing.md,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.sm,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
  },
  filterButton: {
    padding: spacing.sm,
    backgroundColor: colors.lightGray,
    borderRadius: 12,
  },
  map: {
    flex: 1,
  },
  bikeCountContainer: {
    position: 'absolute',
    top: 80,
    left: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  bikeCountText: {
    marginLeft: spacing.xs,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
  },
  myLocationButton: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 25,
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
});

export default MapScreen;