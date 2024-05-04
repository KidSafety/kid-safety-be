import { z } from 'zod';

export const RemoveFromFamilyZSchema = z.object({
  parentId: z.string(),
  userId: z.string(), // user being removed
});

export type RemoveFromFamilyDto = z.infer<typeof RemoveFromFamilyZSchema>;
