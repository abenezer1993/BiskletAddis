import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'react-native-localize';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, options?: any) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const [language, setLanguageState] = useState('en');

  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('user_language');
      if (savedLanguage) {
        setLanguageState(savedLanguage);
        i18n.changeLanguage(savedLanguage);
      } else {
        // Use device language if available
        const deviceLocales = getLocales();
        const deviceLanguage = deviceLocales[0]?.languageCode;
        if (['en', 'am', 'or'].includes(deviceLanguage)) {
          setLanguageState(deviceLanguage);
          i18n.changeLanguage(deviceLanguage);
        }
      }
    } catch (error) {
      console.error('Error loading saved language:', error);
    }
  };

  const setLanguage = async (lang: string) => {
    try {
      setLanguageState(lang);
      await i18n.changeLanguage(lang);
      await AsyncStorage.setItem('user_language', lang);
    } catch (error) {
      console.error('Error setting language:', error);
    }
  };

  const value = {
    language,
    setLanguage,
    t,
    isRTL: language === 'ar', // For future Arabic support
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};