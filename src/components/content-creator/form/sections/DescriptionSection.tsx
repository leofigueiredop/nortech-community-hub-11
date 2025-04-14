
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ContentFormValues } from '../../FormSchema';

interface DescriptionSectionProps {
  form: UseFormReturn<ContentFormValues>;
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Content Description"
              className="resize-none"
              {...field}
            />
          </FormControl>
          <FormDescription>
            Write a detailed description for your content.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DescriptionSection;
