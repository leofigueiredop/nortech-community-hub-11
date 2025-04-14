
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ContentFormValues } from '../../FormSchema';

interface AccessSectionProps {
  form: UseFormReturn<ContentFormValues>;
}

const AccessSection: React.FC<AccessSectionProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="accessLevel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Access Level</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select access level" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="unlockable">Unlockable</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Set the access level for your content.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tags</FormLabel>
            <FormControl>
              <Input placeholder="Enter tags separated by commas" {...field} />
            </FormControl>
            <FormDescription>
              Add tags to help users find your content.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AccessSection;
