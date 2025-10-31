import type { CurrencyRate } from '../currencyRate';

export function RatesList({ rates }: { rates: CurrencyRate[] }) {
  return (
    <div>
      {rates.map((rate) => (
        <div key={rate.code}>
          {rate.country}: {rate.amount} {rate.currency} ({rate.code}) -{" "}
          {rate.rate}
        </div>
      ))}
    </div>
  );
}
