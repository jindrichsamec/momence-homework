import styled from "styled-components";
import { useCallback, useState } from "react";
import type { CurrencyRate } from "./exchange/currencyRate";
import { Card } from "./ui/Card";
import { Input, Select } from "./ui/Input";
import { Badge } from "./ui/Badge";
import { Flag } from "./country/Flag";
import { Currency } from "./exchange/Currency";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

const Result = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 8px;
  text-align: center;
`;

const ResultValue = styled.strong`
  font-size: 3rem;
  font-weight: 700;
  color: #111827;
`;

interface ConversionPanelProps {
  rates: CurrencyRate[];
}

export function ConversionPanel({ rates }: ConversionPanelProps) {
  const [currencyConversionResult, setCurrencyConversionResult] =
    useState<number>(0);
  const [currencyConversionResultCode, setCurrencyConversionResultCode] =
    useState<string>("");

  const handleCurrencyChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      event.currentTarget.form?.requestSubmit();
    },
    []
  );

  const handleAmountChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.currentTarget.form?.requestSubmit();
    },
    []
  );

  const handleFormSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const formData = new FormData(event.currentTarget);
      const amountInCZK = Number(formData.get("amount"));
      const [rate, amount, code] = String(formData.get("currency")).split(
        "_"
      ) as string[];

      const convertedAmount = (amountInCZK / Number(rate)) * Number(amount);
      setCurrencyConversionResult(convertedAmount);
      setCurrencyConversionResultCode(code);

      return false;
    },
    []
  );

  return (
    <Card>
      <Form onSubmit={handleFormSubmit} method="post">
        <Label>
          <Badge>
            <Flag countryCode="CZK" /> CZK
          </Badge>
        </Label>
        <Input
          type="number"
          min={0}
          name="amount"
          placeholder="Enter amount in CZK"
          onChange={handleAmountChange}
        />
        <Label>Convert to</Label>
        <Select name="currency" onChange={handleCurrencyChange}>
          {rates.map((rate) => (
            <option
              key={rate.code}
              value={[rate.rate, rate.amount, rate.code].join("_")}
            >
              {rate.currency} ({rate.code})
            </option>
          ))}
        </Select>
      </Form>
      <Result>
          {currencyConversionResultCode ? (
            <Badge><Flag countryCode={currencyConversionResultCode} size={48} /></Badge>
          ) : (
            null
          )}
        <ResultValue data-testid="conversion-result">
          <Currency amount={currencyConversionResult} code={currencyConversionResultCode} />
        </ResultValue>
      </Result>
    </Card>
  );
}
