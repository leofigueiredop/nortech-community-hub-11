
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface CryptoGatewayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CryptoGatewayFormValues {
  binanceApiKey?: string;
  binanceSecretKey?: string;
  customRpcUrl?: string;
}

const CryptoGatewayDialog: React.FC<CryptoGatewayDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const form = useForm<CryptoGatewayFormValues>();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configure Crypto Gateway</DialogTitle>
          <DialogDescription>
            Set up cryptocurrency payment options for your community
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Connect to Binance Pay or use our native crypto gateway
              </AlertDescription>
            </Alert>

            <FormField
              control={form.control}
              name="binanceApiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Binance API Key</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="Enter Binance API key" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="binanceSecretKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Binance Secret Key</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="Enter Binance secret key" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customRpcUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom RPC URL (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter custom RPC URL" />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                Save Configuration
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CryptoGatewayDialog;
