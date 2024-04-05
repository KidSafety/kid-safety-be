import { z } from 'zod';

export const AddSiteBlackListZSchema = z.object({
  category: z.string().optional(),
  url: z.string(),
});

export type AddSiteBlackListDto = z.infer<typeof AddSiteBlackListZSchema>;
