import type { CurrencyRate } from "../currencyRate";

/**
 * Creates a fake CurrencyRate object for testing
 * @param overrides - Partial CurrencyRate to override defaults
 */
export function createFakeCurrencyRate(
  overrides: Partial<CurrencyRate> = {}
): CurrencyRate {
  return {
    country: "USA",
    currency: "dollar",
    amount: 1,
    code: "USD",
    rate: 21.095,
    ...overrides,
  };
}

/**
 * Creates an array of fake CurrencyRate objects
 * @param count - Number of currency rates to create
 * @param overrides - Array of partial overrides for each rate
 */
export function createFakeCurrencyRates(
  count: number = 3,
  overrides: Partial<CurrencyRate>[] = []
): CurrencyRate[] {
  const rates: CurrencyRate[] = [];

  for (let i = 0; i < count; i++) {
    rates.push(
      createFakeCurrencyRate({
        code: `CUR${i}`,
        rate: 10 + i,
        ...overrides[i],
      })
    );
  }

  return rates;
}
