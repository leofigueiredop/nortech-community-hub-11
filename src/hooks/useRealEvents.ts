import { useState, useCallback, useEffect } from 'react';
import { api } from '@/api/ApiClient';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Event, EventAttendee } from '@/types/events';
import { EventFilters } from '@/api/interfaces/IEventsRepository';
import { format } from 'date-fns';

export const useRealEvents = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [attendees, setAttendees] = useState<EventAttendee[]>([]);
  const { user, community } = useAuth();
  const { toast } = useToast();

  // Load all events
  const loadAllEvents = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await api.events.getAll();
      if (error) {
        throw error;
      }
      
      if (data) {
        const eventsWithUI = data.map(event => ({
          ...event,
          isRegistered: false, // Will be updated later
          status: getEventStatus(event)
        }));
        setEvents(eventsWithUI);
      }
    } catch (error) {
      console.error('Error loading events:', error);
      toast({
        title: 'Error',
        description: 'Failed to load events',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Load upcoming events with optional filters
  const loadUpcomingEvents = useCallback(async (filters?: EventFilters) => {
    setLoading(true);
    try {
      const { data, error } = await api.events.getUpcomingEvents(filters);
      if (error) {
        throw error;
      }
      
      if (data) {
        const eventsWithUI = data.map(event => ({
          ...event,
          isRegistered: false, // Will be updated later
          status: getEventStatus(event)
        }));
        setUpcomingEvents(eventsWithUI);
      }
    } catch (error) {
      console.error('Error loading upcoming events:', error);
      toast({
        title: 'Error',
        description: 'Failed to load upcoming events',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Load featured events
  const loadFeaturedEvents = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await api.events.getFeaturedEvents();
      if (error) {
        throw error;
      }
      
      if (data) {
        const eventsWithUI = data.map(event => ({
          ...event,
          isRegistered: false, // Will be updated later
          status: getEventStatus(event)
        }));
        setFeaturedEvents(eventsWithUI);
      }
    } catch (error) {
      console.error('Error loading featured events:', error);
      toast({
        title: 'Error',
        description: 'Failed to load featured events',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Load single event by ID
  const loadEvent = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const { data, error } = await api.events.getById(id);
      if (error) {
        throw error;
      }
      
      if (data) {
        // Check if user is registered
        let isRegistered = false;
        
        if (user) {
          const { data: attendees } = await api.events.getAttendees(id);
          if (attendees) {
            isRegistered = attendees.some(a => a.user_id === user.id);
          }
        }
        
        setCurrentEvent({
          ...data,
          isRegistered,
          status: getEventStatus(data)
        });
      }
    } catch (error) {
      console.error(`Error loading event ${id}:`, error);
      toast({
        title: 'Error',
        description: 'Failed to load event details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Load events by date range
  const loadEventsByDate = useCallback(async (startDate: Date, endDate: Date) => {
    setLoading(true);
    try {
      const { data, error } = await api.events.getEventsByDate(startDate, endDate);
      if (error) {
        throw error;
      }
      
      if (data) {
        const eventsWithUI = data.map(event => ({
          ...event,
          isRegistered: false, // Will be updated later
          status: getEventStatus(event)
        }));
        return eventsWithUI;
      }
      return [];
    } catch (error) {
      console.error('Error loading events by date:', error);
      toast({
        title: 'Error',
        description: 'Failed to load events for the selected dates',
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Load attendees for an event
  const loadAttendees = useCallback(async (eventId: number) => {
    setLoading(true);
    try {
      const { data, error } = await api.events.getEventAttendees(eventId);
      if (error) {
        throw error;
      }
      
      if (data) {
        setAttendees(data);
      }
      return data || [];
    } catch (error) {
      console.error(`Error loading attendees for event ${eventId}:`, error);
      toast({
        title: 'Error',
        description: 'Failed to load event attendees',
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Register for an event
  const registerForEvent = useCallback(async (eventId: number) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to register for events',
        variant: 'destructive',
      });
      return false;
    }

    setLoading(true);
    try {
      const { error } = await api.events.registerAttendee(eventId, user.id);
      if (error) {
        throw error;
      }
      
      // Update local state
      if (currentEvent && currentEvent.id === eventId) {
        setCurrentEvent(prev => {
          if (!prev) return null;
          return {
            ...prev,
            isRegistered: true
          };
        });
      }
      
      setEvents(prev => 
        prev.map(event => 
          event.id === eventId 
            ? { ...event, isRegistered: true }
            : event
        )
      );
      
      setUpcomingEvents(prev => 
        prev.map(event => 
          event.id === eventId 
            ? { ...event, isRegistered: true }
            : event
        )
      );
      
      setFeaturedEvents(prev => 
        prev.map(event => 
          event.id === eventId 
            ? { ...event, isRegistered: true }
            : event
        )
      );
      
      toast({
        title: 'Registration Successful',
        description: 'You have been registered for this event',
      });
      
      return true;
    } catch (error) {
      console.error(`Error registering for event ${eventId}:`, error);
      toast({
        title: 'Registration Failed',
        description: 'Unable to register for this event',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, currentEvent, toast]);

  // Unregister from an event
  const unregisterFromEvent = useCallback(async (eventId: number) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to unregister from events',
        variant: 'destructive',
      });
      return false;
    }

    setLoading(true);
    try {
      const { error } = await api.events.unregisterAttendee(eventId, user.id);
      if (error) {
        throw error;
      }
      
      // Update local state
      if (currentEvent && currentEvent.id === eventId) {
        setCurrentEvent(prev => {
          if (!prev) return null;
          return {
            ...prev,
            isRegistered: false
          };
        });
      }
      
      setEvents(prev => 
        prev.map(event => 
          event.id === eventId 
            ? { ...event, isRegistered: false }
            : event
        )
      );
      
      setUpcomingEvents(prev => 
        prev.map(event => 
          event.id === eventId 
            ? { ...event, isRegistered: false }
            : event
        )
      );
      
      setFeaturedEvents(prev => 
        prev.map(event => 
          event.id === eventId 
            ? { ...event, isRegistered: false }
            : event
        )
      );
      
      toast({
        title: 'Unregistration Successful',
        description: 'You have been unregistered from this event',
      });
      
      return true;
    } catch (error) {
      console.error(`Error unregistering from event ${eventId}:`, error);
      toast({
        title: 'Unregistration Failed',
        description: 'Unable to unregister from this event',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, currentEvent, toast]);

  // Mark attendance for an event
  const markAttendance = useCallback(async (eventId: number, userId: string, attended: boolean) => {
    setLoading(true);
    try {
      const { error } = await api.events.markAttendance(eventId, userId, attended);
      if (error) {
        throw error;
      }
      
      // Update attendees list
      setAttendees(prev => 
        prev.map(attendee => 
          attendee.event_id === eventId && attendee.user_id === userId
            ? { ...attendee, attended }
            : attendee
        )
      );
      
      toast({
        title: 'Attendance Updated',
        description: `Attendance ${attended ? 'marked' : 'unmarked'} for user`,
      });
      
      return true;
    } catch (error) {
      console.error(`Error marking attendance for event ${eventId}:`, error);
      toast({
        title: 'Update Failed',
        description: 'Unable to update attendance',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Check in for an event
  const checkInAttendee = useCallback(async (eventId: number) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to check in to events',
        variant: 'destructive',
      });
      return false;
    }

    setLoading(true);
    try {
      const { data, error } = await api.events.checkInAttendee(eventId, user.id);
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Check-in Successful',
        description: 'Your attendance has been recorded for this event',
      });
      
      return data || false;
    } catch (error) {
      console.error(`Error checking in for event ${eventId}:`, error);
      toast({
        title: 'Check-in Failed',
        description: 'Unable to check in for this event',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Create a new event
  const createEvent = useCallback(async (event: Partial<Event>) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to create events',
        variant: 'destructive',
      });
      return null;
    }

    setLoading(true);
    try {
      const { data, error } = await api.events.create({
        ...event,
        organizer_id: user.id,
        community_id: community?.id || '',
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Event Created',
        description: 'Your event has been created successfully',
      });
      
      // Update local state
      if (data) {
        const eventWithUI = {
          ...data,
          isRegistered: false,
          status: getEventStatus(data)
        };
        
        setEvents(prev => [eventWithUI, ...prev]);
        
        // Update upcoming events if this is an upcoming event
        if (eventWithUI.status === 'upcoming') {
          setUpcomingEvents(prev => [eventWithUI, ...prev]);
        }
        
        // Update featured events if this is a featured event
        if (data.is_featured) {
          setFeaturedEvents(prev => [eventWithUI, ...prev]);
        }
      }
      
      return data;
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: 'Event Creation Failed',
        description: 'Unable to create your event',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, community, toast]);

  // Update an existing event
  const updateEvent = useCallback(async (id: number, eventData: Partial<Event>) => {
    setLoading(true);
    try {
      const { data, error } = await api.events.update(id, eventData);
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Event Updated',
        description: 'Your event has been updated successfully',
      });
      
      // Update local state
      if (data) {
        const eventWithUI = {
          ...data,
          isRegistered: currentEvent?.isRegistered || false,
          status: getEventStatus(data)
        };
        
        if (currentEvent && currentEvent.id === id) {
          setCurrentEvent(eventWithUI);
        }
        
        setEvents(prev => 
          prev.map(event => 
            event.id === id 
              ? eventWithUI
              : event
          )
        );
        
        setUpcomingEvents(prev => 
          prev.map(event => 
            event.id === id 
              ? eventWithUI
              : event
          )
        );
        
        setFeaturedEvents(prev => 
          prev.map(event => 
            event.id === id 
              ? eventWithUI
              : event
          )
        );
      }
      
      return data;
    } catch (error) {
      console.error(`Error updating event ${id}:`, error);
      toast({
        title: 'Update Failed',
        description: 'Unable to update event details',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentEvent, toast]);

  // Delete an event
  const deleteEvent = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const { error } = await api.events.delete(id);
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Event Deleted',
        description: 'The event has been deleted successfully',
      });
      
      // Update local state
      if (currentEvent && currentEvent.id === id) {
        setCurrentEvent(null);
      }
      
      setEvents(prev => prev.filter(event => event.id !== id));
      setUpcomingEvents(prev => prev.filter(event => event.id !== id));
      setFeaturedEvents(prev => prev.filter(event => event.id !== id));
      
      return true;
    } catch (error) {
      console.error(`Error deleting event ${id}:`, error);
      toast({
        title: 'Deletion Failed',
        description: 'Unable to delete the event',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentEvent, toast]);

  // Helper function to get event status
  const getEventStatus = (event: Event): 'upcoming' | 'live' | 'ended' | 'happening_soon' | 'in_progress' => {
    const eventStartDate = event.start_date ? new Date(event.start_date) : new Date(event.date);
    const eventEndDate = event.end_date ? new Date(event.end_date) : new Date(eventStartDate);
    
    // Add 2 hours to the event start time if no end date is specified
    if (!event.end_date) {
      eventEndDate.setHours(eventEndDate.getHours() + 2);
    }
    
    const now = new Date();
    
    // Event happening within the next hour
    const oneHourFromNow = new Date(now);
    oneHourFromNow.setHours(oneHourFromNow.getHours() + 1);
    
    if (now < eventStartDate && eventStartDate <= oneHourFromNow) {
      return 'happening_soon';
    } else if (eventStartDate <= now && now <= eventEndDate) {
      return 'in_progress';
    } else if (now < eventStartDate) {
      return 'upcoming';
    } else {
      return 'ended';
    }
  };

  // Filter events by various criteria
  const filterEvents = useCallback((events: Event[], filters: {
    isPremium?: boolean | 'all';
    type?: string | string[];
    showAvailableOnly?: boolean;
    selectedDate?: Date;
  }) => {
    return events.filter(event => {
      // Filter by premium status
      if (filters.isPremium === true && !event.isPremium) {
        return false;
      }
      if (filters.isPremium === false && event.isPremium) {
        return false;
      }
      
      // Filter by event type
      if (filters.type && filters.type !== 'all') {
        if (Array.isArray(filters.type)) {
          if (!event.event_type && !event.type) return false;
          const eventType = event.event_type || event.type;
          return filters.type.includes(eventType?.toLowerCase() || '');
        } else {
          if (!event.event_type && !event.type) return false;
          const eventType = event.event_type || event.type;
          return eventType?.toLowerCase() === filters.type.toLowerCase();
        }
      }
      
      // Filter by availability
      if (filters.showAvailableOnly) {
        const capacity = typeof event.capacity === 'string' 
          ? parseInt(event.capacity) 
          : event.capacity || 0;
          
        const attendees = typeof event.attendees === 'string'
          ? parseInt(event.attendees)
          : event.attendees || 0;
          
        if (attendees >= capacity && capacity !== 0) {
          return false;
        }
      }
      
      // Filter by date
      if (filters.selectedDate) {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === filters.selectedDate.getDate() && 
              eventDate.getMonth() === filters.selectedDate.getMonth() &&
              eventDate.getFullYear() === filters.selectedDate.getFullYear();
      }
      
      return true;
    });
  }, []);

  // Format event time from start and end dates
  const formatEventTime = useCallback((startDate: string, endDate?: string, timezone?: string): string => {
    const start = new Date(startDate);
    
    if (!endDate) {
      return format(start, 'h:mm a');
    }
    
    const end = new Date(endDate);
    
    // If the dates are on the same day
    if (start.toDateString() === end.toDateString()) {
      return `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}${timezone ? ` (${timezone})` : ''}`;
    }
    
    // If the dates are on different days
    return `${format(start, 'MMM d, h:mm a')} - ${format(end, 'MMM d, h:mm a')}${timezone ? ` (${timezone})` : ''}`;
  }, []);

  return {
    loading,
    events,
    upcomingEvents,
    featuredEvents,
    currentEvent,
    attendees,
    loadAllEvents,
    loadUpcomingEvents,
    loadFeaturedEvents,
    loadEvent,
    loadEventsByDate,
    loadAttendees,
    registerForEvent,
    unregisterFromEvent,
    markAttendance,
    checkInAttendee,
    createEvent,
    updateEvent,
    deleteEvent,
    filterEvents,
    formatEventTime
  };
}; 