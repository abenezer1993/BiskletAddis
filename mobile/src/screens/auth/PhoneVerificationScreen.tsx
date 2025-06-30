import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

const PhoneVerificationScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { phoneNumber } = route.params as { phoneNumber: string };
  
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit verification code');
      return;
    }

    setLoading(true);
    try {
      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Verification Successful',
        'Your phone number has been verified successfully!',
        [{ text: 'OK', onPress: () => navigation.navigate('Login' as never) }]
      );
    } catch (error) {
      Alert.alert('Verification Failed', 'Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    try {
      // Simulate resend process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setResendTimer(60);
      setCanResend(false);
      
      Alert.alert('Code Sent', 'A new verification code has been sent to your phone.');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend verification code. Please try again.');
    }
  };

  const formatPhoneNumber = (phone: string) => {
    // Format +251911234567 to +251 91 123 4567
    if (phone.startsWith('+251')) {
      return phone.replace(/(\+251)(\d{2})(\d{3})(\d{4})/, '$1 $2 $3 $4');
    }
    return phone;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.accent]}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Icon name="sms" size={48} color={colors.white} />
          <Text style={styles.title}>Phone Verification</Text>
          <Text style={styles.subtitle}>ስልክ ማረጋገጫ</Text>
        </View>
      </LinearGradient>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.description}>
          We've sent a verification code to:
        </Text>
        <Text style={styles.phoneNumber}>{formatPhoneNumber(phoneNumber)}</Text>
        <Text style={styles.instruction}>
          Please enter the 6-digit code below:
        </Text>

        <View style={styles.codeContainer}>
          <TextInput
            style={styles.codeInput}
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="number-pad"
            maxLength={6}
            placeholder="------"
            placeholderTextColor={colors.text.secondary}
          />
        </View>

        <TouchableOpacity
          style={[styles.verifyButton, loading && styles.verifyButtonDisabled]}
          onPress={handleVerifyCode}
          disabled={loading}
        >
          <Text style={styles.verifyButtonText}>
            {loading ? 'Verifying...' : 'Verify Code'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.resendButton, !canResend && styles.resendButtonDisabled]}
          onPress={handleResendCode}
          disabled={!canResend}
        >
          <Text style={[styles.resendButtonText, !canResend && styles.resendButtonTextDisabled]}>
            {canResend ? 'Resend Code' : `Resend Code (${resendTimer}s)`}
          </Text>
        </TouchableOpacity>

        <View style={styles.helpContainer}>
          <Icon name="help-outline" size={20} color={colors.text.secondary} />
          <Text style={styles.helpText}>
            Didn't receive the code? Check your phone number or contact support.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.white,
    marginTop: spacing.sm,
  },
  subtitle: {
    fontSize: typography.sizes.lg,
    color: colors.white,
    marginTop: spacing.xs,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    alignItems: 'center',
  },
  description: {
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  phoneNumber: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  instruction: {
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  codeContainer: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  codeInput: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    textAlign: 'center',
    letterSpacing: 8,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  verifyButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: spacing.lg,
    width: '100%',
  },
  verifyButtonDisabled: {
    opacity: 0.6,
  },
  verifyButtonText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semiBold,
    color: colors.white,
  },
  resendButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  resendButtonDisabled: {
    opacity: 0.6,
  },
  resendButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.primary,
  },
  resendButtonTextDisabled: {
    color: colors.text.secondary,
  },
  helpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    padding: spacing.md,
    borderRadius: 12,
    marginTop: 'auto',
    marginBottom: spacing.xl,
  },
  helpText: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
});

export default PhoneVerificationScreen;