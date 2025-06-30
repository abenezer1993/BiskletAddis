import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

const { width, height } = Dimensions.get('window');

const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Welcome to Bisklet',
      titleAmharic: 'ወደ ቢስክሌት እንኳን ደህና መጡ',
      subtitle: 'Ethiopian Bike Sharing Revolution',
      subtitleAmharic: 'የኢትዮጵያ ብስክሌት መጋራት አብዮት',
      description: 'Discover eco-friendly transportation in Addis Ababa',
      descriptionAmharic: 'በአዲስ አበባ ውስጥ ለአካባቢ ተስማሚ የትራንስፖርት አገልግሎት ያግኙ',
      image: 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      title: 'Find & Unlock Bikes',
      titleAmharic: 'ብስክሌቶችን ፈልግና ክፈት',
      subtitle: 'Easy QR Code Scanning',
      subtitleAmharic: 'ቀላል QR ኮድ ስካን',
      description: 'Locate nearby bikes and unlock them instantly with QR codes',
      descriptionAmharic: 'በአቅራቢያ ያሉ ብስክሌቶችን ፈልግና በQR ኮድ በፍጥነት ክፈት',
      image: 'https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      title: 'Ethiopian Payment Methods',
      titleAmharic: 'የኢትዮጵያ የክፍያ ዘዴዎች',
      subtitle: 'Telebirr, CBE Birr & More',
      subtitleAmharic: 'ቴሌብር፣ ሲቢኢ ብርና ሌሎች',
      description: 'Pay with your favorite Ethiopian payment methods',
      descriptionAmharic: 'በሚወዷቸው የኢትዮጵያ የክፍያ ዘዴዎች ይክፈሉ',
      image: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigation.navigate('LanguageSelection' as never);
    }
  };

  const handleSkip = () => {
    navigation.navigate('LanguageSelection' as never);
  };

  return (
    <LinearGradient
      colors={[colors.primary, colors.accent]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Image
          source={{ uri: slides[currentSlide].image }}
          style={styles.image}
          resizeMode="cover"
        />
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>{slides[currentSlide].title}</Text>
          <Text style={styles.titleAmharic}>{slides[currentSlide].titleAmharic}</Text>
          
          <Text style={styles.subtitle}>{slides[currentSlide].subtitle}</Text>
          <Text style={styles.subtitleAmharic}>{slides[currentSlide].subtitleAmharic}</Text>
          
          <Text style={styles.description}>{slides[currentSlide].description}</Text>
          <Text style={styles.descriptionAmharic}>{slides[currentSlide].descriptionAmharic}</Text>
        </View>

        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentSlide ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
            <Text style={styles.nextText}>
              {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xl,
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    borderRadius: 20,
    marginTop: spacing.xl,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  titleAmharic: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.md,
    opacity: 0.9,
  },
  subtitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semiBold,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitleAmharic: {
    fontSize: typography.sizes.md,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.md,
    opacity: 0.8,
  },
  description: {
    fontSize: typography.sizes.md,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xs,
  },
  descriptionAmharic: {
    fontSize: typography.sizes.sm,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.8,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: colors.white,
  },
  inactiveDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: spacing.lg,
  },
  skipButton: {
    padding: spacing.md,
  },
  skipText: {
    fontSize: typography.sizes.md,
    color: colors.white,
    opacity: 0.8,
  },
  nextButton: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 25,
  },
  nextText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semiBold,
    color: colors.primary,
  },
});

export default OnboardingScreen;