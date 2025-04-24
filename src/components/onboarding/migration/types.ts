
import { z } from 'zod';

export const migrationFormSchema = z.object({
  migrationType: z.enum(['new', 'existing']),
  platform: z.string().optional(),
  file: z.any().optional(),
});

export type MigrationFormData = z.infer<typeof migrationFormSchema>;
