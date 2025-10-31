import { useQuery } from "@tanstack/react-query";
import type { ExchangeList } from "../ExchangeList";

export function useExchangeRatesQuery(): ReturnType<
  typeof useQuery<ExchangeList>
> {
  return useQuery<ExchangeList>({
    queryKey: ["currencyRates"],
    queryFn: () => fetch("/api").then((res) => res.json()),
  });
}
