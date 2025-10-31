import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  convertCnbResponseToJson,
  fetchCnbData,
  fetchCnbDataAsJson,
} from "./apiClient";
import {
  createValidCnbRawData,
  createMinimalValidCnbData,
  createInvalidDateFormat,
  createTooFewLines,
  createEmptyData,
  createDataWithBlanks,
} from "./__fixtures__/cnbRawDataFactories";

describe("convertCnbResponseToJson", () => {
  describe("valid data", () => {
    it("converts minimal valid CNB data", async () => {
      const result = await convertCnbResponseToJson(
        createMinimalValidCnbData()
      );

      expect(result).toHaveProperty("rates");
      expect(result).toHaveProperty("date");
      expect(result.rates).toHaveLength(1);
      expect(result.rates[0]).toMatchObject({
        country: "USA",
        currency: "dollar",
        amount: 1,
        code: "USD",
        rate: 21.095,
      });
    });

    it("converts full CNB data with multiple currencies", async () => {
      const result = await convertCnbResponseToJson(createValidCnbRawData());

      expect(result.rates).toHaveLength(31);
      expect(result.date).toBeDefined();
    });

    it("handles data with extra blank lines", async () => {
      const result = await convertCnbResponseToJson(createDataWithBlanks());

      expect(result.rates).toHaveLength(1);
    });
  });

  describe("invalid format", () => {
    it.each([
      { name: "too few lines", data: createTooFewLines() },
      { name: "empty data", data: createEmptyData() },
      { name: "only whitespace", data: "   \n   \n   " },
    ])("throws error for $name", async ({ data }) => {
      await expect(convertCnbResponseToJson(data)).rejects.toThrow(
        "Invalid CNB data format. Too few lines."
      );
    });
  });

  describe("invalid content", () => {
    it("throws error for invalid date format", async () => {
      await expect(
        convertCnbResponseToJson(createInvalidDateFormat())
      ).rejects.toThrow();
    });
  });
});

describe("fetchCnbData", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("success", () => {
    it("returns text response from CNB API", async () => {
      const mockData = createValidCnbRawData();
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        text: async () => mockData,
      } as Response);

      const result = await fetchCnbData();

      expect(result).toBe(mockData);
      expect(fetch).toHaveBeenCalledWith(
        "https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt"
      );
    });
  });

  describe("failure", () => {
    it.each([
      { name: "404 Not Found", status: 404, statusText: "Not Found" },
      {
        name: "500 Server Error",
        status: 500,
        statusText: "Internal Server Error",
      },
      {
        name: "503 Service Unavailable",
        status: 503,
        statusText: "Service Unavailable",
      },
    ])("throws error for $name", async ({ status, statusText }) => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status,
        statusText,
      } as Response);

      await expect(fetchCnbData()).rejects.toThrow(
        `Failed to fetch CNB data: ${statusText}`
      );
    });

    it("throws error for network failure", async () => {
      vi.mocked(fetch).mockRejectedValue(new Error("Network error"));

      await expect(fetchCnbData()).rejects.toThrow("Network error");
    });
  });
});

describe("fetchCnbDataAsJson", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("success", () => {
    it("returns valid ExchangeList from CNB API", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        text: async () => createValidCnbRawData(),
      } as Response);

      const result = await fetchCnbDataAsJson();

      expect(result).toHaveProperty("rates");
      expect(result).toHaveProperty("date");
      expect(result.rates).toHaveLength(31);
    });
  });

  describe("failure", () => {
    it("propagates fetch error", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        statusText: "Not Found",
      } as Response);

      await expect(fetchCnbDataAsJson()).rejects.toThrow(
        "Failed to fetch CNB data"
      );
    });

    it("propagates parse error for invalid data", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        text: async () => createInvalidDateFormat(),
      } as Response);

      await expect(fetchCnbDataAsJson()).rejects.toThrow();
    });
  });
});
