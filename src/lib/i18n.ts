import { TFunction } from 'i18next';

// Helper function to safely translate keys
export function safeTranslate(t: TFunction, key: string, options?: Record<string, any>): string {
  try {
    return t(key, options) as string;
  } catch (error) {
    console.warn(`Translation key not found: ${key}`);
    return key;
  }
} 