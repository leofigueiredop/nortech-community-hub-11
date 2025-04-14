
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ContentFormValues } from '../../FormSchema';

interface ResourceUrlSectionProps {
  form: UseFormReturn<ContentFormValues>;
}

const ResourceUrlSection: React.FC<ResourceUrlSectionProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="resourceUrl"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Resource URL</FormLabel>
          <FormControl>
            <Input placeholder="Enter resource URL" {...field} />
          </FormControl>
          <FormDescription>
            Provide the URL where the content can be accessed.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ResourceUrlSection;
