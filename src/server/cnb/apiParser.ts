import * as z from "zod";
import { currencyRateSchema } from "../../currencyRate.ts";

export function parseRates(lines: string[]) {
  const CURRENCY_DATA_START_LINE_INDEX = 2;
  const REQUIRED_PARTS_IN_LINE = 5;

  return lines.slice(CURRENCY_DATA_START_LINE_INDEX).map((line) => {
    const parts = line.split("|").map((part) => part.trim());

    if (parts.length !== REQUIRED_PARTS_IN_LINE) {
      throw new Error(
        `Invalid currency data format in CNB data. Too ${
          parts.length > REQUIRED_PARTS_IN_LINE ? "many" : "few"
        } parts. [${line}]`
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

export function parseDate(lines: string[]) {
  const DATE_LINE_INDEX = 0;

  const dateLine = lines[DATE_LINE_INDEX].trim();
  const dateMatch = dateLine.match(/^(\d{1,2} \w+ \d{4})/);
  if (!dateMatch) {
    throw new Error("Invalid date format in CNB data");
  }
  const possibleDate = new Date(Date.parse(dateMatch[1]));

  return z.iso.datetime().parse(possibleDate.toISOString());
}
