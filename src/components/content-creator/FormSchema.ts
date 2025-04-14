
import { z } from 'zod';

export const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  format: z.enum(['audio', 'pdf', 'text', 'url', 'youtube', 'vimeo', 'gdoc', 'image', 'course', 'link', 'video']),
  accessLevel: z.enum(['free', 'premium', 'unlockable']),
  tags: z.string().optional(),
  author: z.string().optional(),
  duration: z.string().optional(),
  resourceUrl: z.string().optional(),
  featured: z.boolean().optional(),
  pointsEnabled: z.boolean().optional(),
  pointsValue: z.number().optional(),
});

export type ContentFormValues = z.infer<typeof formSchema>;
