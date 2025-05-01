import { SupportedLanguage } from './languageDetector';

/**
 * Interface for server-side user preferences
 */
export interface UserPreferences {
  language: SupportedLanguage;
  lastUpdated: Date;
}

/**
 * Interface for the server-side preference storage provider
 * This will be implemented in the future when user accounts are added
 */
export interface PreferenceStorageProvider {
  /**
   * Get user preferences from the server
   * @param userId - The ID of the user
   */
  getUserPreferences(userId: string): Promise<UserPreferences | null>;

  /**
   * Save user preferences to the server
   * @param userId - The ID of the user
   * @param preferences - The preferences to save
   */
  saveUserPreferences(userId: string, preferences: UserPreferences): Promise<void>;

  /**
   * Clear user preferences from the server
   * @param userId - The ID of the user
   */
  clearUserPreferences(userId: string): Promise<void>;
}

/**
 * Hook for future implementation of server-side preference storage
 * This is a placeholder that will be implemented when user accounts are added
 */
export interface UseServerPreferences {
  /**
   * The current user's preferences
   */
  preferences: UserPreferences | null;

  /**
   * Whether the preferences are being loaded
   */
  isLoading: boolean;

  /**
   * Any error that occurred while loading preferences
   */
  error: Error | null;

  /**
   * Save preferences to the server
   * @param preferences - The preferences to save
   */
  savePreferences(preferences: UserPreferences): Promise<void>;

  /**
   * Clear preferences from the server
   */
  clearPreferences(): Promise<void>;

  /**
   * Sync local preferences with server
   * This will be called when a user logs in
   */
  syncWithServer(): Promise<void>;
}

/**
 * Enum for preference storage source
 * Used to track where the current preferences came from
 */
export enum PreferenceSource {
  LOCAL = 'local',
  SERVER = 'server',
  DEFAULT = 'default'
}

/**
 * Interface for the preference sync result
 * Used when syncing local and server preferences
 */
export interface PreferenceSyncResult {
  source: PreferenceSource;
  preferences: UserPreferences;
  conflictResolved?: boolean;
} 