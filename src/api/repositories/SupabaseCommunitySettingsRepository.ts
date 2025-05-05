import { supabase } from '@/lib/supabase';
import { ICommunitySettingsRepository, GeneralSettings, CommunityBasicInfo } from '../interfaces/ICommunitySettings';

export class SupabaseCommunitySettingsRepository implements ICommunitySettingsRepository {
  async getGeneralSettings(communityId: string): Promise<GeneralSettings> {
    try {
      const { data: settings, error } = await supabase
        .from('community_settings')
        .select('settings_data')
        .eq('community_id', communityId)
        .eq('settings_type', 'general')
        .single();

      if (error) throw error;

      return settings?.settings_data as GeneralSettings || this.getDefaultGeneralSettings();
    } catch (error) {
      console.error('Error fetching general settings:', error);
      return this.getDefaultGeneralSettings();
    }
  }

  async updateGeneralSettings(communityId: string, settings: Partial<GeneralSettings>): Promise<void> {
    try {
      const { data: existingSettings } = await supabase
        .from('community_settings')
        .select('settings_data')
        .eq('community_id', communityId)
        .eq('settings_type', 'general')
        .single();

      const newSettings = {
        ...this.getDefaultGeneralSettings(),
        ...(existingSettings?.settings_data || {}),
        ...settings,
      };

      const { error } = await supabase
        .from('community_settings')
        .upsert({
          community_id: communityId,
          settings_type: 'general',
          settings_data: newSettings,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'community_id,settings_type'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating general settings:', error);
      throw error;
    }
  }

  async getCommunityBasicInfo(communityId: string): Promise<CommunityBasicInfo> {
    try {
      const { data: community, error } = await supabase
        .from('communities')
        .select('name, description, logo_url, banner_url, domain, is_private, category, theme_config')
        .eq('id', communityId)
        .single();

      if (error) throw error;
      if (!community) throw new Error('Community not found');

      return community as CommunityBasicInfo;
    } catch (error) {
      console.error('Error fetching community basic info:', error);
      throw error;
    }
  }

  async updateCommunityBasicInfo(communityId: string, data: Partial<CommunityBasicInfo>): Promise<void> {
    try {
      const { error } = await supabase
        .from('communities')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', communityId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating community basic info:', error);
      throw error;
    }
  }

  private getDefaultGeneralSettings(): GeneralSettings {
    return {
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      defaultPrivacy: 'public',
      allowGuestAccess: false,
      customWelcomeMessage: 'Welcome to our community!',
      notificationPreferences: {
        email: true,
        push: true,
        digest: 'daily'
      },
      contentModeration: {
        autoModeration: true,
        requireApproval: false,
        profanityFilter: true
      }
    };
  }
} 