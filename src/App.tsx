import { useCallback, useEffect, useState } from 'react'
import type { CurrencyRate } from './server/index.ts'
import './App.css'

function App() {
  const [rates, setRates] = useState<CurrencyRate[]>([])
  const [currencyConversionResult, setCurrencyConversionResult] = useState<number>(0);

  useEffect(() => {
    fetch('/api')
      .then(response => response.json())
      .then(data => data.rates)
      .then(setRates);
  }, []);

  const handleCurrencyChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    event.currentTarget.form?.requestSubmit();
  }, []);

  const handleAmountChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    event.currentTarget.form?.requestSubmit();
  }, []);

  const handleFormSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const formData = new FormData(event.currentTarget);
    const amountInCZK = Number(formData.get('amount'));
    const [rate, amount] = String(formData.get('currency')).split('_') as string[];

    const convertedAmount = (amountInCZK / Number(rate)) * Number(amount);
    setCurrencyConversionResult(convertedAmount);

    return false;
  }, []);

  return (
    <>
      <div>
        {rates.map(rate => (
          <div key={rate.code}>
            {rate.country}: {rate.amount} {rate.currency} ({rate.code}) - {rate.rate}
          </div>
        ))}
      </div>
      <form onSubmit={handleFormSubmit} method="post">
      <input type="number" min={0} name="amount" defaultValue={0} placeholder="Enter amount in CZK" onChange={handleAmountChange} />CZK to
      <select name="currency" onChange={handleCurrencyChange}>
        {rates.map(rate => (
          <option key={rate.code} value={[rate.rate, rate.amount].join('_')} data-rate={rate.rate} data-amount={rate.amount}>
            {rate.currency} ({rate.code})
          </option>
        ))}
      </select>
      </form>
      <strong>{currencyConversionResult}</strong>
    </>
  )
}

export default App
