import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SectionDivider from '@/components/settings/SectionDivider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle } from "lucide-react";

const PaywallSettings: React.FC = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = React.useState(false);
  const [paywallEnabled, setPaywallEnabled] = React.useState(false);
  const [freeTrialEnabled, setFreeTrialEnabled] = React.useState(false);
  const [freeTrialDays, setFreeTrialDays] = React.useState(7);

  const handleSaveSettings = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings saved",
        description: "Your paywall settings have been updated successfully.",
      });
    }, 800);
  };

  return (
    <MainLayout title="Paywall">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-8">Paywall</h1>
          
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-8 mb-4 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-8">Manage paywall settings</h2>
            
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-8 items-center">
                <div>
                  <Label className="text-base font-semibold mb-2 block">
                    Enable paywall
                  </Label>
                  <p className="text-gray-500 dark:text-gray-400 mb-2">
                    Require users to subscribe to access premium content.
                  </p>
                </div>
                <div className="flex justify-end">
                  <Switch 
                    checked={paywallEnabled} 
                    onCheckedChange={setPaywallEnabled} 
                  />
                </div>
              </div>

              <SectionDivider />
              
              <div className="grid grid-cols-2 gap-8 items-center">
                <div>
                  <Label className="text-base font-semibold mb-2 block">
                    Offer free trial
                  </Label>
                  <p className="text-gray-500 dark:text-gray-400 mb-2">
                    Allow new users to try premium content for a limited time.
                  </p>
                </div>
                <div className="flex justify-end">
                  <Switch 
                    checked={freeTrialEnabled} 
                    onCheckedChange={setFreeTrialEnabled} 
                    disabled={!paywallEnabled}
                  />
                </div>
              </div>
              
              {freeTrialEnabled && (
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <Label htmlFor="free-trial-days" className="text-base font-semibold mb-2 block">
                      Free trial duration (days)
                    </Label>
                    <p className="text-gray-500 dark:text-gray-400 mb-2">
                      Set the number of days for the free trial period.
                    </p>
                  </div>
                  <div>
                    <Input 
                      id="free-trial-days" 
                      type="number"
                      placeholder="Number of days" 
                      value={freeTrialDays}
                      onChange={(e) => setFreeTrialDays(Number(e.target.value))}
                      disabled={!paywallEnabled || !freeTrialEnabled}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button 
              onClick={handleSaveSettings} 
              disabled={isSaving}
              className="bg-nortech-purple hover:bg-nortech-purple/90"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PaywallSettings;
