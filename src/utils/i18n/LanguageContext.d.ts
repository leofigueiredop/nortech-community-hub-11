import { ReactNode } from 'react';
import { SupportedLanguage } from './supportedLanguages';

export interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: string) => Promise<void>;
}

export function useLanguage(): LanguageContextType;

export interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps>; 