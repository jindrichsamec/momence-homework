import * as z from "zod";
import { currencyRateSchema } from "./currencyRate.ts";

export const exchangeListSchema = z.object({
  date: z.iso.datetime(),
  rates: z.array(currencyRateSchema),
});

export type ExchangeList = z.infer<typeof exchangeListSchema>;
