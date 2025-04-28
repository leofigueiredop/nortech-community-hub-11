
import { Event } from '@/components/events/types/EventTypes';

export interface IEventsRepository {
  getAll(): Promise<Event[]>;
  getById(id: number): Promise<Event>;
  create(event: Partial<Event>): Promise<Event>;
  update(id: number, event: Partial<Event>): Promise<Event>;
  delete(id: number): Promise<void>;
  registerAttendee(eventId: number, userId: string): Promise<void>;
}
