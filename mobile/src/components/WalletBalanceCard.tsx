import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import { useLanguage } from '../contexts/LanguageContext';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface WalletBalanceCardProps {
  balance: number;
  onPress: () => void;
}

const WalletBalanceCard: React.FC<WalletBalanceCardProps> = ({ balance, onPress }) => {
  const { t } = useLanguage();

  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        colors={[colors.accent, colors.secondaryDark]}
        style={styles.container}
      >
        <View style={styles.content}>
          <View style={styles.balanceInfo}>
            <Text style={styles.balanceLabel}>{t('wallet.balance')}</Text>
            <Text style={styles.balanceAmount}>ETB {balance.toFixed(2)}</Text>
          </View>
          
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.topUpButton} onPress={onPress}>
              <Icon name="add" size={16} color={colors.white} />
              <Text style={styles.topUpButtonText}>{t('wallet.topUp')}</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.decoration}>
          <Icon name="account-balance-wallet" size={60} color="rgba(255,255,255,0.2)" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceInfo: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: typography.sizes.sm,
    color: colors.white,
    opacity: 0.9,
    marginBottom: spacing.xs,
  },
  balanceAmount: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
  actionContainer: {
    alignItems: 'flex-end',
  },
  topUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 20,
  },
  topUpButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.white,
    marginLeft: spacing.xs,
  },
  decoration: {
    position: 'absolute',
    right: -10,
    bottom: -10,
  },
});

export default WalletBalanceCard;