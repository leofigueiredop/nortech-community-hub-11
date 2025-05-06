import React from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/api/ApiClient';

interface PrivacySettings {
  is_private: boolean;
  theme_config: {
    require_member_approval?: boolean;
    allow_guest_access?: boolean;
    show_member_list?: boolean;
    allow_member_invites?: boolean;
  } | null;
}

const Privacy: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = React.useState<PrivacySettings>({
    is_private: false,
    theme_config: {
      require_member_approval: true,
      allow_guest_access: false,
      show_member_list: true,
      allow_member_invites: true
    }
  });
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const loadPrivacySettings = async () => {
      try {
        const { data: community } = await api.community.getCommunityById('current');
        if (community) {
          setSettings({
            is_private: community.is_private || false,
            theme_config: {
              ...community.theme_config,
              require_member_approval: community.theme_config?.require_member_approval ?? true,
              allow_guest_access: community.theme_config?.allow_guest_access ?? false,
              show_member_list: community.theme_config?.show_member_list ?? true,
              allow_member_invites: community.theme_config?.allow_member_invites ?? true
            }
          });
        }
      } catch (error) {
        console.error('Error loading privacy settings:', error);
      }
    };

    loadPrivacySettings();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await api.community.updateCommunity('current', {
        is_private: settings.is_private,
        theme_config: settings.theme_config
      });

      toast({
        title: 'Privacy Settings Updated',
        description: 'Your community privacy settings have been saved.',
      });
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save privacy settings. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (key: string) => {
    if (key === 'is_private') {
      setSettings(prev => ({
        ...prev,
        is_private: !prev.is_private
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        theme_config: {
          ...prev.theme_config,
          [key]: !prev.theme_config?.[key]
        }
      }));
    }
  };

  return (
    <SettingsLayout activeSection="privacy" title="Privacy Settings">
      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Private Community</Label>
              <p className="text-sm text-muted-foreground">
                Only approved members can access your community content
              </p>
            </div>
            <Switch
              checked={settings.is_private}
              onCheckedChange={() => handleToggle('is_private')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Require Member Approval</Label>
              <p className="text-sm text-muted-foreground">
                Manually approve new member requests
              </p>
            </div>
            <Switch
              checked={settings.theme_config?.require_member_approval}
              onCheckedChange={() => handleToggle('require_member_approval')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow Guest Access</Label>
              <p className="text-sm text-muted-foreground">
                Let non-members view limited content
              </p>
            </div>
            <Switch
              checked={settings.theme_config?.allow_guest_access}
              onCheckedChange={() => handleToggle('allow_guest_access')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Member List</Label>
              <p className="text-sm text-muted-foreground">
                Display the list of community members publicly
              </p>
            </div>
            <Switch
              checked={settings.theme_config?.show_member_list}
              onCheckedChange={() => handleToggle('show_member_list')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow Member Invites</Label>
              <p className="text-sm text-muted-foreground">
                Let members invite others to join
              </p>
            </div>
            <Switch
              checked={settings.theme_config?.allow_member_invites}
              onCheckedChange={() => handleToggle('allow_member_invites')}
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>
    </SettingsLayout>
  );
};

export default Privacy; 