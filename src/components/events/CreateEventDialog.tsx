import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, MapPin, Users, Link as LinkIcon, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useRealEvents } from '@/hooks/useRealEvents';
import { EventType, EVENT_TYPES } from '@/components/events/types/EventTypes';
import { useAuth } from '@/context/AuthContext';

// Create event form schema
const formSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  date: z.date({ required_error: 'Event date is required' }),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  location: z.string().optional(),
  imageUrl: z.string().optional(),
  eventType: z.string(),
  capacity: z.string().transform((val) => (val === '' ? undefined : parseInt(val, 10))).optional(),
  isVirtual: z.boolean().default(false),
  meetingLink: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
  isFeatured: z.boolean().default(false),
  pointsAwarded: z.string().transform((val) => (val === '' ? 0 : parseInt(val, 10))).default('0'),
});

type FormData = z.infer<typeof formSchema>;

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateEventDialog: React.FC<CreateEventDialogProps> = ({ open, onOpenChange }) => {
  const { createEvent } = useRealEvents();
  const { user, role } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Check if user has admin or moderator role
  const isAdminOrModerator = role === 'admin' || role === 'moderator';
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      startTime: '09:00',
      endTime: '10:00',
      location: '',
      imageUrl: '',
      eventType: 'workshop',
      capacity: '',
      isVirtual: false,
      meetingLink: '',
      isFeatured: false,
      pointsAwarded: '0',
    },
  });
  
  const isVirtualEvent = form.watch('isVirtual');
  
  const onSubmit = async (data: FormData) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      // Format dates properly
      const eventDate = new Date(data.date);
      
      let startDate: Date | undefined, endDate: Date | undefined;
      
      if (data.startTime) {
        const [startHours, startMinutes] = data.startTime.split(':').map(Number);
        startDate = new Date(eventDate);
        startDate.setHours(startHours, startMinutes);
      }
      
      if (data.endTime) {
        const [endHours, endMinutes] = data.endTime.split(':').map(Number);
        endDate = new Date(eventDate);
        endDate.setHours(endHours, endMinutes);
      }
      
      const eventData = {
        title: data.title,
        description: data.description,
        date: eventDate,
        start_date: startDate,
        end_date: endDate,
        location: isVirtualEvent ? 'Online' : data.location,
        image_url: data.imageUrl,
        event_type: data.eventType,
        capacity: data.capacity,
        is_virtual: data.isVirtual,
        meeting_link: data.meetingLink,
        is_featured: data.isFeatured && isAdminOrModerator, // Only admins can set featured
        points_awarded: parseInt(data.pointsAwarded.toString(), 10) || 0,
      };
      
      const result = await createEvent(eventData);
      
      if (result) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new event for the community.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event title" {...field} />
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
                    <Textarea 
                      placeholder="Provide details about the event" 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Event Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="eventType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(EVENT_TYPES).map(([value, { label, icon }]) => (
                          <SelectItem key={value} value={value}>
                            <div className="flex items-center">
                              <span className="mr-2">{icon}</span>
                              <span>{label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="isVirtual"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>This is a virtual event</FormLabel>
                    <FormDescription>
                      Check this if the event will be held online
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            {isVirtualEvent ? (
              <FormField
                control={form.control}
                name="meetingLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meeting Link</FormLabel>
                    <div className="flex items-center space-x-2">
                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input 
                          placeholder="Enter meeting URL (Zoom, Google Meet, etc.)" 
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input placeholder="Enter event location" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity (optional)</FormLabel>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Enter max attendees" 
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                    </div>
                    <FormDescription>
                      Leave empty for unlimited capacity
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="pointsAwarded"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Points Awarded</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Points for attending" 
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Points awarded to users who attend this event
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL (optional)</FormLabel>
                  <div className="flex items-center space-x-2">
                    <FileImage className="h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input placeholder="Enter image URL for the event" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {isAdminOrModerator && (
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Feature this event</FormLabel>
                      <FormDescription>
                        Featured events appear prominently on the community homepage
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            )}
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-nortech-purple hover:bg-nortech-purple/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2">Creating...</span>
                    <div className="spinner h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  </>
                ) : (
                  'Create Event'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventDialog; 