import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Header from '../../components/Header';
import WalletBalanceCard from '../../components/WalletBalanceCard';
import ActiveTripCard from '../../components/ActiveTripCard';
import QuickActionCard from '../../components/QuickActionCard';
import RecentActivityCard from '../../components/RecentActivityCard';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTrip, setActiveTrip] = useState(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('home.goodMorning');
    if (hour < 17) return t('home.goodAfternoon');
    return t('home.goodEvening');
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const quickActions = [
    {
      id: 'find-bike',
      title: t('home.findBike'),
      subtitle: t('home.findBikeSubtitle'),
      icon: 'search',
      color: colors.primary,
      onPress: () => navigation.navigate('Map' as never),
    },
    {
      id: 'scan-qr',
      title: t('home.scanQR'),
      subtitle: t('home.scanQRSubtitle'),
      icon: 'qr-code-scanner',
      color: colors.accent,
      onPress: () => {
        // Navigate to QR scanner
        console.log('Open QR Scanner');
      },
    },
    {
      id: 'trip-history',
      title: t('home.tripHistory'),
      subtitle: t('home.tripHistorySubtitle'),
      icon: 'history',
      color: colors.success,
      onPress: () => {
        // Navigate to trip history
        console.log('Open Trip History');
      },
    },
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'trip_completed',
      title: 'Trip to Meskel Square',
      subtitle: 'መስቀል አደባባይ',
      time: '2 hours ago',
      amount: 'ETB 15.50',
      icon: 'check-circle',
      color: colors.success,
    },
    {
      id: '2',
      type: 'wallet_topup',
      title: 'Wallet Top-up',
      subtitle: 'via Telebirr',
      time: '1 day ago',
      amount: 'ETB 100.00',
      icon: 'account-balance-wallet',
      color: colors.primary,
    },
    {
      id: '3',
      type: 'trip_completed',
      title: 'Trip to Bole Airport',
      subtitle: 'ቦሌ አየር ማረፊያ',
      time: '2 days ago',
      amount: 'ETB 25.00',
      icon: 'check-circle',
      color: colors.success,
    },
  ];

  const popularLocations = [
    { name: 'Meskel Square', nameAmharic: 'መስቀል አደባባይ', bikes: 15 },
    { name: 'Bole Airport', nameAmharic: 'ቦሌ አየር ማረፊያ', bikes: 8 },
    { name: 'Piazza', nameAmharic: 'ፒያሳ', bikes: 12 },
    { name: 'Mexico Square', nameAmharic: 'ሜክሲኮ አደባባይ', bikes: 6 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Welcome Section */}
        <LinearGradient
          colors={[colors.primary, colors.accent]}
          style={styles.welcomeSection}
        >
          <View style={styles.welcomeContent}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{user?.full_name || 'User'}</Text>
            <Text style={styles.welcomeSubtitle}>{t('home.welcomeBack')}</Text>
            <View style={styles.locationContainer}>
              <Icon name="location-on" size={16} color={colors.white} />
              <Text style={styles.locationText}>{t('home.servingAddis')}</Text>
              <Text style={styles.flag}>🇪🇹</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Wallet Balance */}
        <View style={styles.section}>
          <WalletBalanceCard
            balance={user?.wallet_balance || 0}
            onTopUp={() => navigation.navigate('Wallet' as never)}
          />
        </View>

        {/* Active Trip */}
        {activeTrip && (
          <View style={styles.section}>
            <ActiveTripCard
              trip={activeTrip}
              onViewDetails={() => navigation.navigate('Ride' as never)}
            />
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.quickActions')}</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <QuickActionCard
                key={action.id}
                title={action.title}
                subtitle={action.subtitle}
                icon={action.icon}
                color={action.color}
                onPress={action.onPress}
              />
            ))}
          </View>
        </View>

        {/* Popular Locations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.popularLocations')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Map' as never)}>
              <Text style={styles.seeAllText}>{t('common.seeAll')}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {popularLocations.map((location, index) => (
              <TouchableOpacity
                key={index}
                style={styles.locationCard}
                onPress={() => navigation.navigate('Map' as never)}
              >
                <Icon name="location-on" size={24} color={colors.primary} />
                <Text style={styles.locationName}>{location.name}</Text>
                <Text style={styles.locationNameAmharic}>{location.nameAmharic}</Text>
                <View style={styles.bikeCount}>
                  <Icon name="pedal-bike" size={16} color={colors.success} />
                  <Text style={styles.bikeCountText}>{location.bikes} bikes</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.recentActivity')}</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>{t('common.seeAll')}</Text>
            </TouchableOpacity>
          </View>
          {recentActivities.map((activity) => (
            <RecentActivityCard
              key={activity.id}
              activity={activity}
              onPress={() => console.log('Activity pressed:', activity.id)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  welcomeSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  welcomeContent: {
    alignItems: 'center',
  },
  greeting: {
    fontSize: typography.sizes.lg,
    color: colors.white,
    opacity: 0.9,
  },
  userName: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.white,
    marginTop: spacing.xs,
  },
  welcomeSubtitle: {
    fontSize: typography.sizes.md,
    color: colors.white,
    opacity: 0.9,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  locationText: {
    fontSize: typography.sizes.sm,
    color: colors.white,
    marginLeft: spacing.xs,
    marginRight: spacing.xs,
  },
  flag: {
    fontSize: 16,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semiBold,
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
  locationCard: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 12,
    marginRight: spacing.md,
    alignItems: 'center',
    minWidth: 120,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  locationName: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  locationNameAmharic: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  bikeCount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  bikeCountText: {
    fontSize: typography.sizes.xs,
    color: colors.success,
    marginLeft: spacing.xs,
    fontWeight: typography.weights.medium,
  },
});

export default HomeScreen;