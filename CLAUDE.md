# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start Vite dev server (port 5173, proxies /api to CNB)
- `npm run build` - TypeScript compile + Vite production build
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Testing
- `npm test` - Run Vitest unit tests
- `npm run test:ui` - Vitest UI
- `npm run test:e2e` - Run Playwright e2e tests

## Architecture

**Frontend-Only with Direct CNB Proxy**
- `src/application/` - All application code (React frontend + CNB integration)
- Vite dev server runs on port 5173
- Vite proxies `/api` directly to CNB URL (no backend server)
- Frontend uses TanStack Query for data fetching

**Data Flow**
1. Frontend fetches `/api` via `useExchangeRatesQuery` hook (TanStack Query)
2. Vite proxy redirects to CNB URL directly
3. CNB data (pipe-delimited text) fetched in browser via `cnb/apiClient.ts`
4. Text parsed to JSON by `cnb/apiParser.ts` in browser
5. Zod schemas validate runtime data (`currencyRate.ts`, `exchangeList.ts`)
6. Components render rates list and conversion panel with styled-components

**Type System**
- All types defined with Zod schemas (not plain TypeScript interfaces)
- Runtime validation at API boundary in `cnb/apiClient.ts` and `cnb/apiParser.ts`
- Type inference via `z.infer<typeof schema>`

**Module Organization**
- `src/application/` - All application code
  - `App.tsx`, `ConversionPanel.tsx`, `RatesList.tsx` - Main components
  - `useExchangeRatesQuery.ts` - TanStack Query hook
  - `exchange/` - Exchange rate domain logic
    - `cnb/apiClient.ts` - Fetches and converts CNB data
    - `cnb/apiParser.ts` - Parsing logic for CNB text format
    - `currencyRate.ts`, `exchangeList.ts` - Zod schemas
    - `Currency.tsx` - Currency formatter component with i18n
  - `country/` - Country/flag components
    - `Flag.tsx`, `FlagResizer.tsx` - Flag display components (FlagResizer: SVG size adjustment)
    - `flagsData.ts` - Flag SVG data
  - `ui/` - styled-components UI primitives
    - `Card.tsx`, `Badge.tsx`, `Container.tsx`, `Input.tsx`

**File Naming Convention**
- Type/schema files use lowercase: `currencyRate.ts`, `exchangeList.ts`
- React components use PascalCase: `App.tsx`, `ConversionPanel.tsx`

**Testing**
- Unit tests colocated with source files (`.test.ts` extension)
- Fixtures in `__fixtures__/` directories with `*Factories.ts` naming
- Vitest for unit tests, Playwright for e2e

## Vite Proxy Configuration
```typescript
// vite.config.ts
server: {
  proxy: {
    "/api": {
      target: "https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ""),
    },
  },
}
```

## Deployment

**Vercel**
- Deployed to Vercel with automatic proxy configuration
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Vercel rewrites `/api` to CNB URL via `vercel.json`:
  ```json
  {
    "rewrites": [
      {
        "source": "/api",
        "destination": "https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt"
      }
    ]
  }
  ```
- No environment variables or backend functions needed
- Documentation: https://vercel.com/docs/llms-full.txt

## CNB API Details
- URL: `https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt`
- Documentation: `https://www.cnb.cz/en/faq/Format-of-the-foreign-exchange-market-rates/`
- Format: Pipe-delimited text with header (2 lines) + currency data
- First line contains date in format "DD MMM YYYY"
- Currency lines: `Country|Currency|Amount|Code|Rate`
- Decimal separator is comma (converted to dot during parsing)
