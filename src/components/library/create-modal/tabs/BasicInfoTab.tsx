
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ContentFormatOptions } from '../../management/constants/contentFormOptions';
import TagsInput from '../../management/form/TagsInput';
import { UseFormReturn } from 'react-hook-form';
import { ContentFormValues } from '../schema';

interface BasicInfoTabProps {
  form: UseFormReturn<ContentFormValues>;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  allTags: string[];
  isBasicInfoValid: boolean;
  setActiveTab: (tab: string) => void;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ 
  form, 
  selectedTags, 
  setSelectedTags, 
  allTags,
  isBasicInfoValid,
  setActiveTab
}) => {
  return (
    <TabsContent value="basic" className="space-y-4 pt-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter title" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea placeholder="Enter a short description" className="h-24" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="format"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Content Type</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {ContentFormatOptions.map(option => (
                  <SelectItem key={option.value} value={option.value} className="flex items-center gap-2">
                    {option.icon} {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
      
      <div>
        <TagsInput
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          allTags={allTags}
        />
      </div>
      
      <div className="flex justify-end">
        <Button type="button" onClick={() => setActiveTab('media')} disabled={!isBasicInfoValid}>
          Next
        </Button>
      </div>
    </TabsContent>
  );
};

export default BasicInfoTab;
