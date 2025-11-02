import { useExchangeRatesQuery } from './useExchangeRatesQuery.ts';
import { ConversionPanel } from "./ConversionPanel.tsx";
import { RatesList } from "./RatesList.tsx";
import { Container } from "./ui/Container.tsx";

function App() {
  const { data, isLoading, isError, error } = useExchangeRatesQuery();

  return (
    <Container>
      {isLoading ? <div>Loading...</div> : null}
      {isError ? <div>Error: {error.message}</div> : null}
      {data?.rates ? <ConversionPanel rates={data.rates} /> : null}
      {data?.rates ? <RatesList rates={data.rates} /> : null}
    </Container>
  );
}

export default App;

