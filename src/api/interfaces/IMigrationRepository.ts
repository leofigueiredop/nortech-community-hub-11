
export interface IMigrationRepository {
  runMigrations(): Promise<boolean>;
  getMigrationStatus?: () => Promise<boolean>;
  createContentTables?: () => Promise<boolean>;
  createEventsTables?: () => Promise<boolean>;
  createDiscussionTables?: () => Promise<boolean>;
  createPointsTables?: () => Promise<boolean>;
}
