import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface FiatGatewayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FiatGatewayFormValues {
  stripeKey?: string;
  paypalClientId?: string;
  hotmartToken?: string;
  asaasKey?: string;
  kiwifyToken?: string;
  lastlinkKey?: string;
}

const FiatGatewayDialog: React.FC<FiatGatewayDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const form = useForm<FiatGatewayFormValues>();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configure Payment Gateways</DialogTitle>
          <DialogDescription>
            Connect your payment providers to start accepting payments
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription translationKey="settings.paywall.fiat.info" />
            </Alert>

            <FormField
              control={form.control}
              name="stripeKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stripe Secret Key</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="sk_live_..." />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paypalClientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PayPal Client ID</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter PayPal client ID" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hotmartToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hotmart Token</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="Enter Hotmart token" />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                Save Gateways
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default FiatGatewayDialog;
