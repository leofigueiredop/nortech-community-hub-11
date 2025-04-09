
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PaywallSettingsForm: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paywall Settings</CardTitle>
        <CardDescription>Configure global settings for all paywalls</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-md font-medium mb-2">Redirection Options</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input type="radio" id="inline" name="paywallType" value="inline" className="mr-2" defaultChecked />
                <label htmlFor="inline">Inline paywall (show directly in content)</label>
              </div>
              <div className="flex items-center">
                <input type="radio" id="redirect" name="paywallType" value="redirect" className="mr-2" />
                <label htmlFor="redirect">Redirect to dedicated paywall page</label>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-medium mb-2">Content Preview</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input type="checkbox" id="previewContent" className="mr-2" />
                <label htmlFor="previewContent">Show partial preview of premium content</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="blurContent" className="mr-2" />
                <label htmlFor="blurContent">Apply blur effect to premium content preview</label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-4">
          <Button className="bg-purple-600 hover:bg-purple-700">Save Paywall Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaywallSettingsForm;
