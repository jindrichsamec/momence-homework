import { useCallback, useState } from "react";
import type { CurrencyRate } from "./currencyRate";

interface ConversionPanelProps {
  rates: CurrencyRate[];
}

export function ConversionPanel({ rates }: ConversionPanelProps) {
  const [currencyConversionResult, setCurrencyConversionResult] =
    useState<number>(0);

  const handleCurrencyChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      event.currentTarget.form?.requestSubmit();
    },
    [],
  );

  const handleAmountChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.currentTarget.form?.requestSubmit();
    },
    [],
  );

  const handleFormSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const formData = new FormData(event.currentTarget);
      const amountInCZK = Number(formData.get("amount"));
      const [rate, amount] = String(formData.get("currency")).split(
        "_",
      ) as string[];

      const convertedAmount = (amountInCZK / Number(rate)) * Number(amount);
      setCurrencyConversionResult(convertedAmount);

      return false;
    },
    [],
  );

  return (
    <>
      <form onSubmit={handleFormSubmit} method="post">
        <input
          type="number"
          min={0}
          name="amount"
          placeholder="Enter amount in CZK"
          onChange={handleAmountChange}
        />
        CZK to
        <select name="currency" onChange={handleCurrencyChange}>
          {rates.map((rate) => (
            <option
              key={rate.code}
              value={[rate.rate, rate.amount].join("_")}
              data-rate={rate.rate}
              data-amount={rate.amount}
            >
              {rate.currency} ({rate.code})
            </option>
          ))}
        </select>
      </form>
      <strong data-testid="conversion-result">
        {currencyConversionResult}
      </strong>
    </>
  );
}
