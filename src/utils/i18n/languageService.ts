import i18next from 'i18next';
import { EventEmitter } from '../events/eventEmitter';
import {
  SupportedLanguage,
  DEFAULT_LANGUAGE,
  mapToSupportedLanguage,
  languageMappings,
} from './supportedLanguages';
import {
  getLanguagePreference,
  saveLanguagePreference,
  clearLanguagePreference,
} from './languagePreferences';
import {
  detectBrowserLanguage,
  determineInitialLanguage,
  isRTLLanguage,
  getTextDirection,
} from './languageDetector';
import { languageTelemetry } from '../telemetry/languageTelemetry';
import { PreferenceStorageProvider, PreferenceSource, PreferenceSyncResult } from './userPreferences';

// Event names
export const LANGUAGE_EVENTS = {
  LANGUAGE_CHANGED: 'languageChanged',
  FALLBACK_USED: 'fallbackUsed',
  PREFERENCE_SYNCED: 'preferenceSynced',
} as const;

export interface LanguageChangeEvent {
  previousLanguage: SupportedLanguage;
  newLanguage: SupportedLanguage;
  requestedLanguage?: string;
  fallbackUsed: boolean;
}

class LanguageService extends EventEmitter {
  private currentLanguage: SupportedLanguage;
  private isChanging: boolean = false;
  private lastDetectionSource: 'preference' | 'browser' | 'default' = 'default';
  private serverStorageProvider?: PreferenceStorageProvider;

  constructor() {
    super();
    this.currentLanguage = determineInitialLanguage();
    this.setupEventListeners();

    // Record initial language detection
    const savedPreference = getLanguagePreference();
    const browserLanguage = detectBrowserLanguage();
    
    if (savedPreference) {
      this.lastDetectionSource = 'preference';
    } else {
      this.lastDetectionSource = browserLanguage ? 'browser' : 'default';
    }

    // Record initial language selection
    this.recordLanguageChange({
      previousLanguage: DEFAULT_LANGUAGE,
      newLanguage: this.currentLanguage,
      fallbackUsed: this.currentLanguage !== savedPreference && this.currentLanguage !== browserLanguage,
      requestedLanguage: savedPreference || browserLanguage || undefined,
    });
  }

  private setupEventListeners(): void {
    // Listen to i18next language changes
    i18next.on('languageChanged', (lng: string) => {
      if (this.isChanging) return; // Prevent duplicate events
      this.handleLanguageChange(lng);
    });
  }

  /**
   * Updates the HTML dir attribute based on the language direction
   */
  private updateDocumentDirection(language: string): void {
    const dir = getTextDirection(language);
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', language);
  }

  /**
   * Records a language change event in telemetry
   */
  private recordLanguageChange(event: LanguageChangeEvent): void {
    languageTelemetry.recordLanguageChange(event, this.lastDetectionSource);
  }

  /**
   * Handles the language change event and emits appropriate events
   */
  private handleLanguageChange(requestedLanguage: string): void {
    const previousLanguage = this.currentLanguage;
    let newLanguage: SupportedLanguage;
    let fallbackUsed = false;

    // Try to map the requested language to a supported one
    const mappedLanguage = mapToSupportedLanguage(requestedLanguage);
    if (mappedLanguage) {
      newLanguage = mappedLanguage;
      fallbackUsed = mappedLanguage !== requestedLanguage;
    } else {
      newLanguage = DEFAULT_LANGUAGE;
      fallbackUsed = true;
    }

    this.currentLanguage = newLanguage;
    this.updateDocumentDirection(newLanguage);

    // Create the event
    const event: LanguageChangeEvent = {
      previousLanguage,
      newLanguage,
      requestedLanguage: requestedLanguage !== newLanguage ? requestedLanguage : undefined,
      fallbackUsed,
    };

    // Record the change in telemetry
    this.recordLanguageChange(event);

    // Emit events
    this.emit(LANGUAGE_EVENTS.LANGUAGE_CHANGED, event);
    if (fallbackUsed) {
      this.emit(LANGUAGE_EVENTS.FALLBACK_USED, event);
    }
  }

