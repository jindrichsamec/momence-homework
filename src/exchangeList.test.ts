import { describe, it, expect } from "vitest";
import { exchangeListSchema } from "./exchangeList";
import { createFakeExchangeList } from "./__fixtures__/fakeExchangeListFactories";
import { createFakeCurrencyRates } from "./__fixtures__/fakeCurrencyRateFactories";

describe("exchangeListSchema", () => {
  describe("valid data", () => {
    it("validates exchange list with Zod schema", () => {
      const validList = createFakeExchangeList();

      expect(() => exchangeListSchema.parse(validList)).not.toThrow();
    });

    it("validates all required fields", () => {
      const validList = createFakeExchangeList({
        date: "2025-10-30T00:00:00.000Z",
        rates: createFakeCurrencyRates(2),
      });

      const result = exchangeListSchema.parse(validList);

      expect(result).toEqual(validList);
    });

    it("handles empty rates array", () => {
      const validList = createFakeExchangeList({
        rates: [],
      });

      expect(() => exchangeListSchema.parse(validList)).not.toThrow();
    });

    it("handles large number of rates", () => {
      const validList = createFakeExchangeList({
        rates: createFakeCurrencyRates(100),
      });

      expect(() => exchangeListSchema.parse(validList)).not.toThrow();
    });
  });

  describe("invalid date format", () => {
    it.each([
      { name: "non-ISO datetime string", date: "30 Oct 2025" },
      { name: "date without time", date: "2025-10-30" },
      { name: "invalid date string", date: "not a date" },
      { name: "empty date string", date: "" },
    ])("throws error for $name", ({ date }) => {
      const invalidList = {
        date,
        rates: createFakeCurrencyRates(1),
      };

      expect(() => exchangeListSchema.parse(invalidList)).toThrow();
    });
  });

  describe("invalid rates array", () => {
    it("throws error for non-array rates", () => {
      const invalidList = {
        date: "2025-10-30T00:00:00.000Z",
        rates: "not an array" as string,
      };

      expect(() => exchangeListSchema.parse(invalidList)).toThrow();
    });

    it("throws error for rates with invalid items", () => {
      const invalidList = {
        date: "2025-10-30T00:00:00.000Z",
        rates: [
          {
            country: "USA",
            // Missing required fields
          },
        ],
      };

      expect(() => exchangeListSchema.parse(invalidList)).toThrow();
    });

    it("throws error for rates with mixed valid/invalid items", () => {
      const rates = createFakeCurrencyRates(1);
      const invalidList = {
        date: "2025-10-30T00:00:00.000Z",
        rates: [
          rates[0],
          { invalid: "data" }, // Invalid rate
        ],
      };

      expect(() => exchangeListSchema.parse(invalidList)).toThrow();
    });
  });

  describe("missing required fields", () => {
    it.each([
      {
        name: "date",
        data: { rates: createFakeCurrencyRates(1) },
      },
      {
        name: "rates",
        data: { date: "2025-10-30T00:00:00.000Z" },
      },
    ])("throws error for missing $name", ({ data }) => {
      expect(() => exchangeListSchema.parse(data)).toThrow();
    });
  });

  describe("edge cases", () => {
    it.each([
      {
        name: "ISO datetime with milliseconds",
        date: "2025-10-30T12:34:56.789Z",
        shouldThrow: false,
      },
      {
        name: "ISO datetime without milliseconds",
        date: "2025-10-30T12:34:56Z",
        shouldThrow: false,
      },
      {
        name: "ISO datetime with timezone offset (only Z accepted)",
        date: "2025-10-30T12:34:56+02:00",
        shouldThrow: true,
      },
    ])("$name", ({ date, shouldThrow }) => {
      const list = createFakeExchangeList({ date });

      if (shouldThrow) {
        expect(() => exchangeListSchema.parse(list)).toThrow();
      } else {
        expect(() => exchangeListSchema.parse(list)).not.toThrow();
      }
    });
  });

  describe("extra fields", () => {
    it("strips extra fields not in schema", () => {
      const listWithExtra = {
        ...createFakeExchangeList(),
        extraField: "should be removed",
      };

      const result = exchangeListSchema.parse(listWithExtra);

      expect(result).not.toHaveProperty("extraField");
    });
  });
});
