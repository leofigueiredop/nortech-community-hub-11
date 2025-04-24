
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Info } from 'lucide-react';

const PaywallSettingsForm: React.FC = () => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Paywall Settings</CardTitle>
        <CardDescription>Configure global settings for all paywalls</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-md font-medium mb-3">Redirection Options</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="inline">Inline paywall</Label>
                  <p className="text-sm text-muted-foreground">Show directly in content without redirecting</p>
                </div>
                <Switch id="inline" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="redirect">Redirect to dedicated page</Label>
                  <p className="text-sm text-muted-foreground">Send user to a full paywall page with analytics</p>
                </div>
                <Switch id="redirect" />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-medium mb-3">Content Preview</h3>
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
        
        <div className="pt-4">
          <Button className="bg-purple-600 hover:bg-purple-700">Save Paywall Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaywallSettingsForm;
