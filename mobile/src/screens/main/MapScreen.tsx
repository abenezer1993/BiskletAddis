import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

import { useLocation } from '../../contexts/LocationContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase, Bike } from '../../services/supabase';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

import BikeMarker from '../../components/BikeMarker';
import BikeDetailsModal from '../../components/BikeDetailsModal';
import FilterModal from '../../components/FilterModal';

const MapScreen: React.FC = () => {
  const navigation = useNavigation();
  const { location, requestLocation, hasLocationPermission } = useLocation();
  const { t } = useLanguage();
  const mapRef = useRef<MapView>(null);

  const [bikes, setBikes] = useState<Bike[]>([]);
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);
  const [showBikeDetails, setShowBikeDetails] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    batteryLevel: 0,
    maxDistance: 5,
    bikeType: 'all',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasLocationPermission) {
      Alert.alert(
        'Location Permission Required',
        'Bisklet needs access to your location to find nearby bikes.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Grant Permission', onPress: requestLocation }
        ]
      );
    } else {
      requestLocation();
    }
    
    loadBikes();
  }, []);

  useEffect(() => {
    if (location) {
      centerMapOnLocation();
    }
  }, [location]);

  const loadBikes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bikes')
        .select('*')
        .eq('status', 'available');

      if (error) throw error;

      // Add mock coordinates for demo (in production, these would come from the database)
      const bikesWithCoords = data?.map((bike, index) => ({
        ...bike,
        latitude: 9.0054 + (Math.random() - 0.5) * 0.02,
        longitude: 38.7578 + (Math.random() - 0.5) * 0.02,
      })) || [];

      setBikes(bikesWithCoords);
    } catch (error) {
      console.error('Error loading bikes:', error);
      Alert.alert('Error', 'Failed to load available bikes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const centerMapOnLocation = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const handleBikePress = (bike: Bike) => {
    setSelectedBike(bike);
    setShowBikeDetails(true);
  };

  const handleReserveBike = async (bike: Bike) => {
    try {
      // In a real app, this would reserve the bike
      setShowBikeDetails(false);
      navigation.navigate('BikeDetails' as never, { bike } as never);
    } catch (error) {
      console.error('Error reserving bike:', error);
      Alert.alert('Error', 'Failed to reserve bike. Please try again.');
    }
  };

  const filteredBikes = bikes.filter((bike) => {
    if (filters.batteryLevel > 0 && bike.battery_level < filters.batteryLevel) {
      return false;
    }
    if (searchQuery && !bike.current_location_name?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color={colors.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('map.searchPlaceholder')}
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
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 9.0054, // Meskel Square
          longitude: 38.7578,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {filteredBikes.map((bike) => (
          <Marker
            key={bike.id}
            coordinate={{
              latitude: bike.latitude || 9.0054,
              longitude: bike.longitude || 38.7578,
            }}
            onPress={() => handleBikePress(bike)}
          >
            <BikeMarker bike={bike} />
          </Marker>
        ))}
      </MapView>

      {/* Floating Action Buttons */}
      <View style={styles.floatingButtons}>
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={centerMapOnLocation}
        >
          <Icon name="my-location" size={24} color={colors.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => navigation.navigate('QRScanner' as never)}
        >
          <Icon name="qr-code-scanner" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Bike Count */}
      <View style={styles.bikeCount}>
        <Text style={styles.bikeCountText}>
          {filteredBikes.length} {t('map.bikesAvailable')}
        </Text>
      </View>

      {/* Bike Details Modal */}
      <BikeDetailsModal
        visible={showBikeDetails}
        bike={selectedBike}
        onClose={() => setShowBikeDetails(false)}
        onReserve={handleReserveBike}
      />

      {/* Filter Modal */}
      <FilterModal
        visible={showFilter}
        filters={filters}
        onFiltersChange={setFilters}
        onClose={() => setShowFilter(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: 25,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
  },
  filterButton: {
    padding: spacing.sm,
  },
  map: {
    flex: 1,
  },
  floatingButtons: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.xl,
  },
  floatingButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  bikeCount: {
    position: 'absolute',
    top: 100,
    left: spacing.md,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  bikeCountText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
  },
});

export default MapScreen;