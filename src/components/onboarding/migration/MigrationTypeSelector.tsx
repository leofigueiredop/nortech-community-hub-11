
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UseFormReturn } from 'react-hook-form';
import { MigrationFormData } from './types';

interface MigrationTypeSelectorProps {
  form: UseFormReturn<MigrationFormData>;
  onTypeChange: (value: "new" | "existing") => void;
}

const MigrationTypeSelector: React.FC<MigrationTypeSelectorProps> = ({ form, onTypeChange }) => {
  return (
    <FormField
      control={form.control}
      name="migrationType"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Você está começando uma nova comunidade ou migrando uma existente?</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={(value: "new" | "existing") => {
                field.onChange(value);
                onTypeChange(value);
              }}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="new" />
                </FormControl>
                <FormLabel className="font-normal">
                  🚀 Estou começando do zero
                </FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="existing" />
                </FormControl>
                <FormLabel className="font-normal">
                  🔁 Estou migrando uma comunidade existente
                </FormLabel>
              </FormItem>
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default MigrationTypeSelector;
