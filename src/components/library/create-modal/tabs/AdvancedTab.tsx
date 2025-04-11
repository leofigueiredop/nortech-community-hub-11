
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { TabsContent } from '@/components/ui/tabs';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

interface AdvancedTabProps {
  form: UseFormReturn<any>;
  setActiveTab: (tab: string) => void;
}

const AdvancedTab: React.FC<AdvancedTabProps> = ({
  form,
  setActiveTab
}) => {
  const scheduleDate = form.watch('scheduleDate');

  return (
    <TabsContent value="advanced" className="space-y-4 py-4">
      <FormField
        control={form.control}
        name="linkToCourse"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Link to Course</FormLabel>
            <FormControl>
              <Input placeholder="Select related course" {...field} />
            </FormControl>
            <FormDescription>
              Optionally link this content to a course
            </FormDescription>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="attachToChallenge"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Attach to Challenge</FormLabel>
            <FormControl>
              <Input placeholder="Select challenge" {...field} />
            </FormControl>
            <FormDescription>
              Optionally link this content to a challenge
            </FormDescription>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="scheduleDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Schedule Publication</FormLabel>
            <FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    type="button"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduleDate ? format(new Date(scheduleDate), 'PPP') : "Schedule for later"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={scheduleDate ? new Date(scheduleDate) : undefined}
                    onSelect={(date) => field.onChange(date ? date.toISOString() : '')}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormDescription>
              Leave blank to publish immediately
            </FormDescription>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="internalNotes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Internal Notes</FormLabel>
            <FormControl>
              <Textarea placeholder="Add internal notes (not visible to users)" {...field} />
            </FormControl>
            <FormDescription>
              These notes are only visible to admins
            </FormDescription>
          </FormItem>
        )}
      />
      
      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => setActiveTab('visibility')}
        >
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
