type EventListener = (...args: any[]) => void;

export class EventEmitter {
  private events: Map<string, EventListener[]>;

  constructor() {
    this.events = new Map();
  }

  on(event: string, listener: EventListener): void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(listener);
  }

  off(event: string, listener: EventListener): void {
    if (!this.events.has(event)) return;
    const listeners = this.events.get(event)!;
    const index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
    if (listeners.length === 0) {
      this.events.delete(event);
    }
  }

  emit(event: string, ...args: any[]): void {
    if (!this.events.has(event)) return;
    this.events.get(event)!.forEach(listener => {
      try {
        listener(...args);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });
  }

  removeAllListeners(event?: string): void {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
  }

  listenerCount(event: string): number {
    return this.events.has(event) ? this.events.get(event)!.length : 0;
  }
} 