  /**
   * Changes the application language with proper event handling and UI updates
   */
  public async changeLanguage(language: string): Promise<void> {
    try {
      this.isChanging = true;
      this.lastDetectionSource = 'preference';

      // Try to map the language to a supported one
      const mappedLanguage = mapToSupportedLanguage(language);
      if (!mappedLanguage) {
        throw new Error(
          `Language ${language} is not supported and cannot be mapped to a supported language. ` +
          `Supported languages are: ${Object.keys(languageMappings).join(', ')}`
        );
      }

      // Change the language in i18next
      await i18next.changeLanguage(mappedLanguage);
      
      // Save the preference if it's different from the current one
      if (mappedLanguage !== this.currentLanguage) {
        saveLanguagePreference(mappedLanguage);
      }

      // Handle the change
      this.handleLanguageChange(language);
    } finally {
      this.isChanging = false;
    }
  }

  /**
   * Gets the current language
   */
  public getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  /**
   * Gets the text direction for the current language
   */
  public getCurrentDirection(): 'ltr' | 'rtl' {
    return getTextDirection(this.currentLanguage);
  }

  /**
   * Resets the language preference to browser default
   */
  public async resetToDefault(): Promise<void> {
    clearLanguagePreference();
    const browserLanguage = detectBrowserLanguage();
    this.lastDetectionSource = browserLanguage ? 'browser' : 'default';
    await this.changeLanguage(browserLanguage || DEFAULT_LANGUAGE);
  }

  /**
   * Checks if a language code would require a fallback
   */
  public wouldUseFallback(language: string): boolean {
    const mappedLanguage = mapToSupportedLanguage(language);
    return mappedLanguage !== language;
  }

  /**
   * Gets the fallback chain for a given language
   */
  public getFallbackChain(language: string): string[] {
    const mappedLanguage = mapToSupportedLanguage(language);
    if (!mappedLanguage) {
      return [DEFAULT_LANGUAGE];
    }

    return mappedLanguage === 'pt-BR' 
      ? ['pt-BR', 'en-US']
      : [mappedLanguage, DEFAULT_LANGUAGE];
  }

  /**
   * Gets telemetry statistics about language usage
   */
  public getTelemetryStats() {
    return languageTelemetry.getStatistics();
  }

  /**
   * Sets the server-side storage provider for user preferences
   * This should be called when user authentication is implemented
   */
  public setServerStorageProvider(provider: PreferenceStorageProvider): void {
    this.serverStorageProvider = provider;
  }

  /**
   * Syncs preferences with the server when a user logs in
   * @param userId - The ID of the logged-in user
   * @returns The result of the sync operation
   */
  public async syncWithServer(userId: string): Promise<PreferenceSyncResult | null> {
    if (!this.serverStorageProvider) {
      console.warn('No server storage provider set for language preferences');
      return null;
    }

    try {
      const serverPreferences = await this.serverStorageProvider.getUserPreferences(userId);
      const localPreference = getLanguagePreference();

      if (!serverPreferences) {
        // No server preferences, save local if exists
        if (localPreference) {
          await this.serverStorageProvider.saveUserPreferences(userId, {
            language: localPreference,
            lastUpdated: new Date(),
          });
          return {
            source: PreferenceSource.LOCAL,
            preferences: { language: localPreference, lastUpdated: new Date() },
          };
        }
        return null;
      }

      // If we have both, use the most recent
      if (localPreference) {
        const result: PreferenceSyncResult = {
          source: PreferenceSource.SERVER,
          preferences: serverPreferences,
          conflictResolved: true,
        };

        // Use server preference
        await this.changeLanguage(serverPreferences.language);
        
        this.emit(LANGUAGE_EVENTS.PREFERENCE_SYNCED, result);
        return result;
      }

      // Only have server preference
      await this.changeLanguage(serverPreferences.language);
      return {
        source: PreferenceSource.SERVER,
        preferences: serverPreferences,
      };
    } catch (error) {
      console.error('Failed to sync language preferences with server:', error);
      return null;
    }
  }
}

// Export a singleton instance
export const languageService = new LanguageService(); 