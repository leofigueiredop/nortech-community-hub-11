import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Info, Save } from 'lucide-react';
import { PaywallMessageSettings } from '@/types/paywall';

interface PaywallSettingsFormProps {
  messageSettings?: PaywallMessageSettings;
  onUpdateMessages?: (messages: Partial<PaywallMessageSettings>) => Promise<boolean>;
}

const PaywallSettingsForm: React.FC<PaywallSettingsFormProps> = ({ 
  messageSettings,
  onUpdateMessages
}) => {
  const [title, setTitle] = useState(messageSettings?.title || 'Upgrade to Premium');
  const [description, setDescription] = useState(messageSettings?.description || 'Get access to exclusive content by becoming a premium member.');
  const [ctaText, setCtaText] = useState(messageSettings?.ctaText || 'Upgrade Now');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Update states when props change
  useEffect(() => {
    if (messageSettings) {
      setTitle(messageSettings.title || 'Upgrade to Premium');
      setDescription(messageSettings.description || 'Get access to exclusive content by becoming a premium member.');
      setCtaText(messageSettings.ctaText || 'Upgrade Now');
    }
  }, [messageSettings]);

  const handleSaveMessages = async () => {
    if (!onUpdateMessages) return;
    
    setIsSaving(true);
    setSavedSuccess(false);
    
    try {
      const success = await onUpdateMessages({
        title,
        description,
        ctaText
      });
      
      if (success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error saving messages:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Paywall Settings</CardTitle>
        <CardDescription>Configure global settings for all paywalls</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-md font-medium mb-3">Message Customization</h3>
            
            <div className="space-y-2">
              <Label htmlFor="paywallTitle">Paywall Title</Label>
              <Input 
                id="paywallTitle" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Upgrade to Premium"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paywallDescription">Description</Label>
              <Textarea 
                id="paywallDescription" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the benefits of upgrading..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ctaText">Call-to-Action Text</Label>
              <Input 
                id="ctaText" 
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="e.g., Subscribe Now"
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-medium mb-3">Display Options</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="partialPreview">Partial content preview</Label>
                  <p className="text-sm text-muted-foreground">Show a preview of the premium content</p>
                </div>
                <Switch id="partialPreview" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="blurEffect">Apply blur effect</Label>
                  <p className="text-sm text-muted-foreground">Blur premium content in the preview</p>
                </div>
                <Switch id="blurEffect" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="interactivePopup">Interactive popup</Label>
                  <p className="text-sm text-muted-foreground">Show plan details when hovering over locked content</p>
                </div>
                <Switch id="interactivePopup" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-700 dark:text-blue-300">
            These settings apply to all paywalls across your community. Template-specific settings can be modified with the Customize button on each template.
          </p>
        </div>
        
        <div className="pt-4 flex items-center gap-4">
          <Button 
            className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
            onClick={handleSaveMessages}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Message Settings</span>
              </>
            )}
          </Button>
          
          {savedSuccess && (
            <span className="text-green-600 dark:text-green-400 text-sm">
              Settings saved successfully!
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaywallSettingsForm;
