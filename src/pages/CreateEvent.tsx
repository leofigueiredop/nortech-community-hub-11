
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
    image: null as File | null,
    ticketUrl: '',
    isPaid: false,
    isPremium: false,
    premiumDescription: ''
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

            {/* Ticket Information Section */}
            <div>
              <h3 className="text-lg font-medium mb-4">Ticket Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isPremium"
                      checked={eventData.isPremium}
                      onChange={(e) => handleInputChange('isPremium', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor="isPremium" className="text-sm font-medium">
                      This is a premium event
                    </label>
                  </div>
                  
                  {eventData.isPremium && (
                    <div className="grid grid-cols-1 gap-2">
                      <label htmlFor="premiumDescription" className="text-sm font-medium">
                        Premium Description
                      </label>
                      <textarea
                        id="premiumDescription"
                        value={eventData.premiumDescription}
                        onChange={(e) => handleInputChange('premiumDescription', e.target.value)}
                        placeholder="Describe what makes this a premium event (e.g., 'Live class with exclusive content')"
                        className="px-3 py-2 border border-gray-300 rounded-md"
                        rows={3}
                      />
                      <p className="text-xs text-gray-500">
                        This description will be displayed to users considering purchasing premium access
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isPaid"
                      checked={eventData.isPaid}
                      onChange={(e) => handleInputChange('isPaid', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor="isPaid" className="text-sm font-medium">
                      This event requires payment
                    </label>
                  </div>
                  
                  {eventData.isPaid && (
                    <div className="grid grid-cols-1 gap-2">
                      <label htmlFor="ticketUrl" className="text-sm font-medium">
                        External Ticket URL
                      </label>
                      <input
                        type="text"
                        id="ticketUrl"
                        value={eventData.ticketUrl}
                        onChange={(e) => handleInputChange('ticketUrl', e.target.value)}
                        placeholder="https://ticketing-site.com/your-event"
                        className="px-3 py-2 border border-gray-300 rounded-md"
                      />
                      <p className="text-xs text-gray-500">
                        Provide a link where attendees can purchase tickets for this event
                      </p>
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
