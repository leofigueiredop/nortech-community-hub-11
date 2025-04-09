
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
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
        <FormItem className="mt-4">
          <FormLabel>Resource URL</FormLabel>
          <FormControl>
            <Input placeholder="https://" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ResourceUrlInput;
