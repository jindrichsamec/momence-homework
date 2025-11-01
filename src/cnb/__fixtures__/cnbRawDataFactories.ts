/**
 * Real CNB exchange rate data fetched on 30 Oct 2025
 * Source: https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt
 */
export function createValidCnbRawData() {
  return `30 Oct 2025 #211
Country|Currency|Amount|Code|Rate
Australia|dollar|1|AUD|13.790
Brazil|real|1|BRL|3.913
Bulgaria|lev|1|BGN|12.467
Canada|dollar|1|CAD|15.054
China|renminbi|1|CNY|2.966
Denmark|krone|1|DKK|3.265
EMU|euro|1|EUR|24.380
Hongkong|dollar|1|HKD|2.715
Hungary|forint|100|HUF|6.267
Iceland|krona|100|ISK|16.931
IMF|SDR|1|XDR|28.760
India|rupee|100|INR|23.784
Indonesia|rupiah|1000|IDR|1.268
Israel|new shekel|1|ILS|6.478
Japan|yen|100|JPY|13.669
Malaysia|ringgit|1|MYR|5.023
Mexico|peso|1|MXN|1.135
New Zealand|dollar|1|NZD|12.085
Norway|krone|1|NOK|2.090
Philippines|peso|100|PHP|35.774
Poland|zloty|1|PLN|5.743
Romania|leu|1|RON|4.795
Singapore|dollar|1|SGD|16.197
South Africa|rand|1|ZAR|1.216
South Korea|won|100|KRW|1.470
Sweden|krona|1|SEK|2.228
Switzerland|franc|1|CHF|26.261
Thailand|baht|100|THB|64.999
Turkey|lira|100|TRY|50.241
United Kingdom|pound|1|GBP|27.690
USA|dollar|1|USD|21.095`;
}

/**
 * Minimal valid CNB data with single currency
 */
export function createMinimalValidCnbData() {
  return `30 Oct 2025
Country|Currency|Amount|Code|Rate
USA|dollar|1|USD|21.095`;
}

/**
 * CNB data with malformed rate line (missing field)
 */
export function createMalformedRateLine() {
  return `30 Oct 2025
Country|Currency|Amount|Code|Rate
USA|dollar|USD|21.095`;
}

/**
 * CNB data with invalid date format
 */
export function createInvalidDateFormat() {
  return `Invalid Date Format
Country|Currency|Amount|Code|Rate
USA|dollar|1|USD|21.095`;
}

/**
 * CNB data with too few lines
 */
export function createTooFewLines() {
  return `30 Oct 2025`;
}

/**
 * Empty CNB data
 */
export function createEmptyData() {
  return ``;
}

/**
 * CNB data with extra blank lines
 */
export function createDataWithBlanks() {
  return `30 Oct 2025

Country|Currency|Amount|Code|Rate

USA|dollar|1|USD|21.095

`;
}

export function createAmountGreaterThanOne() {
  return `30 Oct 2025
Country|Currency|Amount|Code|Rate
Hungary|forint|100|HUF|6,267
Japan|yen|100|JPY|13,669`;
}

export function createLinesWithTooManyFields(): string {
  return `30 Oct 2025
Country|Currency|Amount|Code|Rate
USA|dollar|1|USD|21.095|ExtraField`;
}

/**
 * CNB data with invalid amount (string instead of number)
 */
export function createInvalidAmountData() {
  return `30 Oct 2025
Country|Currency|Amount|Code|Rate
USA|dollar|invalid|USD|21,095`;
}

/**
 * CNB data with invalid rate (non-numeric)
 */
export function createInvalidRateData() {
  return `30 Oct 2025
Country|Currency|Amount|Code|Rate
USA|dollar|1|USD|notanumber`;
}

/**
 * CNB data with zero rate (invalid - must be positive)
 */
export function createZeroRateData() {
  return `30 Oct 2025
Country|Currency|Amount|Code|Rate
Test|currency|1|TST|0,000`;
}
