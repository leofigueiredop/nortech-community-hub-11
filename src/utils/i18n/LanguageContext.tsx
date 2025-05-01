import React, { createContext, useContext, useState } from 'react';
import { languageService } from './languageService';
import type { SupportedLanguage } from './supportedLanguages';

type LanguageContextType = {
  language: SupportedLanguage;
  setLanguage: (lang: string) => Promise<void>;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en-US',
  setLanguage: async () => {},
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<SupportedLanguage>(languageService.getCurrentLanguage());

  const handleLanguageChange = async (lang: string) => {
    try {
      await languageService.changeLanguage(lang);
      setLanguage(languageService.getCurrentLanguage());
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleLanguageChange }}>
      {children}
    </LanguageContext.Provider>
  );
}; 