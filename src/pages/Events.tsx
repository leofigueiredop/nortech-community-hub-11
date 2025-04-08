
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Grid, List } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const EVENTS = [
  {
    id: 1,
    title: "React Workshop: Building Modern UIs",
    description: "Learn how to build beautiful UIs with React and modern design principles",
    date: new Date(2025, 3, 8), // April 8, 2025
    time: "10:00 AM - 12:00 PM",
    type: "workshop",
    location: "Online",
    speaker: "Alex Johnson"
  },
  {
    id: 2,
    title: "Community Q&A Session",
    description: "Open discussion and Q&A with the community members",
    date: new Date(2025, 3, 15), // April 15, 2025
    time: "6:00 PM - 7:30 PM",
    type: "meetup",
    location: "Online",
    speaker: "Emma Wilson"
  },
  {
    id: 3,
    title: "State Management Deep Dive",
    description: "Exploring different state management solutions and when to use them",
    date: new Date(2025, 3, 22), // April 22, 2025
    time: "2:00 PM - 4:00 PM",
    type: "webinar",
    location: "Online",
    speaker: "Marcus Chen"
  }
];

const EventCard = ({ event }) => {
  const eventTypeColors = {
    workshop: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    meetup: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    webinar: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{event.title}</CardTitle>
            <CardDescription className="text-sm">
              {format(event.date, 'MMMM d, yyyy')} • {event.time}
            </CardDescription>
          </div>
          <Badge className={eventTypeColors[event.type]}>
            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{event.description}</p>
        <div className="flex flex-col space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Speaker</span>
            <span>{event.speaker}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Location</span>
            <span>{event.location}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Events = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState(new Date());
  const [viewType, setViewType] = useState('calendar');

  const handleCreateEvent = () => {
    // Implementation would go here
  };

  // Filter events for the selected date
  const selectedDateEvents = EVENTS.filter(event => 
    date && event.date.toDateString() === date.toDateString()
  );

  // Filter events for the current month
  const currentMonthEvents = EVENTS.filter(event => 
    event.date.getMonth() === month.getMonth() && 
    event.date.getFullYear() === month.getFullYear()
  );

  const handlePreviousMonth = () => {
    setMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  };

  const handleNextMonth = () => {
    setMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
  };

  return (
    <MainLayout title="Events">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Events</h1>
          <div className="flex items-center gap-3">
            <div className="border rounded-lg flex overflow-hidden">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`rounded-none ${viewType === 'calendar' ? 'bg-muted' : ''}`}
                onClick={() => setViewType('calendar')}
              >
                <CalendarIcon size={16} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className={`rounded-none ${viewType === 'list' ? 'bg-muted' : ''}`}
                onClick={() => setViewType('list')}
              >
                <List size={16} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className={`rounded-none ${viewType === 'grid' ? 'bg-muted' : ''}`}
                onClick={() => setViewType('grid')}
              >
                <Grid size={16} />
              </Button>
            </div>
            <Button 
              onClick={handleCreateEvent}
              className="flex items-center gap-2 bg-nortech-purple hover:bg-nortech-purple/90"
            >
              <Plus size={16} />
              <span>New Event</span>
            </Button>
          </div>
        </div>

        {viewType === 'calendar' && (
          <div className="flex flex-col md:flex-row gap-6">
            <Card className="md:w-3/5">
              <CardHeader className="pb-0">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">
                    {format(month, 'MMMM yyyy')}
                  </h2>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={handlePreviousMonth}>
                      <ChevronLeft size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleNextMonth}>
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  month={month}
                  onMonthChange={setMonth}
                  className="rounded-md border"
                  disabled={{ before: new Date() }}
                />
              </CardContent>
            </Card>

            <div className="md:w-2/5">
              <h2 className="text-lg font-medium mb-4">
                {date ? format(date, 'MMMM d, yyyy') : 'No date selected'}
              </h2>
              
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-gray-500">
                    <p>No events scheduled for this date.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {viewType === 'list' && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Upcoming Events</h2>
            </CardHeader>
            <CardContent>
              {currentMonthEvents.length > 0 ? (
                currentMonthEvents
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .map(event => (
                    <EventCard key={event.id} event={event} />
                  ))
              ) : (
                <div className="py-8 text-center text-gray-500">
                  <p>No events scheduled for this month.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {viewType === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentMonthEvents.length > 0 ? (
              currentMonthEvents.map(event => (
                <Card key={event.id} className="flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {format(event.date, 'MMMM d, yyyy')} • {event.time}
                        </CardDescription>
                      </div>
                      <Badge className="bg-nortech-purple">
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-6 flex-grow">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{event.description}</p>
                  </CardContent>
                  <div className="mt-auto px-6 pb-6">
                    <Button className="w-full">Register</Button>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-gray-500">
                <p>No events scheduled for this month.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Events;
