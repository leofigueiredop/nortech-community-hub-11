
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { ContentFormValues } from '../schema';

interface VisibilityTabProps {
  form: UseFormReturn<ContentFormValues>;
  setActiveTab: (tab: string) => void;
}

const VisibilityTab: React.FC<VisibilityTabProps> = ({ form, setActiveTab }) => {
  return (
    <TabsContent value="visibility" className="space-y-4 pt-4">
      <FormField
        control={form.control}
        name="accessLevel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Visibility</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="free">Free (Available to everyone)</SelectItem>
                <SelectItem value="premium">Premium (For subscribers only)</SelectItem>
                <SelectItem value="unlockable">Unlockable (With points)</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
      
      {form.watch('accessLevel') === 'unlockable' && (
        <FormField
          control={form.control}
          name="pointsValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Points Cost</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
              </FormControl>
              <FormDescription>
                How many points users need to unlock this content
              </FormDescription>
            </FormItem>
          )}
        />
      )}
      
      {form.watch('accessLevel') !== 'unlockable' && (
        <>
          <FormField
            control={form.control}
            name="pointsEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">XP Reward</FormLabel>
                  <FormDescription>
                    Award XP points when users complete this content
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          {form.watch('pointsEnabled') && (
            <FormField
              control={form.control}
              name="pointsValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>XP Amount</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
        </>
      )}
      
      <FormField
        control={form.control}
        name="featured"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Feature on Home</FormLabel>
              <FormDescription>
                Highlight this content on the main library page
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="addToCarousel"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Add to Carousel</FormLabel>
              <FormDescription>
                Include this content in the featured carousel
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={() => setActiveTab('media')}>
          Back
        </Button>
        <Button type="button" onClick={() => setActiveTab('advanced')}>
          Next
        </Button>
      </div>
    </TabsContent>
  );
};

export default VisibilityTab;
