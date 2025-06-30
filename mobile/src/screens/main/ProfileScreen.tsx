import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleLanguageChange = () => {
    Alert.alert(
      'Select Language',
      'Choose your preferred language',
      [
        { text: 'English', onPress: () => setLanguage('en') },
        { text: 'አማርኛ (Amharic)', onPress: () => setLanguage('am') },
        { text: 'Afaan Oromoo (Oromo)', onPress: () => setLanguage('or') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const getLanguageDisplay = () => {
    switch (language) {
      case 'am': return 'አማርኛ (Amharic)';
      case 'or': return 'Afaan Oromoo (Oromo)';
      default: return 'English';
    }
  };

  const getSubscriptionDisplay = () => {
    if (!user) return 'Not Available';
    
    switch (user.subscription_type) {
      case 'pay_per_ride': return 'Pay Per Ride';
      case 'daily': return 'Daily Pass';
      case 'weekly': return 'Weekly Pass';
      case 'monthly': return 'Monthly Pass';
      case 'annual': return 'Annual Pass';
      case 'corporate': return 'Corporate Plan';
      case 'student': return 'Student Plan';
      default: return 'Pay Per Ride';
    }
  };

  const menuItems = [
    {
      title: t('profile.settings'),
      icon: 'settings',
      items: [
        {
          title: t('profile.language'),
          icon: 'language',
          value: getLanguageDisplay(),
          onPress: handleLanguageChange,
        },
        {
          title: t('profile.notifications'),
          icon: 'notifications',
          value: <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: colors.lightGray, true: colors.primaryLight }}
            thumbColor={notificationsEnabled ? colors.primary : colors.gray}
          />,
        },
        {
          title: 'Location Services',
          icon: 'location-on',
          value: <Switch
            value={locationEnabled}
            onValueChange={setLocationEnabled}
            trackColor={{ false: colors.lightGray, true: colors.primaryLight }}
            thumbColor={locationEnabled ? colors.primary : colors.gray}
          />,
        },
      ],
    },
    {
      title: 'Account',
      icon: 'person',
      items: [
        {
          title: 'Edit Profile',
          icon: 'edit',
          onPress: () => navigation.navigate('EditProfile' as never),
        },
        {
          title: 'Subscription',
          icon: 'card-membership',
          value: getSubscriptionDisplay(),
          onPress: () => navigation.navigate('Subscription' as never),
        },
        {
          title: 'Payment Methods',
          icon: 'credit-card',
          onPress: () => navigation.navigate('PaymentMethods' as never),
        },
      ],
    },
    {
      title: t('profile.help'),
      icon: 'help',
      items: [
        {
          title: 'Contact Support',
          icon: 'support-agent',
          onPress: () => Alert.alert('Contact Support', 'Call +251-11-123-4567 or email support@bisklet.et'),
        },
        {
          title: 'FAQ',
          icon: 'question-answer',
          onPress: () => navigation.navigate('FAQ' as never),
        },
        {
          title: 'Terms & Privacy',
          icon: 'description',
          onPress: () => navigation.navigate('Terms' as never),
        },
        {
          title: 'About Bisklet',
          icon: 'info',
          onPress: () => navigation.navigate('About' as never),
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.accent]}
        style={styles.header}
      >
        <View style={styles.profileInfo}>
          <View style={styles.profileImageContainer}>
            <Text style={styles.profileInitials}>
              {user?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
            </Text>
          </View>
          <View style={styles.profileDetails}>
            <Text style={styles.profileName}>{user?.full_name || 'User'}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
            <View style={styles.profileBadge}>
              <Text style={styles.profileBadgeText}>
                {user?.user_role?.replace(/_/g, ' ') || 'Customer'}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user?.total_rides || 0}</Text>
            <Text style={styles.statLabel}>Total Rides</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>ETB {user?.wallet_balance?.toFixed(2) || '0.00'}</Text>
            <Text style={styles.statLabel}>Wallet Balance</Text>
          </View>
        </View>

        {menuItems.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name={section.icon as any} size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={styles.menuItem}
                onPress={item.onPress}
                disabled={!item.onPress}
              >
                <View style={styles.menuItemLeft}>
                  <Icon name={item.icon as any} size={20} color={colors.text.secondary} />
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                </View>
                
                <View style={styles.menuItemRight}>
                  {typeof item.value === 'string' ? (
                    <Text style={styles.menuItemValue}>{item.value}</Text>
                  ) : (
                    item.value
                  )}
                  {item.onPress && <Icon name="chevron-right" size={20} color={colors.text.secondary} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Icon name="logout" size={20} color={colors.error} />
          <Text style={styles.signOutText}>{t('profile.logout')}</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Bisklet v1.0.0</Text>
          <Text style={styles.footerText}>🇪🇹 Ethiopian Bike Sharing</Text>
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
  header: {
    paddingTop: 60,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  profileInitials: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  profileEmail: {
    fontSize: typography.sizes.md,
    color: colors.white,
    opacity: 0.9,
    marginBottom: spacing.sm,
  },
  profileBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  profileBadgeText: {
    fontSize: typography.sizes.sm,
    color: colors.white,
    textTransform: 'capitalize',
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: colors.lightGray,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: spacing.md,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semiBold,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTitle: {
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    marginLeft: spacing.md,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemValue: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginRight: spacing.sm,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.lg,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  signOutText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.error,
    marginLeft: spacing.sm,
  },
  footer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  footerText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
});

export default ProfileScreen;