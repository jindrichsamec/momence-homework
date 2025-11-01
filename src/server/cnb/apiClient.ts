import { exchangeListSchema, type ExchangeList } from "../../exchangeList";
import { parseRates, parseDate } from "./apiParser";

export async function fetchCnbDataAsJson(): Promise<ExchangeList> {
  const data = await fetchCnbData();
  return convertCnbResponseToJson(data);
}

export async function fetchCnbData(): Promise<string> {
  const response = await fetch(
    "https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt"
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch CNB data: ${response.statusText}`);
  }

  return response.text();
}

export async function convertCnbResponseToJson(
  txt: string
): Promise<ExchangeList> {
  const MINIMUM_LINES_REQUIRED = 3;

  const lines = txt.split("\n").filter((line) => line.trim() !== "");

  if (lines.length < MINIMUM_LINES_REQUIRED) {
    throw new Error("Invalid CNB data format. Too few lines.");
  }

  const result: ExchangeList = {
    rates: parseRates(lines),
    date: parseDate(lines),
  };

  return exchangeListSchema.parse(result);
}
