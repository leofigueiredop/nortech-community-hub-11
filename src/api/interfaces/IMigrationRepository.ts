
export interface IMigrationRepository {
  createContentTables(): Promise<void>;
  createEventsTables(): Promise<void>;
  createDiscussionTables(): Promise<void>;
  createPointsTables(): Promise<void>;
  getMigrationStatus(): Promise<{
    content: boolean;
    events: boolean;
    discussions: boolean;
    points: boolean;
  }>;
}
