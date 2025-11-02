import { describe, it, expect } from "vitest";
import { currencyRateSchema } from "./currencyRate";
import { createFakeCurrencyRate } from "./__fixtures__/fakeCurrencyRateFactories";

describe("currencyRateSchema", () => {
  describe("valid data", () => {
    it("validates currency rate with Zod schema", () => {
      const validRate = createFakeCurrencyRate();

      expect(() => currencyRateSchema.parse(validRate)).not.toThrow();
    });

    it("validates all required fields", () => {
      const validRate = createFakeCurrencyRate({
        country: "Germany",
        currency: "euro",
        amount: 1,
        code: "EUR",
        rate: 24.38,
      });

      const result = currencyRateSchema.parse(validRate);

      expect(result).toEqual(validRate);
    });

    it("handles currencies with amount > 1", () => {
      const validRate = createFakeCurrencyRate({
        amount: 100,
      });

      expect(() => currencyRateSchema.parse(validRate)).not.toThrow();
    });
  });

  describe("invalid types", () => {
    it.each([
      {
        name: "string amount",
        data: {
          country: "USA",
          currency: "dollar",
          amount: "1" as unknown,
          code: "USD",
          rate: 21.095,
        },
      },
      {
        name: "string rate",
        data: {
          country: "USA",
          currency: "dollar",
          amount: 1,
          code: "USD",
          rate: "21.095" as unknown,
        },
      },
      { name: "NaN rate", data: createFakeCurrencyRate({ rate: NaN }) },
      { name: "zero rate", data: createFakeCurrencyRate({ rate: 0 }) },
      { name: "negative rate", data: createFakeCurrencyRate({ rate: -10 }) },
      { name: "zero amount", data: createFakeCurrencyRate({ amount: 0 }) },
      {
        name: "negative amount",
        data: createFakeCurrencyRate({ amount: -20 }),
      },
      {
        name: "NaN amount",
        data: createFakeCurrencyRate({ amount: NaN }),
      },
    ])("throws error for $name", ({ data }) => {
      expect(() => currencyRateSchema.parse(data)).toThrow();
    });
  });

  describe("missing required fields", () => {
    it.each([
      {
        name: "country",
        data: { currency: "dollar", amount: 1, code: "USD", rate: 21.095 },
      },
      {
        name: "currency",
        data: { country: "USA", amount: 1, code: "USD", rate: 21.095 },
      },
      {
        name: "amount",
        data: { country: "USA", currency: "dollar", code: "USD", rate: 21.095 },
      },
      {
        name: "code",
        data: { country: "USA", currency: "dollar", amount: 1, rate: 21.095 },
      },
      {
        name: "rate",
        data: { country: "USA", currency: "dollar", amount: 1, code: "USD" },
      },
    ])("throws error for missing $name", ({ data }) => {
      expect(() => currencyRateSchema.parse(data)).toThrow();
    });
  });

  describe("edge cases", () => {
    it.each([
      { name: "very large rate values", overrides: { rate: 999999.999 } },
      { name: "very small rate values", overrides: { rate: 0.001 } },
      { name: "empty string for country", overrides: { country: "" } },
    ])("handles $name", ({ overrides }) => {
      const validRate = createFakeCurrencyRate(overrides);

      expect(() => currencyRateSchema.parse(validRate)).not.toThrow();
    });
  });

  describe("extra fields", () => {
    it("strips extra fields not in schema", () => {
      const rateWithExtra = {
        ...createFakeCurrencyRate(),
        extraField: "should be removed",
      };

      const result = currencyRateSchema.parse(rateWithExtra);

      expect(result).not.toHaveProperty("extraField");
    });
  });
});
