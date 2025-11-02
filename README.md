# CNB Currency Converter

Real-time currency converter using Czech National Bank (CNB) exchange rates. Convert CZK to foreign currencies with live data.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, styled-components
- **Styling:** styled-components with UI primitives (Card, Badge, Container, Input)
- **Data Fetching:** TanStack Query
- **Testing:** Vitest (unit), Playwright (e2e)
- **Validation:** Zod schemas

## Requirements

- Node.js >= 18 (tested on v22)
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
Starts Vite dev server on `http://localhost:5173` (proxies `/api` to CNB)

### Build for production
```bash
npm run build
```

### Testing
```bash
npm test          # Run unit tests
npm run test:ui   # Vitest UI
npm run test:e2e  # Playwright e2e tests
```

### Lint
```bash
npm run lint
```

## Project Structure

```
src/
├── application/
│   ├── App.tsx                    # Main component
│   ├── ConversionPanel.tsx        # Conversion UI
│   ├── RatesList.tsx              # Rates table
│   ├── useExchangeRatesQuery.ts   # TanStack Query hook
│   ├── exchange/
│   │   ├── cnb/
│   │   │   ├── apiClient.ts       # CNB API fetch/parse
│   │   │   └── apiParser.ts       # Text format parser
│   │   ├── currencyRate.ts        # Zod schema
│   │   ├── exchangeList.ts        # Zod schema
│   │   └── Currency.tsx           # i18n formatter
│   ├── country/
│   │   ├── Flag.tsx               # Country flag component
│   │   └── flagsData.ts           # Flag SVG data
│   └── ui/
│       ├── Card.tsx
│       ├── Badge.tsx
│       ├── Container.tsx
│       └── Input.tsx
└── main.tsx
```

## How It Works

1. Vite dev server or Vercel proxies `/api` directly to CNB URL (no backend server)
2. Frontend fetches data via `useExchangeRatesQuery` (TanStack Query)
3. CNB text format parsed to JSON in browser (`apiClient.ts`, `apiParser.ts`)
4. Zod validates runtime data (`currencyRate.ts`, `exchangeList.ts`)
5. React components render rates and conversion UI with styled-components

## Deployment

### Vercel
Deployed to Vercel with automatic proxy configuration:

1. Import project from GitHub/GitLab
2. Framework preset: **Vite**
3. Build command: `npm run build`
4. Output directory: `dist`
5. Vercel automatically rewrites `/api` to CNB URL (configured in `vercel.json`)

No environment variables or backend functions needed.

## API Reference

### CNB Exchange Rate API
- **URL:** `https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt`
- **Updates:** Daily (business days)
- **Format:** Pipe-delimited text

## License

Private project
