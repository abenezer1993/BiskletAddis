import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';

import en from './locales/en.json';
import am from './locales/am.json';
import or from './locales/or.json';

const deviceLanguage = getLocales()[0]?.languageCode || 'en';

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    lng: deviceLanguage,
    fallbackLng: 'en',
    debug: __DEV__,
    
    resources: {
      en: { translation: en },
      am: { translation: am },
      or: { translation: or },
    },
    
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;