import { z } from 'zod';

export const AddSiteWhiteListZSchema = z.object({
  url: z.string(),
});

export type AddSiteWhiteListDto = z.infer<typeof AddSiteWhiteListZSchema>;
