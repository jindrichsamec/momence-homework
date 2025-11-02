import { useExchangeRatesQuery } from './useExchangeRatesQuery.ts';
import { ConversionPanel } from "./ConversionPanel.tsx";
import { RatesList } from "./RatesList.tsx";

function App() {
  const { data, isLoading, isError, error } = useExchangeRatesQuery();

  return (
    <>
      {isLoading ? <div>Loading...</div> : null}
      {isError ? <div>Error: {error.message}</div> : null}
      {data?.rates ? <RatesList rates={data.rates} /> : null}
      {data?.rates ? <ConversionPanel rates={data.rates} /> : null}
    </>
  );
}

export default App;

