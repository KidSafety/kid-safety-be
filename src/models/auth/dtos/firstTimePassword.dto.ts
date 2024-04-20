import { z } from 'zod';

export const FirstTimePasswordZSchema = z.object({
  newPassword: z.string(),
});

export type FirstTimePasswordDto = z.infer<typeof FirstTimePasswordZSchema>;
