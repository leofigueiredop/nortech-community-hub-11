import { Event, EventAttendee } from '@/types/events';
import { Result } from '@/types/result';
import { AppError } from '@/types/error';

export interface IEventsRepository {
  getAll(): Promise<Result<Event[], AppError>>;
  getById(id: number): Promise<Result<Event, AppError>>;
  create(event: Partial<Event>): Promise<Result<Event, AppError>>;
  update(id: number, event: Partial<Event>): Promise<Result<Event, AppError>>;
  delete(id: number): Promise<Result<void, AppError>>;
  registerAttendee(eventId: number, userId: string): Promise<Result<void, AppError>>;
  unregisterAttendee(eventId: number, userId: string): Promise<Result<void, AppError>>;
  getAttendees(eventId: number): Promise<Result<EventAttendee[], AppError>>;
  markAttendance(eventId: number, userId: string, attended: boolean): Promise<Result<void, AppError>>;
  getUpcomingEvents(limit?: number): Promise<Result<Event[], AppError>>;
  getFeaturedEvents(): Promise<Result<Event[], AppError>>;
  getEventsByDate(startDate: Date, endDate: Date): Promise<Result<Event[], AppError>>;
  checkInAttendee(eventId: number, userId: string): Promise<Result<boolean, AppError>>;
  getEventAttendees(eventId: number): Promise<Result<EventAttendee[], AppError>>;
  searchAttendees(eventId: number, query: string): Promise<Result<EventAttendee[], AppError>>;
  getUpcomingEvents(filters?: EventFilters): Promise<Result<Event[], AppError>>;
  scheduleEventReminder(eventId: number, userId: string): Promise<Result<boolean, AppError>>;
}

export interface EventFilters {
  isPremium?: boolean;
  isUpcoming?: boolean;
  timeframe?: 'today' | 'week' | 'month' | 'all';
  accessLevel?: 'free' | 'premium' | 'premium_plus';
}
