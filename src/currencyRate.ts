import * as z from "zod";

export const currencyRateSchema = z.object({
  country: z.string(),
  currency: z.string(),
  amount: z.number(),
  code: z.string(),
  rate: z.number(),
});

export type CurrencyRate = z.infer<typeof currencyRateSchema>;
