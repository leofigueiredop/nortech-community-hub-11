
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';

interface ResourceUrlInputProps {
  form: UseFormReturn<any>;
}

const ResourceUrlInput: React.FC<ResourceUrlInputProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="resourceUrl"
      render={({ field }) => (
        <FormItem className="mt-6">
          <FormLabel>Resource URL</FormLabel>
          <FormControl>
            <Input placeholder="https://" {...field} />
          </FormControl>
          <FormDescription>
            {form.watch('format') === 'youtube' && 'Enter YouTube video URL'}
            {form.watch('format') === 'vimeo' && 'Enter Vimeo video URL'}
            {form.watch('format') === 'link' && 'Enter external website URL'}
            {form.watch('format') === 'gdoc' && 'Enter Google Document link'}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ResourceUrlInput;
