
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { Switch } from '@/components/ui/switch';

interface CustomizePaywallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateType: 'simple' | 'featured' | 'premium';
}

interface CustomizeFormValues {
  title: string;
  description: string;
  ctaText: string;
  showPrice: boolean;
  price: string;
  customStyles: boolean;
  backgroundColor: string;
  textColor: string;
}

const CustomizePaywallDialog: React.FC<CustomizePaywallDialogProps> = ({
  open,
  onOpenChange,
  templateType,
}) => {
  const form = useForm<CustomizeFormValues>({
    defaultValues: {
      title: 'Premium Content',
      description: 'Get access to exclusive content',
      ctaText: 'Subscribe Now',
      showPrice: templateType === 'premium',
      price: '19.99',
      customStyles: false,
      backgroundColor: '#ffffff',
      textColor: '#000000',
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Customize Paywall Template</DialogTitle>
          <DialogDescription>
            Personalize how your paywall appears to your audience
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter paywall title" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Enter description" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ctaText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Call to Action Text</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter button text" />
                  </FormControl>
                </FormItem>
              )}
            />

            {templateType === 'premium' && (
              <FormField
                control={form.control}
                name="showPrice"
                render={({ field }) => (
                  <FormItem className="flex justify-between items-center">
                    <FormLabel>Show Price</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomizePaywallDialog;
