# CNB Currency Converter

Real-time currency converter using Czech National Bank (CNB) exchange rates. Convert CZK to foreign currencies with live data.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Backend:** Express, Node.js
- **Build:** Vite with HMR

## Requirements

- Node.js >= 18 (tested on v24)
- npm

## Development Setup

### Install dependencies
```bash
npm install
```

### Run development server
```bash
npm run dev
```
Starts both:
- Express server on `http://localhost:3000`
- Vite dev server on `http://localhost:5173`

### Build for production
```bash
npm run build
```

### Lint
```bash
npm run lint
```

## Project Structure

```
src/
├── App.tsx           # Main React component with conversion UI
├── server/
│   └── index.ts      # Express server + CNB API proxy
└── ...
```

## How It Works

1. Express server fetches daily exchange rates from CNB (`/api` endpoint)
2. Parses CNB's text format to JSON
3. React frontend displays rates and conversion form
4. Real-time conversion on amount/currency change

## Next Steps

### High Priority
- [ ] Error handling (network failures, API errors)
- [ ] Loading states during data fetch
- [ ] Input validation (negative numbers, NaN)
- [ ] Better UI/styling

### Testing & Quality
- [ ] Unit tests (conversion logic, parsing)
- [ ] E2E tests
- [ ] TypeScript strict mode

### Features
- [ ] Reverse conversion (foreign → CZK)
- [ ] Multiple currency conversions
- [ ] Exchange rate caching (reduce API calls)

### DevOps
- [ ] Environment variables config
- [ ] Production build & deployment guide

## API Reference

### CNB Exchange Rate API
- **URL:** `https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt`
- **Updates:** Daily (business days)
- **Format:** Pipe-delimited text

## License

Private project
