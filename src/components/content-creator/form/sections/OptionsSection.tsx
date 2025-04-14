
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormDescription, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ContentFormValues } from '../../FormSchema';

interface OptionsSectionProps {
  form: UseFormReturn<ContentFormValues>;
}

const OptionsSection: React.FC<OptionsSectionProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="featured"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Featured</FormLabel>
              <FormDescription>
                Mark this content as featured.
              </FormDescription>
            </div>
            <FormControl>
              <input
                type="checkbox"
                checked={field.value}
                onChange={field.onChange}
                className="h-4 w-4"
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="pointsEnabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Points Enabled</FormLabel>
              <FormDescription>
                Enable points for this content.
              </FormDescription>
            </div>
            <FormControl>
              <input
                type="checkbox"
                checked={field.value}
                onChange={field.onChange}
                className="h-4 w-4"
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      {form.watch("pointsEnabled") && (
        <FormField
          control={form.control}
          name="pointsValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Points Value</FormLabel>
              <FormControl>
                <Input placeholder="Enter points value" type="number" {...field} />
              </FormControl>
              <FormDescription>
                Specify the points value for this content.
              </FormDescription>
            </FormItem>
          )}
        />
      )}
    </>
  );
};

export default OptionsSection;
