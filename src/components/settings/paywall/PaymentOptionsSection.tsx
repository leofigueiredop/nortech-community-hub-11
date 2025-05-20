import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PaymentGatewayType, PaymentGatewayConfig } from '@/types/paywall';
import { CreditCard, ArrowRight, Save } from 'lucide-react';

interface PaymentOptionsProps {
  gatewayConfigs?: Record<PaymentGatewayType, PaymentGatewayConfig>;
  activeGateways?: PaymentGatewayType[];
  onToggleGateway?: (gatewayId: string, enabled: boolean) => Promise<boolean>;
  onUpdateGateway?: (gatewayId: string, config: Partial<PaymentGatewayConfig>) => Promise<boolean>;
}

const PaymentOptionsSection: React.FC<PaymentOptionsProps> = ({
  gatewayConfigs = {},
  activeGateways = [],
  onToggleGateway,
  onUpdateGateway
}) => {
  const [activeTab, setActiveTab] = useState<string>('stripe');
  const [isSaving, setIsSaving] = useState<Record<string, boolean>>({});
  const [saveSuccess, setSaveSuccess] = useState<Record<string, boolean>>({});

  const handleToggleGateway = async (gateway: string, checked: boolean) => {
    if (!onToggleGateway) return;
    
    try {
      await onToggleGateway(gateway, checked);
    } catch (error) {
      console.error(`Error toggling ${gateway}:`, error);
    }
  };

  const handleSaveGateway = async (gateway: string, updates: Partial<PaymentGatewayConfig>) => {
    if (!onUpdateGateway) return;
    
    setIsSaving(prev => ({ ...prev, [gateway]: true }));
    setSaveSuccess(prev => ({ ...prev, [gateway]: false }));
    
    try {
      const success = await onUpdateGateway(gateway, updates);
      
      if (success) {
        setSaveSuccess(prev => ({ ...prev, [gateway]: true }));
        setTimeout(() => {
          setSaveSuccess(prev => ({ ...prev, [gateway]: false }));
        }, 3000);
      }
    } catch (error) {
      console.error(`Error updating ${gateway}:`, error);
    } finally {
      setIsSaving(prev => ({ ...prev, [gateway]: false }));
    }
  };

  // If no update function is provided, show a redirection message
  if (!onUpdateGateway || !onToggleGateway) {
    return (
      <div className="max-w-5xl mx-auto mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Payment Options</CardTitle>
            <CardDescription>Payment options have been moved to Subscription Settings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Please manage payment gateways and options in the Subscriptions section.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mb-12">
      <Card>
        <CardHeader>
          <CardTitle>Payment Gateways</CardTitle>
          <CardDescription>
            Configure payment gateways for subscription and checkout
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="stripe" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="stripe" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Stripe
              </TabsTrigger>
              <TabsTrigger value="paypal" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> PayPal
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="stripe" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Stripe Gateway</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Accept credit cards and other payment methods via Stripe
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="enableStripe">Enabled</Label>
                  <Switch 
                    id="enableStripe" 
                    checked={gatewayConfigs?.stripe?.enabled || false}
                    onCheckedChange={(checked) => handleToggleGateway('stripe', checked)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stripeApiKey">Stripe API Key</Label>
                  <Input 
                    id="stripeApiKey"
                    type="password"
                    placeholder="sk_xxxxx"
                    value={gatewayConfigs?.stripe?.apiKey || ''}
                    onChange={(e) => {
                      // We don't save directly, only on save button click
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stripeWebhookSecret">Webhook Secret</Label>
                  <Input 
                    id="stripeWebhookSecret"
                    type="password"
                    placeholder="whsec_xxxxx"
                    value={gatewayConfigs?.stripe?.webhookSecret || ''}
                    onChange={(e) => {
                      // We don't save directly, only on save button click
                    }}
                  />
                </div>
                
                <div className="flex items-center gap-2 pt-2">
                  <Switch 
                    id="stripeDefault"
                    checked={gatewayConfigs?.stripe?.isDefault || false}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleSaveGateway('stripe', { isDefault: true });
                      }
                    }}
                  />
                  <Label htmlFor="stripeDefault">Set as default payment gateway</Label>
                </div>
                
                <div className="pt-4 flex items-center gap-4">
                  <Button 
                    onClick={() => {
                      const apiKey = (document.getElementById('stripeApiKey') as HTMLInputElement)?.value;
                      const webhookSecret = (document.getElementById('stripeWebhookSecret') as HTMLInputElement)?.value;
                      
                      handleSaveGateway('stripe', {
                        apiKey,
                        webhookSecret
                      });
                    }}
                    disabled={isSaving.stripe}
                    className="flex items-center gap-2"
                  >
                    {isSaving.stripe ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save Stripe Settings</span>
                      </>
                    )}
                  </Button>
                  
                  {saveSuccess.stripe && (
                    <span className="text-green-600 text-sm">Settings saved successfully!</span>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="paypal" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">PayPal Gateway</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Enable PayPal payments for your customers
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="enablePaypal">Enabled</Label>
                  <Switch 
                    id="enablePaypal"
                    checked={gatewayConfigs?.paypal?.enabled || false}
                    onCheckedChange={(checked) => handleToggleGateway('paypal', checked)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paypalClientId">Client ID</Label>
                  <Input 
                    id="paypalClientId"
                    placeholder="Your PayPal client ID"
                    value={gatewayConfigs?.paypal?.clientId || ''}
                    onChange={(e) => {
                      // We don't save directly, only on save button click
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="paypalSecret">Client Secret</Label>
                  <Input 
                    id="paypalSecret"
                    type="password"
                    placeholder="Your PayPal client secret"
                    value={gatewayConfigs?.paypal?.clientSecret || ''}
                    onChange={(e) => {
                      // We don't save directly, only on save button click
                    }}
                  />
                </div>
                
                <div className="flex items-center gap-2 pt-2">
                  <Switch 
                    id="paypalDefault"
                    checked={gatewayConfigs?.paypal?.isDefault || false}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleSaveGateway('paypal', { isDefault: true });
                      }
                    }}
                  />
                  <Label htmlFor="paypalDefault">Set as default payment gateway</Label>
                </div>
                
                <div className="pt-4 flex items-center gap-4">
                  <Button 
                    onClick={() => {
                      const clientId = (document.getElementById('paypalClientId') as HTMLInputElement)?.value;
                      const clientSecret = (document.getElementById('paypalSecret') as HTMLInputElement)?.value;
                      
                      handleSaveGateway('paypal', {
                        clientId,
                        clientSecret
                      });
                    }}
                    disabled={isSaving.paypal}
                    className="flex items-center gap-2"
                  >
                    {isSaving.paypal ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save PayPal Settings</span>
                      </>
                    )}
                  </Button>
                  
                  {saveSuccess.paypal && (
                    <span className="text-green-600 text-sm">Settings saved successfully!</span>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentOptionsSection;
