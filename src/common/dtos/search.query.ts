import { z } from 'zod';

const castToNumber = z.preprocess((val) => Number(val), z.number());

export const SearchQueryZSchema = z.object({
  skip: castToNumber.default(0),
  limit: castToNumber.default(10),
});

export type SearchQueryDto = z.infer<typeof SearchQueryZSchema>;
