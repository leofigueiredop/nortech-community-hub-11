import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { SupabaseCommunitySettingsRepository } from '@/api/repositories/SupabaseCommunitySettingsRepository';
import type { GeneralSettings, CommunityBasicInfo } from '@/api/interfaces/ICommunitySettings';
import { useToast } from '@/components/ui/use-toast';

const settingsRepository = new SupabaseCommunitySettingsRepository();

export function useCommunitySettings() {
  const { community } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings | null>(null);
  const [basicInfo, setBasicInfo] = useState<CommunityBasicInfo | null>(null);

  useEffect(() => {
    if (community?.id) {
      loadSettings();
    }
  }, [community?.id]);

  const loadSettings = async () => {
    if (!community?.id) return;
    
    setIsLoading(true);
    try {
      const [settings, info] = await Promise.all([
        settingsRepository.getGeneralSettings(community.id),
        settingsRepository.getCommunityBasicInfo(community.id)
      ]);
      
      setGeneralSettings(settings);
      setBasicInfo(info);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Error loading settings",
        description: "There was a problem loading your community settings.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateGeneralSettings = async (settings: Partial<GeneralSettings>) => {
    if (!community?.id) return;
    
    try {
      await settingsRepository.updateGeneralSettings(community.id, settings);
      setGeneralSettings(prev => prev ? { ...prev, ...settings } : null);
      toast({
        title: "Settings updated",
        description: "Your general settings have been saved successfully."
      });
    } catch (error) {
      console.error('Error updating general settings:', error);
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your general settings.",
        variant: "destructive"
      });
    }
  };

  const updateBasicInfo = async (data: Partial<CommunityBasicInfo>) => {
    if (!community?.id) return;
    
    try {
      await settingsRepository.updateCommunityBasicInfo(community.id, data);
      setBasicInfo(prev => prev ? { ...prev, ...data } : null);
      toast({
        title: "Community info updated",
        description: "Your community information has been saved successfully."
      });
    } catch (error) {
      console.error('Error updating basic info:', error);
      toast({
        title: "Error saving info",
        description: "There was a problem saving your community information.",
        variant: "destructive"
      });
    }
  };

  return {
    isLoading,
    generalSettings,
    basicInfo,
    updateGeneralSettings,
    updateBasicInfo,
    refreshSettings: loadSettings
  };
} 