
import React from 'react';
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { MigrationFormData } from './types';

interface PlatformSelectorProps {
  form: UseFormReturn<MigrationFormData>;
}

const PlatformSelector: React.FC<PlatformSelectorProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="platform"
      render={({ field }) => (
        <FormItem>
          <FormLabel>De qual plataforma você está migrando?</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a plataforma" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="discord">Discord</SelectItem>
              <SelectItem value="circle">Circle</SelectItem>
              <SelectItem value="facebook">Facebook Groups</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="telegram">Telegram</SelectItem>
              <SelectItem value="slack">Slack</SelectItem>
              <SelectItem value="other">Outra plataforma</SelectItem>
            </SelectContent>
          </Select>
          <FormDescription>
            Isso nos ajudará a personalizar sua experiência.
          </FormDescription>
        </FormItem>
      )}
    />
  );
};

export default PlatformSelector;
