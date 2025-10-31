import type { CurrencyRate } from './CurrencyRate';

export interface ExchangeList {
  date?: string;
  rates?: CurrencyRate[];
}
