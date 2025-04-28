
export interface IMigrationRepository {
  runMigrations(): Promise<boolean>;
}
