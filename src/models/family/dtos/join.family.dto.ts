import { z } from 'zod';

export const JoinFamilyZSchema = z.object({
  parentEmail: z.string(),
});

export type JoinFamilyDto = z.infer<typeof JoinFamilyZSchema>;
