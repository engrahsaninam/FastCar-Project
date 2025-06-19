'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type LanguageContextType = {
    currentLanguage: string;
    changeLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType>({
    currentLanguage: 'en',
    changeLanguage: () => { },
});

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const { i18n } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState('en');

    useEffect(() => {
        setMounted(true);
        const savedLang = typeof window !== 'undefined' ? localStorage.getItem('i18nextLng') : 'en';
        setCurrentLanguage(savedLang || 'en');
    }, []);

    const changeLanguage = (lang: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('i18nextLng', lang);
        }
        i18n.changeLanguage(lang);
        setCurrentLanguage(lang);
    };

    if (!mounted) {
        return null; // or a loading spinner
    }

    return (
        <LanguageContext.Provider value={{ currentLanguage, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
} 