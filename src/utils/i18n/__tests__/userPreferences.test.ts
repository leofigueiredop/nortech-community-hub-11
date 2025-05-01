import { describe, it, expect } from 'vitest';
import {
  UserPreferences,
  PreferenceStorageProvider,
  UseServerPreferences,
  PreferenceSource,
  PreferenceSyncResult,
} from '../userPreferences';

describe('UserPreferences Types', () => {
  it('should allow creating valid user preferences', () => {
    const preferences: UserPreferences = {
      language: 'en-US',
      lastUpdated: new Date(),
    };

    expect(preferences.language).toBe('en-US');
    expect(preferences.lastUpdated).toBeInstanceOf(Date);
  });

  it('should enforce supported languages', () => {
    // @ts-expect-error - fr-FR is not a supported language
    const invalidPreferences: UserPreferences = {
      language: 'fr-FR',
      lastUpdated: new Date(),
    };

    expect(invalidPreferences).toBeDefined();
  });
});

describe('PreferenceStorageProvider Interface', () => {
  it('should define required methods', () => {
    const mockProvider: PreferenceStorageProvider = {
      getUserPreferences: async (userId: string) => {
        return {
          language: 'pt-BR',
          lastUpdated: new Date(),
        };
      },
      saveUserPreferences: async (userId: string, preferences: UserPreferences) => {
        // Mock implementation
      },
      clearUserPreferences: async (userId: string) => {
        // Mock implementation
      },
    };

    expect(mockProvider.getUserPreferences).toBeDefined();
    expect(mockProvider.saveUserPreferences).toBeDefined();
    expect(mockProvider.clearUserPreferences).toBeDefined();
  });
});

describe('UseServerPreferences Interface', () => {
  it('should define required properties and methods', () => {
    const mockHook: UseServerPreferences = {
      preferences: null,
      isLoading: false,
      error: null,
      savePreferences: async (preferences: UserPreferences) => {
        // Mock implementation
      },
      clearPreferences: async () => {
        // Mock implementation
      },
      syncWithServer: async () => {
        // Mock implementation
      },
    };

    expect(mockHook.preferences).toBeNull();
    expect(mockHook.isLoading).toBe(false);
    expect(mockHook.error).toBeNull();
    expect(mockHook.savePreferences).toBeDefined();
    expect(mockHook.clearPreferences).toBeDefined();
    expect(mockHook.syncWithServer).toBeDefined();
  });
});

describe('PreferenceSource Enum', () => {
  it('should define all sources', () => {
    expect(PreferenceSource.LOCAL).toBe('local');
    expect(PreferenceSource.SERVER).toBe('server');
    expect(PreferenceSource.DEFAULT).toBe('default');
  });
});

describe('PreferenceSyncResult Interface', () => {
  it('should allow creating valid sync results', () => {
    const result: PreferenceSyncResult = {
      source: PreferenceSource.LOCAL,
      preferences: {
        language: 'en-US',
        lastUpdated: new Date(),
      },
      conflictResolved: true,
    };

    expect(result.source).toBe(PreferenceSource.LOCAL);
    expect(result.preferences.language).toBe('en-US');
    expect(result.conflictResolved).toBe(true);
  });

  it('should make conflictResolved optional', () => {
    const result: PreferenceSyncResult = {
      source: PreferenceSource.SERVER,
      preferences: {
        language: 'pt-BR',
        lastUpdated: new Date(),
      },
    };

    expect(result.conflictResolved).toBeUndefined();
  });
}); 