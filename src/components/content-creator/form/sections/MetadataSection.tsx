
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ContentFormValues } from '../../FormSchema';

interface MetadataSectionProps {
  form: UseFormReturn<ContentFormValues>;
}

const MetadataSection: React.FC<MetadataSectionProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="author"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Author</FormLabel>
            <FormControl>
              <Input placeholder="Content Author" {...field} />
            </FormControl>
            <FormDescription>
              Enter the name of the content author.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Duration (seconds)</FormLabel>
            <FormControl>
              <Input placeholder="Enter duration in seconds" type="number" {...field} />
            </FormControl>
            <FormDescription>
              Specify the duration of the content in seconds.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default MetadataSection;
