import * as z from "zod";

import { currencyRateSchema } from "../currencyRate.ts";
import { exchangeListSchema, type ExchangeList } from "../exchangeList.ts";

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

function parseRates(lines: string[]) {
  const CURRENCY_DATA_START_LINE_INDEX = 2;
  const REQUIRED_PARTS_IN_LINE = 5;

  return lines.slice(CURRENCY_DATA_START_LINE_INDEX).map((line) => {
    const parts = line.split("|").map((part) => part.trim());

    if (parts.length !== REQUIRED_PARTS_IN_LINE) {
      throw new Error(
        `Invalid currency data format in CNB data. Too few parts. [${line}]`
      );
    }

    const [country, currency, amount, code, rate] = parts;
    const currencyRateData = {
      country,
      currency,
      amount: parseInt(amount, 10),
      code,
      rate: parseFloat(rate.replace(",", ".")),
    };

    return currencyRateSchema.parse(currencyRateData);
  });
}

function parseDate(lines: string[]) {
  const DATE_LINE_INDEX = 0;

  const dateLine = lines[DATE_LINE_INDEX].trim();
  const dateMatch = dateLine.match(/^(\d{1,2} \w+ \d{4})/);
  if (!dateMatch) {
    throw new Error("Invalid date format in CNB data");
  }
  const possibleDate = new Date(Date.parse(dateMatch[1]));

  return z.iso.datetime().parse(possibleDate.toISOString());
}
