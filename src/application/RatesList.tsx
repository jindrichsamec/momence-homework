import type { CurrencyRate } from './exchange/currencyRate';

export function RatesList({ rates }: { rates: CurrencyRate[] }) {
  return (
    <div data-testid="rates-list">
      {rates.map((rate) => (
        <div key={rate.code} data-testid="rate-item">
          {rate.country}: {rate.amount} {rate.currency} ({rate.code}) -{" "}
          {rate.rate}
        </div>
      ))}
    </div>
  );
}
