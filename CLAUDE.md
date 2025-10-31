# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start both Express server (port 3000) and Vite dev server (port 5173)
- `npm run dev:server` - Start only Express server with watch mode
- `npm run dev:client` - Start only Vite dev server
- `npm run build` - TypeScript compile + Vite production build
- `npm run lint` - Run ESLint

### Testing
No test framework currently configured.

## Architecture

**Client/Server Split with Dev Proxy**
- `src/client/` - React frontend (runs on Vite dev server at port 5173)
- `src/server/` - Express backend (runs on port 3000)
- Vite proxies `/api` requests to Express server during development
- Frontend uses TanStack Query for data fetching

**Data Flow**
1. Express server (`src/server/index.ts`) exposes `/api` endpoint
2. Server fetches CNB exchange rates via `cnb/apiClient.ts`
3. CNB data (pipe-delimited text) is parsed to JSON by `cnb/apiParser.ts`
4. Zod schemas validate runtime data (`currencyRate.ts`, `exchangeList.ts`)
5. React frontend fetches via `useExchangeRatesQuery` hook
6. Components render rates list and conversion panel

**Type System**
- All types defined with Zod schemas (not plain TypeScript interfaces)
- Runtime validation occurs at API boundaries in `cnb/apiClient.ts` and `cnb/apiParser.ts`
- Type inference via `z.infer<typeof schema>`

**Module Organization**
- `src/server/cnb/` - CNB API integration module
  - `apiClient.ts` - Fetches data from CNB API and orchestrates conversion
  - `apiParser.ts` - Parsing logic for CNB text format (rates and dates)

**File Naming Convention**
- Type/schema files use lowercase: `currencyRate.ts`, `exchangeList.ts`
- React components use PascalCase: `App.tsx`, `ConversionPanel.tsx`

## CNB API Details
- URL: `https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt`
- Documentation: `https://www.cnb.cz/en/faq/Format-of-the-foreign-exchange-market-rates/`
- Format: Pipe-delimited text with header (2 lines) + currency data
- First line contains date in format "DD MMM YYYY"
- Currency lines: `Country|Currency|Amount|Code|Rate`
- Decimal separator is comma (converted to dot during parsing)
