import express  from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {
  const response = await fetch('https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt');
  const data = await response.text();
  res.send(data);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
