import { supabase } from '@/lib/supabase';
import { ICommunitySettingsRepository, GeneralSettings, CommunityBasicInfo } from '../interfaces/ICommunitySettings';

export class SupabaseCommunitySettingsRepository implements ICommunitySettingsRepository {
  private getDefaultGeneralSettings(): GeneralSettings {
    return {
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      defaultPrivacy: 'public',
      allowGuestAccess: true,
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

  async getGeneralSettings(communityId: string): Promise<GeneralSettings> {
    try {
      // First try to get existing settings
      const { data: settings, error } = await supabase
        .from('community_settings')
        .select('settings_data')
        .eq('community_id', communityId)
        .eq('settings_type', 'general')
        .maybeSingle();

      if (error) {
        console.error('Error fetching general settings:', error);
        throw error;
      }

      // If no settings exist, create them with defaults
      if (!settings) {
        const defaultSettings = this.getDefaultGeneralSettings();
        
        const { data: newSettings, error: insertError } = await supabase
          .from('community_settings')
          .insert({
            community_id: communityId,
            settings_type: 'general',
            settings_data: defaultSettings,
          })
          .select('settings_data')
          .single();

        if (insertError) {
          console.error('Error creating default settings:', insertError);
          throw insertError;
        }
        
        return defaultSettings;
      }

      return settings.settings_data as GeneralSettings;
    } catch (error) {
      console.error('Error in getGeneralSettings:', error);
      throw error;
    }
  }

  async updateGeneralSettings(communityId: string, settings: Partial<GeneralSettings>): Promise<void> {
    try {
      const { data: existingSettings, error: fetchError } = await supabase
        .from('community_settings')
        .select('settings_data')
        .eq('community_id', communityId)
        .eq('settings_type', 'general')
        .single();

      if (fetchError) {
        console.error('Error fetching existing settings:', fetchError);
        throw fetchError;
      }

      const newSettings = {
        ...(existingSettings?.settings_data || this.getDefaultGeneralSettings()),
        ...settings,
      };

      const { error: updateError } = await supabase
        .from('community_settings')
        .upsert({
          community_id: communityId,
          settings_type: 'general',
          settings_data: newSettings,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'community_id,settings_type'
        });

      if (updateError) {
        console.error('Error updating settings:', updateError);
        throw updateError;
      }
    } catch (error) {
      console.error('Error in updateGeneralSettings:', error);
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

      if (error) {
        console.error('Error fetching community info:', error);
        throw error;
      }

      if (!community) {
        throw new Error('Community not found');
      }

      return community as CommunityBasicInfo;
    } catch (error) {
      console.error('Error in getCommunityBasicInfo:', error);
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

      if (error) {
        console.error('Error updating community info:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in updateCommunityBasicInfo:', error);
      throw error;
    }
  }
} 