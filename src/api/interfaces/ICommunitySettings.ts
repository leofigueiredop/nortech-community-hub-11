export interface CommunityBasicInfo {
  id?: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  domain: string | null;
  is_private: boolean;
  category: string;
  theme_config?: Record<string, any> | null;
}

export interface GeneralSettings {
  language: string;
  timezone: string;
  dateFormat: string;
  defaultPrivacy: 'public' | 'private';
  allowGuestAccess: boolean;
  customWelcomeMessage: string;
  notificationPreferences: {
    email: boolean;
    push: boolean;
    digest: 'daily' | 'weekly' | 'never';
  };
  contentModeration: {
    autoModeration: boolean;
    requireApproval: boolean;
    profanityFilter: boolean;
  };
}

export interface ICommunitySettingsRepository {
  getGeneralSettings(communityId: string): Promise<GeneralSettings>;
  updateGeneralSettings(communityId: string, settings: Partial<GeneralSettings>): Promise<void>;
  getCommunityBasicInfo(communityId: string): Promise<CommunityBasicInfo>;
  updateCommunityBasicInfo(communityId: string, data: Partial<CommunityBasicInfo>): Promise<void>;
} 