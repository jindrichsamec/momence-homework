import { describe, it, expect } from "vitest";
import { parseRates, parseDate } from "./apiParser";
import {
  createAmountGreaterThanOne,
  createInvalidDateFormat,
  createLinesWithTooManyFields,
  createMalformedRateLine,
  createMinimalValidCnbData,
  createValidCnbRawData,
  createInvalidAmountData,
  createInvalidRateData,
  createZeroRateData,
} from "./__fixtures__/cnbRawDataFactories";

describe("parseRates", () => {
  describe("valid data parsing", () => {
    it("parses multiple currencies from real CNB data", () => {
      const lines = createValidCnbRawData().split("\n");
      const rates = parseRates(lines);

      expect(rates).toHaveLength(31);

      expect(rates[0]).toEqual({
        country: "Australia",
        currency: "dollar",
        amount: 1,
        code: "AUD",
        rate: 13.79,
      });

      expect(rates[30]).toEqual({
        country: "USA",
        currency: "dollar",
        amount: 1,
        code: "USD",
        rate: 21.095,
      });
    });

    it("parses single currency correctly", () => {
      const lines = createMinimalValidCnbData().split("\n");
      const rates = parseRates(lines);

      expect(rates).toHaveLength(1);
      expect(rates[0]).toEqual({
        country: "USA",
        currency: "dollar",
        amount: 1,
        code: "USD",
        rate: 21.095,
      });
    });

    it("handles currencies with amount > 1", () => {
      const data = createAmountGreaterThanOne();
      const lines = data.split("\n");
      const rates = parseRates(lines);

      expect(rates[0]).toEqual({
        country: "Hungary",
        currency: "forint",
        amount: 100,
        code: "HUF",
        rate: 6.267,
      });

      expect(rates[1]).toEqual({
        country: "Japan",
        currency: "yen",
        amount: 100,
        code: "JPY",
        rate: 13.669,
      });
    });
  });

  describe("error handling", () => {
    it("throws error for malformed line with missing field", () => {
      const lines = createMalformedRateLine().split("\n");

      expect(() => parseRates(lines)).toThrow(
        "Invalid currency data format in CNB data. Too few parts."
      );
    });

    it("throws error for line with too many fields", () => {
      const data = createLinesWithTooManyFields();
      const lines = data.split("\n");

      expect(() => parseRates(lines)).toThrow(
        "Invalid currency data format in CNB data. Too many parts."
      );
    });

    it("returns empty array for empty lines array", () => {
      const lines: string[] = [];
      const rates = parseRates(lines);

      // Empty array after slicing from index 2
      expect(rates).toEqual([]);
    });

    it("throws error for lines with only header", () => {
      const lines = [`30 Oct 2025`, `Country|Currency|Amount|Code|Rate`];
      const rates = parseRates(lines);

      // No currency data after header, should return empty array
      expect(rates).toEqual([]);
    });
  });

  describe("edge cases", () => {
    it("handles very large rate values", () => {
      const data = `30 Oct 2025
Country|Currency|Amount|Code|Rate
Test|currency|1|TST|999999,999`;
      const lines = data.split("\n");
      const rates = parseRates(lines);

      expect(rates[0].rate).toBe(999999.999);
    });

    it("trims whitespace from fields", () => {
      const data = `30 Oct 2025
Country|Currency|Amount|Code|Rate
  USA  |  dollar  |  1  |  USD  |  21,095  `;
      const lines = data.split("\n");
      const rates = parseRates(lines);

      expect(rates[0]).toEqual({
        country: "USA",
        currency: "dollar",
        amount: 1,
        code: "USD",
        rate: 21.095,
      });
    });
  });

  describe("parser error handling with invalid data", () => {
    it.each([
      { name: "invalid amount (string)", data: createInvalidAmountData() },
      { name: "invalid rate (NaN)", data: createInvalidRateData() },
      { name: "zero rate (not positive)", data: createZeroRateData() },
    ])("throws error for $name", ({ data }) => {
      const lines = data.split("\n");

      expect(() => parseRates(lines)).toThrow();
    });
  });
});

describe("parseDate", () => {
  describe("valid date parsing", () => {
    it("parses date from real CNB data", () => {
      const lines = createValidCnbRawData().split("\n");
      const date = parseDate(lines);

      // Should be valid ISO datetime string
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);

      // Should parse to valid Date object
      const parsedDate = new Date(date);
      expect(parsedDate.getFullYear()).toBe(2025);
      expect(parsedDate.getMonth()).toBe(9); // October (0-indexed)
      expect(parsedDate.getDate()).toBe(30);
    });

    it.each([
      { input: "30 Oct 2025", day: 30, month: 9, year: 2025 },
      { input: "1 Jan 2024", day: 1, month: 0, year: 2024 },
      { input: "15 Dec 2023", day: 15, month: 11, year: 2023 },
      { input: "28 Feb 2024", day: 28, month: 1, year: 2024 },
    ])("parses date '$input' correctly", ({ input, day, month, year }) => {
      const lines = [input, "Header", "Data"];
      const dateString = parseDate(lines);

      const parsedDate = new Date(dateString);
      expect(parsedDate.getFullYear()).toBe(year);
      expect(parsedDate.getMonth()).toBe(month);
      expect(parsedDate.getDate()).toBe(day);
    });

    it("handles date with additional text after date", () => {
      const lines = ["30 Oct 2025 #211", "Header", "Data"];
      const date = parseDate(lines);

      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      const parsedDate = new Date(date);
      expect(parsedDate.getDate()).toBe(30);
    });

    it("trims whitespace from date line", () => {
      const lines = ["  30 Oct 2025  ", "Header", "Data"];
      const date = parseDate(lines);

      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });
  });

  describe("error handling", () => {
    it("throws error for invalid date format", () => {
      const lines = createInvalidDateFormat().split("\n");

      expect(() => parseDate(lines)).toThrow("Invalid date format in CNB data");
    });

    it("throws error for empty date line", () => {
      const lines = ["", "Header", "Data"];

      expect(() => parseDate(lines)).toThrow("Invalid date format in CNB data");
    });

    it("throws error for numeric-only date", () => {
      const lines = ["30/10/2025", "Header", "Data"];

      expect(() => parseDate(lines)).toThrow("Invalid date format in CNB data");
    });

    it("throws error for empty lines array", () => {
      const lines: string[] = [];

      expect(() => parseDate(lines)).toThrow();
    });

    it("throws error for date with wrong format", () => {
      const lines = ["Oct 30, 2025", "Header", "Data"];

      expect(() => parseDate(lines)).toThrow("Invalid date format in CNB data");
    });
  });

  describe("edge cases", () => {
    it("handles single-digit day", () => {
      const lines = ["1 Jan 2025", "Header", "Data"];
      const date = parseDate(lines);

      const parsedDate = new Date(date);
      expect(parsedDate.getDate()).toBe(1);
    });

    it("handles two-digit day", () => {
      const lines = ["31 Dec 2025", "Header", "Data"];
      const date = parseDate(lines);

      const parsedDate = new Date(date);
      expect(parsedDate.getDate()).toBe(31);
    });
  });

  describe("Zod schema validation", () => {
    it("returns valid ISO 8601 datetime format", () => {
      const lines = ["30 Oct 2025", "Header", "Data"];
      const date = parseDate(lines);

      // ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sssZ
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });
});
