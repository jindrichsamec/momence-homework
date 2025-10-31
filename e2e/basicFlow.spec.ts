import { test, expect } from "@playwright/test";

test.describe("Basic currency conversion flow", () => {
  let usdRate: number = 0;

  test.beforeEach(async () => {
    const textResult = await fetch(
      "https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt"
    )
      .then((res) => res.text())
      .then((data) => {
        return data;
      });
    const [usdLine] = textResult
      .split("\n")
      .filter((line) => line?.startsWith("USA|dollar|1|USD|"));

    usdRate = Number(usdLine.split("|")[4].trim().replace(",", "."));
  });

  test("conversion works as expected", async ({ page }) => {
    const AMOUNT_TO_CONVERT = 100;
    await page.goto("/");

    await page.waitForSelector("[data-testid=conversion-result]", {
      timeout: 3000,
    });

    await page.getByRole("spinbutton").fill(AMOUNT_TO_CONVERT.toString());
    await page.getByRole("combobox").selectOption({ label: "dollar (USD)" });

    await expect(page.getByTestId("rate-item")).toHaveCount(31);
    await expect(page.getByTestId("conversion-result")).toHaveText(
      (AMOUNT_TO_CONVERT / usdRate).toString()
    );
  });
});
