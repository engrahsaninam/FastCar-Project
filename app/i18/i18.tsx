'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './Store';

// Import your translation files
import enTranslations from '../locales/enTranslation.json';
import frTranslations from '../locales/frTranslation.json';
import arTranslations from '../locales/arTranslation.json';

export const languageResources = {
    en: { translation: enTranslations },
    fr: { translation: frTranslations },
    ch: { translation: arTranslations }
};

// Initialize i18next
i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: process.env.NODE_ENV === 'development',
        fallbackLng: 'en',
        supportedLngs: ['en', 'fr', 'ch'],
        resources: languageResources,
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
    });

// Create a component to handle language changes
export function I18nProvider({ children }: { children: React.ReactNode }) {
    const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);

    useEffect(() => {
        i18n.changeLanguage(currentLanguage);
    }, [currentLanguage]);

    return <>{children}</>;
}

export default i18n;