
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { EVENT_TYPES } from '@/components/events/types/EventTypes';
import BasicInformationSection from '@/components/events/form/BasicInformationSection';
import DateLocationSection from '@/components/events/form/DateLocationSection';
import CapacityPointsSection from '@/components/events/form/CapacityPointsSection';
import EventImageSection from '@/components/events/form/EventImageSection';

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
    isOnline: false,
    platform: 'zoom',
    meetingLink: '',
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
            <BasicInformationSection 
              eventData={eventData} 
              handleInputChange={handleInputChange} 
            />
            
            <DateLocationSection 
              eventData={eventData} 
              handleInputChange={handleInputChange} 
            />
            
            <CapacityPointsSection 
              eventData={eventData} 
              handleInputChange={handleInputChange} 
            />
            
            <EventImageSection 
              eventData={eventData} 
              handleFileChange={handleFileChange} 
            />
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
