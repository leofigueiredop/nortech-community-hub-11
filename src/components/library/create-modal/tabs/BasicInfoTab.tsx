
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { TabsContent } from '@/components/ui/tabs';
import { contentFormatOptions } from '../../management/constants/contentFormOptions';
import TagsInput from '../../management/form/TagsInput';

interface BasicInfoTabProps {
  form: UseFormReturn<any>;
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
    <TabsContent value="basic" className="space-y-4 py-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter content title" {...field} />
            </FormControl>
            <FormMessage />
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
              <Textarea placeholder="Enter description" className="min-h-[120px]" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="format"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Content Format</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select content format" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {contentFormatOptions.map(option => (
                  <SelectItem key={option.value} value={option.value} className="flex items-center gap-2">
                    {option.icon} {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div>
        <FormLabel>Tags</FormLabel>
        <TagsInput
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          allTags={allTags}
        />
      </div>
      
      <div className="flex justify-end pt-4">
        <Button
          type="button"
          onClick={() => setActiveTab('media')}
          disabled={!isBasicInfoValid}
        >
          Next: Media
        </Button>
      </div>
    </TabsContent>
  );
};

export default BasicInfoTab;
