import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase, Payment } from '../../services/supabase';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

import Header from '../../components/Header';

const WalletScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const [transactions, setTransactions] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
      Alert.alert('Error', 'Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = () => {
    navigation.navigate('PaymentMethods' as never, { action: 'topup' } as never);
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'telebirr': return '📱';
      case 'cbe_birr': return '🏦';
      case 'dashen_bank': return '💳';
      case 'awash_bank': return '🏛️';
      case 'cash': return '💵';
      case 'wallet': return '💰';
      default: return '💳';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return colors.success;
      case 'pending': return colors.warning;
      case 'failed': return colors.error;
      case 'refunded': return colors.info;
      default: return colors.text.secondary;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderTransactionItem = ({ item }: { item: Payment }) => (
    <TouchableOpacity 
      style={styles.transactionItem}
      onPress={() => Alert.alert('Transaction Details', `ID: ${item.id}\nAmount: ETB ${item.amount_etb}\nStatus: ${item.status}\nDate: ${formatDate(item.created_at)}`)}
    >
      <View style={styles.transactionIcon}>
        <Text style={styles.methodIcon}>{getPaymentMethodIcon(item.payment_method)}</Text>
      </View>
      
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionType}>
          {item.payment_type === 'ride' ? 'Bike Ride' : 
           item.payment_type === 'wallet_topup' ? 'Wallet Top-up' : 'Refund'}
        </Text>
        <Text style={styles.transactionDate}>{formatDate(item.created_at)}</Text>
      </View>
      
      <View style={styles.transactionAmount}>
        <Text style={[
          styles.amountText,
          item.payment_type === 'ride' ? styles.negativeAmount : styles.positiveAmount
        ]}>
          {item.payment_type === 'ride' ? '-' : '+'} ETB {item.amount_etb.toFixed(2)}
        </Text>
        <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
          {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const paymentMethods = [
    { id: 'telebirr', name: 'Telebirr', icon: '📱' },
    { id: 'cbe_birr', name: 'CBE Birr', icon: '🏦' },
    { id: 'dashen_bank', name: 'Dashen Bank', icon: '💳' },
    { id: 'awash_bank', name: 'Awash Bank', icon: '🏛️' },
  ];

  return (
    <View style={styles.container}>
      <Header
        title={t('wallet.balance')}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.content}>
        {/* Wallet Balance Card */}
        <LinearGradient
          colors={[colors.primary, colors.accent]}
          style={styles.balanceCard}
        >
          <View style={styles.balanceContent}>
            <Text style={styles.balanceLabel}>{t('wallet.balance')}</Text>
            <Text style={styles.balanceAmount}>ETB {user?.wallet_balance?.toFixed(2) || '0.00'}</Text>
            <TouchableOpacity style={styles.topUpButton} onPress={handleTopUp}>
              <Text style={styles.topUpButtonText}>{t('wallet.topUp')}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.balanceDecoration}>
            <Icon name="account-balance-wallet" size={80} color="rgba(255,255,255,0.2)" />
          </View>
        </LinearGradient>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('wallet.paymentMethods')}</Text>
          <View style={styles.paymentMethodsContainer}>
            {paymentMethods.map((method) => (
              <TouchableOpacity 
                key={method.id}
                style={styles.paymentMethod}
                onPress={() => navigation.navigate('PaymentMethods' as never)}
              >
                <Text style={styles.paymentMethodIcon}>{method.icon}</Text>
                <Text style={styles.paymentMethodName}>{method.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Transaction History */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('wallet.history')}</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>{t('common.seeAll')}</Text>
            </TouchableOpacity>
          </View>
          
          {transactions.length > 0 ? (
            <FlatList
              data={transactions}
              renderItem={renderTransactionItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.transactionsList}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Icon name="receipt-long" size={48} color={colors.lightGray} />
              <Text style={styles.emptyStateText}>No transactions yet</Text>
            </View>
          )}
        </View>
      </View>
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
  balanceCard: {
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  balanceContent: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: typography.sizes.md,
    color: colors.white,
    opacity: 0.9,
    marginBottom: spacing.xs,
  },
  balanceAmount: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    color: colors.white,
    marginBottom: spacing.md,
  },
  topUpButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  topUpButtonText: {
    color: colors.white,
    fontWeight: typography.weights.medium,
  },
  balanceDecoration: {
    position: 'absolute',
    right: -10,
    top: -10,
    opacity: 0.2,
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
  paymentMethodsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  paymentMethod: {
    width: '23%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.sm,
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  paymentMethodIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  paymentMethodName: {
    fontSize: typography.sizes.xs,
    textAlign: 'center',
    color: colors.text.primary,
  },
  transactionsList: {
    paddingBottom: spacing.md,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    elevation: 1,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  methodIcon: {
    fontSize: 20,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  transactionDate: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semiBold,
    marginBottom: spacing.xs,
  },
  positiveAmount: {
    color: colors.success,
  },
  negativeAmount: {
    color: colors.text.primary,
  },
  statusText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  emptyStateText: {
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
});

export default WalletScreen;