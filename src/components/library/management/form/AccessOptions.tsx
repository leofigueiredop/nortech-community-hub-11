
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { UseFormReturn } from 'react-hook-form';

interface AccessOptionsProps {
  form: UseFormReturn<any>;
}

const AccessOptions: React.FC<AccessOptionsProps> = ({ form }) => {
  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-base font-medium">Access & Visibility</h3>
      
      <FormField
        control={form.control}
        name="accessLevel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Access Level</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select access level" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="free">Free (Everyone)</SelectItem>
                <SelectItem value="premium">Premium (Paid Members)</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Determines who can access this content
            </FormDescription>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="visibility"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Visibility</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="public">Public (In Library)</SelectItem>
                <SelectItem value="premium">Premium Section</SelectItem>
                <SelectItem value="points">Points Shop</SelectItem>
                <SelectItem value="hidden">Hidden (Direct Link Only)</SelectItem>
                <SelectItem value="vip-only">VIP Members Only</SelectItem>
                <SelectItem value="limited-time">Limited Time Offer</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Controls where this content appears
            </FormDescription>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="featured"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Featured Content</FormLabel>
              <FormDescription>
                Highlight this content in featured sections
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default AccessOptions;
