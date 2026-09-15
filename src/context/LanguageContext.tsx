import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { LanguageCode } from '../types/portfolio';

interface LanguageContextProps {
  lang: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);
const LANGUAGE_STORAGE_KEY = 'portfolio-language';

const getInitialLanguage = (): LanguageCode => {
  try {
    const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage === 'en' || savedLanguage === 'es') return savedLanguage;
  } catch {
    // Storage can be unavailable in privacy-focused browser modes.
  }

  return window.navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en';
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<LanguageCode>('en');

  useEffect(() => { setLang(getInitialLanguage()); }, []);

  const setLanguage = (language: LanguageCode) => {
    setLang(language);
  };

  useEffect(() => {
    document.documentElement.lang = lang;

    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch {
      // The language selection still works when storage is unavailable.
    }
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/only-export-components */
export const useLanguage = (): LanguageContextProps => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
