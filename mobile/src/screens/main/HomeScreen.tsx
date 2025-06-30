import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase, Trip } from '../../services/supabase';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

import Header from '../../components/Header';
import QuickActionCard from '../../components/QuickActionCard';
import ActiveTripCard from '../../components/ActiveTripCard';
import WalletBalanceCard from '../../components/WalletBalanceCard';
import RecentActivityCard from '../../components/RecentActivityCard';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [recentTrips, setRecentTrips] = useState<Trip[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!user) return;

    try {
      // Load active trip
      const { data: activeTripData } = await supabase
        .from('trips')
        .select(`
          *,
          bikes(bike_code, model)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      setActiveTrip(activeTripData);

      // Load recent trips
      const { data: recentTripsData } = await supabase
        .from('trips')
        .select(`
          *,
          bikes(bike_code, model)
        `)
        .eq('user_id', user.id)
        .neq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentTrips(recentTripsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('home.goodMorning');
    if (hour < 18) return t('home.goodAfternoon');
    return t('home.goodEvening');
  };

  const quickActions = [
    {
      title: t('home.findBike'),
      subtitle: t('home.findBikeSubtitle'),
      icon: 'search',
      color: colors.primary,
      onPress: () => navigation.navigate('Map' as never),
    },
    {
      title: t('home.scanQR'),
      subtitle: t('home.scanQRSubtitle'),
      icon: 'qr-code-scanner',
      color: colors.secondary,
      onPress: () => navigation.navigate('QRScanner' as never),
    },
    {
      title: t('home.tripHistory'),
      subtitle: t('home.tripHistorySubtitle'),
      icon: 'history',
      color: colors.accent,
      onPress: () => navigation.navigate('TripHistory' as never),
    },
  ];

  return (
    <View style={styles.container}>
      <Header
        title={`${getGreeting()}, ${user?.full_name?.split(' ')[0] || 'User'}`}
        subtitle={t('home.welcomeBack')}
        showNotifications
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Ethiopian Flag Banner */}
        <LinearGradient
          colors={['#009639', '#FEDD00', '#DA020E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.flagBanner}
        >
          <Text style={styles.flagText}>🇪🇹 {t('home.servingAddis')}</Text>
        </LinearGradient>

        {/* Active Trip Card */}
        {activeTrip && (
          <ActiveTripCard
            trip={activeTrip}
            onPress={() => navigation.navigate('Ride' as never)}
          />
        )}

        {/* Wallet Balance */}
        <WalletBalanceCard
          balance={user?.wallet_balance || 0}
          onPress={() => navigation.navigate('Wallet' as never)}
        />

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.quickActions')}</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <QuickActionCard
                key={index}
                title={action.title}
                subtitle={action.subtitle}
                icon={action.icon}
                color={action.color}
                onPress={action.onPress}
              />
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        {recentTrips.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('home.recentActivity')}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('TripHistory' as never)}>
                <Text style={styles.seeAllText}>{t('common.seeAll')}</Text>
              </TouchableOpacity>
            </View>
            {recentTrips.slice(0, 3).map((trip) => (
              <RecentActivityCard key={trip.id} trip={trip} />
            ))}
          </View>
        )}

        {/* Ethiopian Locations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.popularLocations')}</Text>
          <View style={styles.locationsContainer}>
            {[
              { name: 'Meskel Square', amharic: 'መስቀል አደባባይ', bikes: 45 },
              { name: 'Bole Airport', amharic: 'ቦሌ አየር ማረፊያ', bikes: 23 },
              { name: 'Piazza', amharic: 'ፒያሳ', bikes: 67 },
            ].map((location, index) => (
              <TouchableOpacity
                key={index}
                style={styles.locationCard}
                onPress={() => navigation.navigate('Map' as never, { location } as never)}
              >
                <Icon name="location-on" size={20} color={colors.primary} />
                <View style={styles.locationInfo}>
                  <Text style={styles.locationName}>{location.name}</Text>
                  <Text style={styles.locationAmharic}>{location.amharic}</Text>
                </View>
                <Text style={styles.bikeCount}>{location.bikes}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  flagBanner: {
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  flagText: {
    color: colors.white,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  seeAllText: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  locationsContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.sm,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  locationInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  locationName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
  },
  locationAmharic: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  bikeCount: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
});

export default HomeScreen;