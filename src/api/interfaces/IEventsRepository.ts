
import { Event, EventAttendee } from '@/components/events/types/EventTypes';

export interface IEventsRepository {
  getAll(): Promise<Event[]>;
  getById(id: number): Promise<Event>;
  create(event: Partial<Event>): Promise<Event>;
  update(id: number, event: Partial<Event>): Promise<Event>;
  delete(id: number): Promise<void>;
  registerAttendee(eventId: number, userId: string): Promise<void>;
  unregisterAttendee(eventId: number, userId: string): Promise<void>;
  getAttendees(eventId: number): Promise<EventAttendee[]>;
  markAttendance(eventId: number, userId: string, attended: boolean): Promise<void>;
  getUpcomingEvents(limit?: number): Promise<Event[]>;
  getFeaturedEvents(): Promise<Event[]>;
  getEventsByDate(startDate: Date, endDate: Date): Promise<Event[]>;
}
