// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-xhr-backend';

import frTranslation from './locales/fr/translation.json';

i18n
  .use(Backend) // For loading translations from a server or static files
  .use(LanguageDetector) // Automatically detect user language
  .use(initReactI18next) // Bind i18n to react
  .init({
    fallbackLng: 'fr', // Default language if the detected language is not available
    debug: true,
    resources: {
      fr: {
        translation: frTranslation,
      },
    },
    interpolation: {
      escapeValue: false, // React already escapes strings
    },
  });

export default i18n;
