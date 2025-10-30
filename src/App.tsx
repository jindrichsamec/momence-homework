import { useEffect, useState } from 'react'
import type { CurrencyRate } from './server/index.ts'
import './App.css'

function App() {
  const [rates, setRates] = useState<CurrencyRate[]>([])

  useEffect(() => {
    fetch('/api')
      .then(response => response.json())
      .then(data => data.rates)
      .then(setRates);
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
    </>
  )
}

export default App
