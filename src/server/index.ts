import express  from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

interface Currency {
  country: string;
  currency: string;
  amount: number;
  code: string;
  rate: number;
}

interface ExchangeList {
  date?: string;
  rates?: Currency[];
}

async function txtToJson(txt: string): Promise<ExchangeList> {
  const DATE_LINE_INDEX = 0;
  const CURRENCY_DATA_START_LINE_INDEX = 2;
  const MINIMUM_LINES_REQUIRED = 3;

  const lines = txt.split('\n').filter(line => line.trim() !== '');
  const result: ExchangeList = {};
  if (lines.length < MINIMUM_LINES_REQUIRED) {
    return result; // Not enough data
  }

  // Extract date from the first line
  const dateLine = lines[DATE_LINE_INDEX].trim();
  const dateMatch = dateLine.match(/^(\d{1,2} \w+ \d{4})/);
  if (dateMatch) {
    result.date = dateMatch[1];
  }

  // Process currency data
  const currencyData: Currency[] = [];
  for (let i = CURRENCY_DATA_START_LINE_INDEX; i < lines.length; i++) {
    const [country, currency, amount, code, rate] = lines[i].split('|');
    currencyData.push({
      country: country.trim(),
      currency: currency.trim(),
      amount: parseInt(amount.trim(), 10),
      code: code.trim(),
      rate: parseFloat(rate.trim())
    });
  }
  result.rates = currencyData;

  return result;
}

app.get('/', async (req, res) => {
  const response = await fetch('https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt');
  const data = await response.text();
  const jsonData = await txtToJson(data);

  res.json(jsonData);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
