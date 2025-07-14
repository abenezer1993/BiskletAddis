import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface Transaction {
  id: string;
  type: 'ride' | 'topup' | 'refund';
  amount: number;
  description: string;
  date: string;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed';
}

const WalletScreen: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const quickTopUpAmounts = [50, 100, 200, 500];

  const paymentMethods = [
    {
      id: 'telebirr',
      name: 'Telebirr',
      icon: '📱',
      description: 'Ethiopia\'s leading mobile payment',
      isPopular: true,
    },
    {
      id: 'cbe_birr',
      name: 'CBE Birr',
      icon: '🏦',
      description: 'Commercial Bank of Ethiopia',
      isPopular: true,
    },
    {
      id: 'dashen_bank',
      name: 'Dashen Bank',
      icon: '💳',
      description: 'Mobile & Online Banking',
      isPopular: false,
    },
    {
      id: 'awash_bank',
      name: 'Awash Bank',
      icon: '🏛️',
      description: 'Digital Banking Services',
      isPopular: false,
    },
  ];

  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'ride',
      amount: -15.50,
      description: 'Trip to Meskel Square',
      date: '2024-01-07 14:30',
      paymentMethod: 'Wallet',
      status: 'completed',
    },
    {
      id: '2',
      type: 'topup',
      amount: 100.00,
      description: 'Wallet Top-up',
      date: '2024-01-07 10:15',
      paymentMethod: 'Telebirr',
      status: 'completed',
    },
    {
      id: '3',
      type: 'ride',
      amount: -25.00,
      description: 'Trip to Bole Airport',
      date: '2024-01-06 16:45',
      paymentMethod: 'Wallet',
      status: 'completed',
    },
    {
      id: '4',
      type: 'topup',
      amount: 50.00,
      description: 'Wallet Top-up',
      date: '2024-01-05 09:20',
      paymentMethod: 'CBE Birr',
      status: 'completed',
    },
  ];

  const handleTopUp = (amount: number, paymentMethod: string) => {
    Alert.alert(
      'Confirm Top-up',
      `Top up ETB ${amount} using ${paymentMethod}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            Alert.alert('Success', `ETB ${amount} has been added to your wallet!`);
          },
        },
      ]
    );
  };

  const formatCurrency = (amount: number) => {
    return `ETB ${Math.abs(amount).toFixed(2)}`;
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'ride':
        return 'pedal-bike';
      case 'topup':
        return 'add-circle';
      case 'refund':
        return 'refresh';
      default:
        return 'account-balance-wallet';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'ride':
        return colors.error;
      case 'topup':
        return colors.success;
      case 'refund':
        return colors.primary;
      default:
        return colors.text.secondary;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Wallet Balance Card */}
        <LinearGradient
          colors={[colors.primary, colors.accent]}
          style={styles.balanceCard}
        >
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>{t('wallet.balance')}</Text>
            <Icon name="account-balance-wallet" size={24} color={colors.white} />
          </View>
          <Text style={styles.balanceAmount}>
            {formatCurrency(user?.wallet_balance || 0)}
          </Text>
          <View style={styles.flagContainer}>
            <Text style={styles.flag}>🇪🇹</Text>
            <Text style={styles.currencyNote}>Ethiopian Birr</Text>
          </View>
        </LinearGradient>

        {/* Quick Top-up */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('wallet.topUp')}</Text>
          <View style={styles.quickAmountsGrid}>
            {quickTopUpAmounts.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={[
                  styles.quickAmountButton,
                  selectedAmount === amount && styles.quickAmountButtonSelected,
                ]}
                onPress={() => setSelectedAmount(amount)}
              >
                <Text
                  style={[
                    styles.quickAmountText,
                    selectedAmount === amount && styles.quickAmountTextSelected,
                  ]}
                >
                  ETB {amount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('wallet.paymentMethods')}</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={styles.paymentMethodCard}
              onPress={() => {
                if (selectedAmount) {
                  handleTopUp(selectedAmount, method.name);
                } else {
                  Alert.alert('Select Amount', 'Please select an amount to top up first.');
                }
              }}
            >
              <View style={styles.paymentMethodInfo}>
                <Text style={styles.paymentMethodIcon}>{method.icon}</Text>
                <View style={styles.paymentMethodDetails}>
                  <View style={styles.paymentMethodHeader}>
                    <Text style={styles.paymentMethodName}>{method.name}</Text>
                    {method.isPopular && (
                      <View style={styles.popularBadge}>
                        <Text style={styles.popularText}>Popular</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.paymentMethodDescription}>{method.description}</Text>
                </View>
              </View>
              <Icon name="chevron-right" size={24} color={colors.text.secondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Transaction History */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('wallet.history')}</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionIcon}>
                <Icon
                  name={getTransactionIcon(transaction.type)}
                  size={24}
                  color={getTransactionColor(transaction.type)}
                />
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionDescription}>{transaction.description}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
                <Text style={styles.transactionMethod}>via {transaction.paymentMethod}</Text>
              </View>
              <View style={styles.transactionAmount}>
                <Text
                  style={[
                    styles.transactionAmountText,
                    { color: transaction.amount > 0 ? colors.success : colors.error },
                  ]}
                >
                  {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        transaction.status === 'completed'
                          ? colors.success
                          : transaction.status === 'pending'
                          ? colors.warning
                          : colors.error,
                    },
                  ]}
                >
                  <Text style={styles.statusText}>{transaction.status}</Text>
                </View>
              </View>
            </View>
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
  balanceCard: {
    margin: spacing.lg,
    padding: spacing.xl,
    borderRadius: 16,
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  balanceLabel: {
    fontSize: typography.sizes.md,
    color: colors.white,
    opacity: 0.9,
  },
  balanceAmount: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    fontSize: 20,
    marginRight: spacing.xs,
  },
  currencyNote: {
    fontSize: typography.sizes.sm,
    color: colors.white,
    opacity: 0.9,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
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
    marginBottom: spacing.md,
  },
  seeAllText: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
  quickAmountsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAmountButton: {
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.sm,
    width: '48%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  quickAmountButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  quickAmountText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
  },
  quickAmountTextSelected: {
    color: colors.primary,
  },
  paymentMethodCard: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  paymentMethodDetails: {
    flex: 1,
  },
  paymentMethodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  paymentMethodName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semiBold,
    color: colors.text.primary,
    marginRight: spacing.sm,
  },
  popularBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 8,
  },
  popularText: {
    fontSize: typography.sizes.xs,
    color: colors.white,
    fontWeight: typography.weights.medium,
  },
  paymentMethodDescription: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  transactionCard: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  transactionDate: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  transactionMethod: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semiBold,
    marginBottom: spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: typography.sizes.xs,
    color: colors.white,
    fontWeight: typography.weights.medium,
  },
});

export default WalletScreen;