
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';

interface AccessOptionsProps {
  form: UseFormReturn<any>;
}

const AccessOptions: React.FC<AccessOptionsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="accessLevel"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between mt-4 p-4 rounded-lg border">
            <div className="space-y-0.5">
              <FormLabel>Premium Content</FormLabel>
              <p className="text-xs text-slate-500">
                Only accessible by premium subscribers
              </p>
            </div>
            <FormControl>
              <Switch
                checked={field.value === 'premium'}
                onCheckedChange={(checked) => field.onChange(checked ? 'premium' : 'free')}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="visibility"
        render={({ field }) => (
          <FormItem className="mt-4">
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
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="premium">Premium Only</SelectItem>
                <SelectItem value="points">Points Unlockable</SelectItem>
                <SelectItem value="vip-only">VIP Members Only</SelectItem>
                <SelectItem value="limited-time">Limited Time</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
              </SelectContent>
            </Select>
            <FormControl />
          </FormItem>
        )}
      />
    </>
  );
};

export default AccessOptions;
