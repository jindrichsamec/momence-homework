import type { ExchangeList } from "../exchangeList";
import { createFakeCurrencyRates } from "./fakeCurrencyRateFactories";

/**
 * Creates a fake ExchangeList object for testing
 * @param overrides - Partial ExchangeList to override defaults
 */
export function createFakeExchangeList(
  overrides: Partial<ExchangeList> = {}
): ExchangeList {
  return {
    date: new Date("2025-10-30T00:00:00.000Z").toISOString(),
    rates: createFakeCurrencyRates(3),
    ...overrides,
  };
}
