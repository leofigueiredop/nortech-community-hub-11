
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { Calendar, Trophy, FileText } from 'lucide-react';
import { ContentFormValues } from '../schema';

interface AdvancedTabProps {
  form: UseFormReturn<ContentFormValues>;
  setActiveTab: (tab: string) => void;
}

const AdvancedTab: React.FC<AdvancedTabProps> = ({ form, setActiveTab }) => {
  return (
    <TabsContent value="advanced" className="space-y-4 pt-4">
      <FormField
        control={form.control}
        name="scheduleDate"
        render={({ field }) => (
          <FormItem className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <FormLabel>Schedule Publish Date (Optional)</FormLabel>
            </div>
            <FormControl>
              <Input type="datetime-local" {...field} />
            </FormControl>
            <FormDescription>
              Leave empty to publish immediately
            </FormDescription>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="attachToChallenge"
        render={({ field }) => (
          <FormItem className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-muted-foreground" />
              <FormLabel>Attach to Challenge (Optional)</FormLabel>
            </div>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a challenge" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="challenge-1">Beginner Developer Path</SelectItem>
                <SelectItem value="challenge-2">AI Mastery Challenge</SelectItem>
                <SelectItem value="challenge-3">Community Expert Badge</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="internalNotes"
        render={({ field }) => (
          <FormItem className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <FormLabel>Internal Notes (Not visible to users)</FormLabel>
            </div>
            <FormControl>
              <Textarea className="h-24" placeholder="Add private notes for team members" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={() => setActiveTab('visibility')}>
          Back
        </Button>
        <Button type="submit">
          Create Content
        </Button>
      </div>
    </TabsContent>
  );
};

export default AdvancedTab;
