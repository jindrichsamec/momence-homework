import { useQuery } from "@tanstack/react-query";
import type { ExchangeList } from "./exchange/exchangeList";
import { fetchCnbDataAsJson } from "./exchange/cnb/apiClient";

export function useExchangeRatesQuery(): ReturnType<
  typeof useQuery<ExchangeList>
> {
  return useQuery<ExchangeList>({
    queryKey: ["currencyRates"],
    queryFn: fetchCnbDataAsJson,
  });
}
