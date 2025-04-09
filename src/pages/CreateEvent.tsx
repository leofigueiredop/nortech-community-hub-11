
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { TimePicker } from '@/components/ui/time-picker';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, Image, MapPin, Tag, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EVENT_TYPES } from '@/components/events/types/EventTypes';

// Create a TimePicker component since it doesn't exist in shadcn/ui by default
const TimePicker: React.FC<{value: string; onChange: (value: string) => void}> = ({ value, onChange }) => {
  return (
    <Input 
      type="time" 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className="w-full"
    />
  );
};

const CreateEvent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: new Date(),
    startTime: '18:00',
    endTime: '20:00',
    location: '',
    type: 'workshop',
    speaker: '',
    capacity: 50,
    points: 20,
    badgeEnabled: true,
    badgeName: '',
    image: null as File | null
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (name: string, value: any) => {
    setEventData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEventData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate form
    if (!eventData.title.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter an event title",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    // In a real app, this would send data to the server
    setTimeout(() => {
      toast({
        title: "Event Created",
        description: "Your event has been successfully created!"
      });
      setIsSubmitting(false);
      navigate('/events');
    }, 1500);
  };
  
  // Generate time options for display
  const timeOptions = Array.from({ length: 24 }).map((_, hour) => {
    return ['00', '30'].map(minute => `${hour.toString().padStart(2, '0')}:${minute}`);
  }).flat();
  
  return (
    <MainLayout title="Create Event">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Create a New Event</CardTitle>
          <CardDescription>
            Set up your community event with all the details
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input 
                    id="title" 
                    value={eventData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter event title"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea 
                    id="description" 
                    value={eventData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your event"
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Event Type</Label>
                    <Select 
                      value={eventData.type}
                      onValueChange={(value) => handleInputChange('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(EVENT_TYPES).map((type) => (
                          <SelectItem key={type} value={type}>
                            {EVENT_TYPES[type as keyof typeof EVENT_TYPES].label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="speaker">Speaker/Host</Label>
                    <Input 
                      id="speaker" 
                      value={eventData.speaker}
                      onChange={(e) => handleInputChange('speaker', e.target.value)}
                      placeholder="Who will be hosting?"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Date & Location</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Date</Label>
                  <div className="flex items-center border rounded-md p-2">
                    <Calendar className="mr-2 h-4 w-4 opacity-50" />
                    <DatePicker
                      date={eventData.date}
                      setDate={(date) => handleInputChange('date', date)}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label>Time</Label>
                  <div className="flex gap-2 items-center">
                    <div className="flex-1 flex items-center border rounded-md p-2">
                      <Clock className="mr-2 h-4 w-4 opacity-50" />
                      <TimePicker
                        value={eventData.startTime}
                        onChange={(value) => handleInputChange('startTime', value)}
                      />
                    </div>
                    <span className="opacity-50">to</span>
                    <div className="flex-1 flex items-center border rounded-md p-2">
                      <Clock className="mr-2 h-4 w-4 opacity-50" />
                      <TimePicker
                        value={eventData.endTime}
                        onChange={(value) => handleInputChange('endTime', value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <div className="flex items-center border rounded-md pl-2">
                  <MapPin className="h-4 w-4 opacity-50" />
                  <Input 
                    id="location" 
                    value={eventData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Enter location or 'Online'"
                    className="border-0"
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Capacity & Points</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="capacity">Maximum Capacity</Label>
                  <div className="flex items-center border rounded-md pl-2">
                    <Users className="h-4 w-4 opacity-50" />
                    <Input 
                      id="capacity" 
                      type="number"
                      min="1"
                      value={eventData.capacity.toString()}
                      onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
                      placeholder="How many attendees?"
                      className="border-0"
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="points">Points for Attendance</Label>
                  <Input 
                    id="points" 
                    type="number"
                    min="0"
                    value={eventData.points.toString()}
                    onChange={(e) => handleInputChange('points', parseInt(e.target.value))}
                    placeholder="How many points for attending?"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="badge"
                  checked={eventData.badgeEnabled}
                  onCheckedChange={(checked) => handleInputChange('badgeEnabled', checked)}
                />
                <Label htmlFor="badge">Award attendance badge</Label>
              </div>
              
              {eventData.badgeEnabled && (
                <div className="grid gap-2">
                  <Label htmlFor="badgeName">Badge Name</Label>
                  <div className="flex items-center border rounded-md pl-2">
                    <Tag className="h-4 w-4 opacity-50" />
                    <Input 
                      id="badgeName" 
                      value={eventData.badgeName}
                      onChange={(e) => handleInputChange('badgeName', e.target.value)}
                      placeholder={`${eventData.title || 'Event'} Attendee`}
                      className="border-0"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Event Image</h3>
              
              <div className="grid gap-2">
                <Label htmlFor="image">Upload Cover Image</Label>
                <div className="flex items-center gap-4">
                  <div className="border border-dashed rounded-lg p-4 flex-1">
                    <div className="flex flex-col items-center justify-center gap-2 py-4">
                      <Image className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {eventData.image ? eventData.image.name : 'Drag & drop or click to upload'}
                      </p>
                      <Input 
                        id="image" 
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('image')?.click()}
                      >
                        Choose File
                      </Button>
                    </div>
                  </div>
                  
                  {eventData.image && (
                    <div className="h-32 w-32 rounded overflow-hidden">
                      <img 
                        src={URL.createObjectURL(eventData.image)} 
                        alt="Preview" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/events')}
            >
              Cancel
            </Button>
            
            <Button 
              type="submit"
              disabled={isSubmitting || !eventData.title.trim()}
            >
              {isSubmitting ? 'Creating...' : 'Create Event'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </MainLayout>
  );
};

export default CreateEvent;
