import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const { login } = useAuth();
  const { t } = useLanguage();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      // Navigation will be handled by AuthContext
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Reset Password',
      'Password reset functionality will be implemented soon.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <LinearGradient
          colors={[colors.primary, colors.accent]}
          style={styles.header}
        >
          <View style={styles.logoContainer}>
            <Icon name="pedal-bike" size={64} color={colors.white} />
            <Text style={styles.title}>{t('auth.welcome')}</Text>
            <Text style={styles.subtitle}>{t('auth.subtitle')}</Text>
            <View style={styles.flagContainer}>
              <Text style={styles.flag}>🇪🇹</Text>
              <Text style={styles.flagText}>Ethiopian Bike Sharing</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>{t('auth.login')}</Text>
          
          <View style={styles.inputContainer}>
            <Icon name="email" size={20} color={colors.text.secondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={t('auth.email')}
              placeholderTextColor={colors.text.secondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color={colors.text.secondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={t('auth.password')}
              placeholderTextColor={colors.text.secondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Icon
                name={showPassword ? 'visibility-off' : 'visibility'}
                size={20}
                color={colors.text.secondary}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotPasswordText}>{t('auth.forgotPassword')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'Signing In...' : t('auth.login')}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate('Register' as never)}
          >
            <Text style={styles.registerButtonText}>
              {t('auth.dontHaveAccount')} <Text style={styles.registerLink}>{t('auth.register')}</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Ethiopian Payment Methods Preview */}
        <View style={styles.paymentPreview}>
          <Text style={styles.paymentTitle}>Supported Payment Methods</Text>
          <View style={styles.paymentMethods}>
            <View style={styles.paymentMethod}>
              <Text style={styles.paymentIcon}>📱</Text>
              <Text style={styles.paymentName}>Telebirr</Text>
            </View>
            <View style={styles.paymentMethod}>
              <Text style={styles.paymentIcon}>🏦</Text>
              <Text style={styles.paymentName}>CBE Birr</Text>
            </View>
            <View style={styles.paymentMethod}>
              <Text style={styles.paymentIcon}>💳</Text>
              <Text style={styles.paymentName}>Dashen Bank</Text>
            </View>
            <View style={styles.paymentMethod}>
              <Text style={styles.paymentIcon}>🏛️</Text>
              <Text style={styles.paymentName}>Awash Bank</Text>
            </View>
          </View>
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
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logoContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.white,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.sizes.lg,
    color: colors.white,
    marginTop: spacing.xs,
    opacity: 0.9,
    textAlign: 'center',
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  flag: {
    fontSize: 24,
    marginRight: spacing.xs,
  },
  flagText: {
    fontSize: typography.sizes.md,
    color: colors.white,
    opacity: 0.9,
  },
  formContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  formTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
  },
  eyeIcon: {
    padding: spacing.xs,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  forgotPasswordText: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    fontWeight: typography.weights.medium,
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semiBold,
    color: colors.white,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  registerButton: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  registerButtonText: {
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
  },
  registerLink: {
    color: colors.primary,
    fontWeight: typography.weights.semiBold,
  },
  paymentPreview: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  paymentTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semiBold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  paymentMethods: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  paymentMethod: {
    alignItems: 'center',
    marginHorizontal: spacing.xs,
  },
  paymentIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  paymentName: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

export default LoginScreen;