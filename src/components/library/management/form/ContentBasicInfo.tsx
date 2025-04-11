
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ContentFormat } from '@/types/library';
import { contentFormatOptions } from '../constants/contentFormOptions';
import { ContentCategory } from '@/types/library';
import { UseFormReturn } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import PointsConfig from './PointsConfig';

interface ContentBasicInfoProps {
  form: UseFormReturn<any>;
  categories: ContentCategory[];
}

const ContentBasicInfo: React.FC<ContentBasicInfoProps> = ({ form, categories }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="format"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Format</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
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
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea placeholder="Enter description" className="h-32" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="categoryId"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Category</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <Card className="p-4 mt-6">
        <PointsConfig form={form} />
      </Card>
    </>
  );
};

export default ContentBasicInfo;
