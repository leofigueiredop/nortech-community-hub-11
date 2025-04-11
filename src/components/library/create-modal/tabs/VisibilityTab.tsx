
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { UseFormReturn } from 'react-hook-form';
import { TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface VisibilityTabProps {
  form: UseFormReturn<any>;
  setActiveTab: (tab: string) => void;
}

const VisibilityTab: React.FC<VisibilityTabProps> = ({
  form,
  setActiveTab
}) => {
  return (
    <TabsContent value="visibility" className="space-y-4 py-4">
      <FormField
        control={form.control}
        name="accessLevel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Access Level</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select access level" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="free">Free (Everyone)</SelectItem>
                <SelectItem value="premium">Premium (Paid Members)</SelectItem>
                <SelectItem value="unlockable">Unlockable with Points</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Controls who can access this content
            </FormDescription>
          </FormItem>
        )}
      />
      
      {form.watch('accessLevel') === 'unlockable' && (
        <FormField
          control={form.control}
          name="pointsValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Points to Unlock</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  placeholder="100"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 100)}
                />
              </FormControl>
              <FormDescription>
                How many points a user needs to spend to unlock this content
              </FormDescription>
            </FormItem>
          )}
        />
      )}
      
      <Card className="p-4">
        <FormField
          control={form.control}
          name="pointsEnabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 mb-4">
              <div className="space-y-0.5">
                <FormLabel>Award Points for Viewing</FormLabel>
                <FormDescription>
                  Users will earn points when they view this content
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
                <FormLabel>Points Value</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder="100"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 100)}
                  />
                </FormControl>
                <FormDescription>
                  How many points a user will earn for viewing this content
                </FormDescription>
              </FormItem>
            )}
          />
        )}
      </Card>
      
      <FormField
        control={form.control}
        name="featured"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <FormLabel>Featured Content</FormLabel>
              <FormDescription>
                Highlight this content in featured sections
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
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <FormLabel>Add to Carousel</FormLabel>
              <FormDescription>
                Display this content in the homepage carousel
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
      
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setActiveTab('media')}
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={() => setActiveTab('advanced')}
        >
          Next: Advanced
        </Button>
      </div>
    </TabsContent>
  );
};

export default VisibilityTab;
