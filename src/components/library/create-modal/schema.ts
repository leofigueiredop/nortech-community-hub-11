
import { z } from 'zod';

export const contentFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  format: z.string().min(1, 'Format is required'),
  accessLevel: z.enum(['free', 'premium', 'unlockable']),
  pointsEnabled: z.boolean().default(false),
  pointsValue: z.number().default(100),
  featured: z.boolean().default(false),
  addToCarousel: z.boolean().default(false),
  linkToCourse: z.string().optional(),
  scheduleDate: z.string().optional(),
  attachToChallenge: z.string().optional(),
  internalNotes: z.string().optional(),
});
