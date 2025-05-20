import { useState, useEffect, useCallback } from 'react';
import { PaywallSettings, PaymentGatewayConfig, PaywallTemplate } from '@/types/paywall';
import { api } from '@/api/ApiClient';

export const usePaywallSettings = () => {
  const [settings, setSettings] = useState<PaywallSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [templates, setTemplates] = useState<PaywallTemplate[]>([]);

  // Fetch paywall settings
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.getPaywallSettings();
      
      if (response) {
        setSettings(response);
      } else {
        // Initialize with default settings if none exist
        setSettings({
          activeTemplate: 'standard',
          activeGateways: ['stripe'],
          gatewayConfigs: {
            stripe: { 
              enabled: true,
              apiKey: '',
              webhookSecret: '',
              isDefault: true
            },
            paypal: {
              enabled: false,
              clientId: '',
              clientSecret: '',
              isDefault: false
            }
          },
          messageSettings: {
            title: 'Upgrade to Premium',
            description: 'Get access to exclusive content by becoming a premium member.',
            ctaText: 'Upgrade Now'
          }
        });
      }

      // Fetch available templates
      const templatesResponse = await api.getPaywallTemplates();
      setTemplates(templatesResponse || []);
    } catch (err) {
      console.error('Error fetching paywall settings:', err);
      setError('Failed to load paywall settings');
    } finally {
      setLoading(false);
    }
  }, []);

  // Save paywall settings
  const saveSettings = useCallback(async (updatedSettings: PaywallSettings) => {
    setLoading(true);
    setError(null);
    
    try {
      await api.updatePaywallSettings(updatedSettings);
      setSettings(updatedSettings);
      return true;
    } catch (err) {
      console.error('Error saving paywall settings:', err);
      setError('Failed to save paywall settings');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update specific gateway config
  const updateGatewayConfig = useCallback(async (
    gatewayId: string, 
    config: Partial<PaymentGatewayConfig>
  ) => {
    if (!settings) return false;
    
    const updatedSettings = {
      ...settings,
      gatewayConfigs: {
        ...settings.gatewayConfigs,
        [gatewayId]: {
          ...settings.gatewayConfigs[gatewayId],
          ...config
        }
      }
    };
    
    // If setting this gateway as default, unset others
    if (config.isDefault) {
      Object.keys(updatedSettings.gatewayConfigs).forEach(key => {
        if (key !== gatewayId) {
          updatedSettings.gatewayConfigs[key] = {
            ...updatedSettings.gatewayConfigs[key],
            isDefault: false
          };
        }
      });
    }
    
    return saveSettings(updatedSettings);
  }, [settings, saveSettings]);

  // Enable/disable gateway
  const toggleGateway = useCallback(async (
    gatewayId: string, 
    enabled: boolean
  ) => {
    if (!settings) return false;
    
    const activeGateways = [...settings.activeGateways];
    
    if (enabled && !activeGateways.includes(gatewayId)) {
      activeGateways.push(gatewayId);
    } else if (!enabled) {
      const index = activeGateways.indexOf(gatewayId);
      if (index !== -1) {
        activeGateways.splice(index, 1);
      }
    }
    
    const updatedSettings = {
      ...settings,
      activeGateways,
      gatewayConfigs: {
        ...settings.gatewayConfigs,
        [gatewayId]: {
          ...settings.gatewayConfigs[gatewayId],
          enabled
        }
      }
    };
    
    return saveSettings(updatedSettings);
  }, [settings, saveSettings]);

  // Update message settings
  const updateMessageSettings = useCallback(async (
    messageUpdates: Partial<PaywallSettings['messageSettings']>
  ) => {
    if (!settings) return false;
    
    const updatedSettings = {
      ...settings,
      messageSettings: {
        ...settings.messageSettings,
        ...messageUpdates
      }
    };
    
    return saveSettings(updatedSettings);
  }, [settings, saveSettings]);

  // Change active template
  const changeTemplate = useCallback(async (templateId: string) => {
    if (!settings) return false;
    
    const updatedSettings = {
      ...settings,
      activeTemplate: templateId
    };
    
    return saveSettings(updatedSettings);
  }, [settings, saveSettings]);

  // Load settings on mount
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    templates,
    loading,
    error,
    fetchSettings,
    saveSettings,
    updateGatewayConfig,
    toggleGateway,
    updateMessageSettings,
    changeTemplate
  };
}; 