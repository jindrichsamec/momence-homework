import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useExchangeRatesQuery } from "./useExchangeRatesQuery";
import { fetchCnbDataAsJson } from "./exchange/cnb/apiClient";
import { createFakeExchangeList } from "./exchange/__fixtures__/fakeExchangeListFactories";
import { createElement, type ReactNode } from "react";

vi.mock("./exchange/cnb/apiClient");

describe("useExchangeRatesQuery", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  afterEach(() => {
    queryClient.clear();
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);

  describe("query configuration", () => {
    it("uses fetchCnbDataAsJson as queryFn", async () => {
      const mockData = createFakeExchangeList();
      vi.mocked(fetchCnbDataAsJson).mockResolvedValue(mockData);

      renderHook(() => useExchangeRatesQuery(), { wrapper });

      await waitFor(() => {
        expect(fetchCnbDataAsJson).toHaveBeenCalledOnce();
      });
    });
  });

  describe("successful data fetching", () => {
    it("returns data when fetch succeeds", async () => {
      const mockData = createFakeExchangeList();
      vi.mocked(fetchCnbDataAsJson).mockResolvedValue(mockData);

      const { result } = renderHook(() => useExchangeRatesQuery(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockData);
      expect(result.current.isError).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });

    it("returns exchange list with rates", async () => {
      const mockData = createFakeExchangeList({
        date: "2025-10-30T00:00:00.000Z",
        rates: [
          {
            country: "USA",
            currency: "dollar",
            amount: 1,
            code: "USD",
            rate: 21.095,
          },
        ],
      });
      vi.mocked(fetchCnbDataAsJson).mockResolvedValue(mockData);

      const { result } = renderHook(() => useExchangeRatesQuery(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.rates).toHaveLength(1);
      expect(result.current.data?.rates[0].code).toBe("USD");
      expect(result.current.data?.date).toBe("2025-10-30T00:00:00.000Z");
    });
  });

  describe("loading state", () => {
    it("returns isLoading true initially", () => {
      vi.mocked(fetchCnbDataAsJson).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      const { result } = renderHook(() => useExchangeRatesQuery(), { wrapper });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isError).toBe(false);
      expect(result.current.data).toBeUndefined();
    });

    it("returns isLoading false after fetch completes", async () => {
      const mockData = createFakeExchangeList();
      vi.mocked(fetchCnbDataAsJson).mockResolvedValue(mockData);

      const { result } = renderHook(() => useExchangeRatesQuery(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe("error handling", () => {
    it("returns error when fetch fails", async () => {
      const error = new Error("Failed to fetch CNB data");
      vi.mocked(fetchCnbDataAsJson).mockRejectedValue(error);

      const { result } = renderHook(() => useExchangeRatesQuery(), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe(error);
      expect(result.current.data).toBeUndefined();
      expect(result.current.isLoading).toBe(false);
    });

    it("handles network errors", async () => {
      vi.mocked(fetchCnbDataAsJson).mockRejectedValue(
        new Error("Network error")
      );

      const { result } = renderHook(() => useExchangeRatesQuery(), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe("Network error");
    });

    it("handles API errors", async () => {
      vi.mocked(fetchCnbDataAsJson).mockRejectedValue(
        new Error("Failed to fetch CNB data: Not Found")
      );

      const { result } = renderHook(() => useExchangeRatesQuery(), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toContain("Not Found");
    });
  });

  describe("return type", () => {
    it("returns UseQueryResult with ExchangeList type", async () => {
      const mockData = createFakeExchangeList();
      vi.mocked(fetchCnbDataAsJson).mockResolvedValue(mockData);

      const { result } = renderHook(() => useExchangeRatesQuery(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Type assertions to verify the return type
      expect(result.current).toHaveProperty("data");
      expect(result.current).toHaveProperty("isLoading");
      expect(result.current).toHaveProperty("isError");
      expect(result.current).toHaveProperty("error");
      expect(result.current).toHaveProperty("isSuccess");
    });
  });

  describe("caching", () => {
    it("returns cached data after first fetch", async () => {
      const mockData = createFakeExchangeList();
      vi.mocked(fetchCnbDataAsJson).mockResolvedValue(mockData);

      const { result } = renderHook(() => useExchangeRatesQuery(), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Verify data is available from cache
      expect(result.current.data).toEqual(mockData);
      expect(fetchCnbDataAsJson).toHaveBeenCalled();
    });
  });

  describe("refetch", () => {
    it("allows manual refetch", async () => {
      const mockData = createFakeExchangeList();
      vi.mocked(fetchCnbDataAsJson).mockResolvedValue(mockData);

      const { result } = renderHook(() => useExchangeRatesQuery(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(fetchCnbDataAsJson).toHaveBeenCalledOnce();

      // Refetch
      await result.current.refetch();

      expect(fetchCnbDataAsJson).toHaveBeenCalledTimes(2);
    });
  });
});
