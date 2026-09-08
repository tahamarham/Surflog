// src/i18n.ts
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 1. Tell Java/TypeScript where your 'scripts' are by importing them
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';

// 2. Create the 'resources' object mapping language codes to the actual files
const resources = {
  en: { translation: en },
  fr: { translation: fr },
  es: { translation: es },
};

// 3. Initialize the director with instructions
i18n
  .use(initReactI18next) // Pass the director to react-i18next
  .init({
    resources, // Use the dictionaries we imported above
    
    // Automatically detect the phone's native language!
    // (e.g., if the phone is set to French, it boots in French)
    lng: Localization.getLocales()[0]?.languageCode ?? 'en', 
    
    // If a translation key is missing in Spanish, fall back to English
    fallbackLng: 'en', 
    
    interpolation: {
      escapeValue: false, // React already escapes values to prevent XSS attacks
    },
  });

export default i18n;