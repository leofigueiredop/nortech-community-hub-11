
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

type Language = 'en' | 'pt-BR';

type LanguageContextType = {
  language: Language;
  changeLanguage: (lang: Language) => Promise<void>;
  isChanging: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState<Language>((i18n.language?.startsWith('pt') ? 'pt-BR' : 'en') as Language);
  const [isChanging, setIsChanging] = useState(false);

  // Initialize language from local storage or browser preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage') as Language | null;
    
    if (savedLanguage && ['en', 'pt-BR'].includes(savedLanguage)) {
      changeLanguage(savedLanguage);
    } else {
      const browserLang = navigator.language;
      const lang = browserLang.startsWith('pt') ? 'pt-BR' : 'en';
      changeLanguage(lang);
    }
  }, []);

  const changeLanguage = async (lang: Language) => {
    try {
      setIsChanging(true);
      await i18n.changeLanguage(lang);
      setLanguage(lang);
      localStorage.setItem('preferredLanguage', lang);
      
      // Show toast when language changes (except on initial load)
      if (i18n.language !== lang) {
        toast.success(i18n.t('common.languageSaved'));
      }
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, isChanging }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
