
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { POINTS_VALUES } from '@/context/PointsContext';

interface PointsConfigProps {
  form: UseFormReturn<any>;
}

const PointsConfig: React.FC<PointsConfigProps> = ({ form }) => {
  const pointsEnabled = form.watch('pointsEnabled');
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-medium">Rewards & Points</h3>
          <p className="text-sm text-muted-foreground">Configure points users can earn from this content</p>
        </div>
        
        <FormField
          control={form.control}
          name="pointsEnabled"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      
      {pointsEnabled && (
        <div className="space-y-4 pt-2">
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
                    {...field} 
                    onChange={e => field.onChange(parseInt(e.target.value) || POINTS_VALUES.content_completion)}
                  />
                </FormControl>
                <FormDescription>
                  How many points a user will receive for completing this content
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="completionCriteria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Completion Criteria</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select when points are awarded" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="view">View/Open Content</SelectItem>
                    <SelectItem value="scroll_end">Scroll to End (Text/PDF)</SelectItem>
                    <SelectItem value="watch_percent">Watch Percentage (Video)</SelectItem>
                    <SelectItem value="time_spent">Time Spent Viewing</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Determines when a user is considered to have completed the content
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {form.watch('completionCriteria') === 'watch_percent' && (
            <FormField
              control={form.control}
              name="completionThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Completion Percentage</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1} 
                      max={100} 
                      {...field} 
                      onChange={e => field.onChange(parseInt(e.target.value) || 80)}
                    />
                  </FormControl>
                  <FormDescription>
                    Percentage of video watched to earn points (e.g., 80%)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {form.watch('completionCriteria') === 'time_spent' && (
            <FormField
              control={form.control}
              name="completionThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Required (seconds)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1} 
                      {...field} 
                      onChange={e => field.onChange(parseInt(e.target.value) || 60)}
                    />
                  </FormControl>
                  <FormDescription>
                    How long (in seconds) a user needs to spend viewing the content
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PointsConfig;
