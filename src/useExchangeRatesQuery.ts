import { useQuery } from "@tanstack/react-query";
import type { ExchangeList } from "./exchangeList";
import { fetchCnbDataAsJson } from "./cnb/apiClient";

export function useExchangeRatesQuery(): ReturnType<
  typeof useQuery<ExchangeList>
> {
  return useQuery<ExchangeList>({
    queryKey: ["currencyRates"],
    queryFn: fetchCnbDataAsJson,
  });
}
