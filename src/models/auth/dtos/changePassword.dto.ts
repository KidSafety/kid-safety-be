import { z } from 'zod';

export const ChangePasswordZSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string(),
});

export type ChangePasswordDto = z.infer<typeof ChangePasswordZSchema>;
