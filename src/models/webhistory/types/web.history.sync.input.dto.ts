import { z } from 'zod';

export const WebHistorySyncZSchema = z.object({
  id: z.string(),
  lastVisitTime: z.number(),
  title: z.string(),
  typedCount: z.number(),
  url: z.string(),
  visitCount: z.number(),
});

export type WebHistorySyncInputDto = z.infer<typeof WebHistorySyncZSchema>;
