import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConversionPanel } from "./ConversionPanel";
import { createFakeCurrencyRates } from "./exchange/__fixtures__/fakeCurrencyRateFactories";

describe("ConversionPanel", () => {
  const mockRates = createFakeCurrencyRates(3, [
    { code: "USD", rate: 21.095, amount: 1, currency: "dollar", country: "USA" },
    { code: "EUR", rate: 24.38, amount: 1, currency: "euro", country: "EMU" },
    { code: "HUF", rate: 6.267, amount: 100, currency: "forint", country: "Hungary" },
  ]);

  beforeEach(() => {
    vi.stubGlobal("navigator", {
      languages: ["en-US"],
      language: "en-US",
    });
  });

  describe("initial render", () => {
    it("renders form with amount input", () => {
      render(<ConversionPanel rates={mockRates} />);

      expect(screen.getByPlaceholderText("Enter amount in CZK")).toBeInTheDocument();
    });

    it("renders currency select with all rates", () => {
      render(<ConversionPanel rates={mockRates} />);

      const select = screen.getByRole("combobox");
      expect(select).toBeInTheDocument();

      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(3);
      expect(options[0]).toHaveTextContent("dollar (USD)");
      expect(options[1]).toHaveTextContent("euro (EUR)");
      expect(options[2]).toHaveTextContent("forint (HUF)");
    });

    it("displays initial result as zero with no code", () => {
      render(<ConversionPanel rates={mockRates} />);

      const result = screen.getByTestId("conversion-result");
      expect(result).toHaveTextContent("–");
    });

    it("displays CZK badge", () => {
      render(<ConversionPanel rates={mockRates} />);

      expect(screen.getByText("CZK")).toBeInTheDocument();
    });
  });

  describe("currency conversion calculation", () => {
    it("converts CZK to USD correctly (amount = 1)", async () => {
      const user = userEvent.setup();
      render(<ConversionPanel rates={mockRates} />);

      const input = screen.getByPlaceholderText("Enter amount in CZK");
      const select = screen.getByRole("combobox");

      // Select USD (rate: 21.095, amount: 1)
      await user.selectOptions(select, "21.095_1_USD");
      await user.type(input, "100");

      await waitFor(() => {
        const result = screen.getByTestId("conversion-result");
        // Formula: (100 / 21.095) * 1 = 4.740602...
        expect(result.textContent).toMatch(/\$4\.74/);
      });
    });

    it("converts CZK to EUR correctly (amount = 1)", async () => {
      const user = userEvent.setup();
      render(<ConversionPanel rates={mockRates} />);

      const input = screen.getByPlaceholderText("Enter amount in CZK");
      const select = screen.getByRole("combobox");

      // Select EUR (rate: 24.38, amount: 1)
      await user.selectOptions(select, "24.38_1_EUR");
      await user.type(input, "100");

      await waitFor(() => {
        const result = screen.getByTestId("conversion-result");
        // Formula: (100 / 24.38) * 1 = 4.101066...
        expect(result.textContent).toMatch(/€4\.10/);
      });
    });

    it("converts CZK to HUF correctly (amount = 100)", async () => {
      const user = userEvent.setup();
      render(<ConversionPanel rates={mockRates} />);

      const input = screen.getByPlaceholderText("Enter amount in CZK");
      const select = screen.getByRole("combobox");

      // Select HUF (rate: 6.267, amount: 100)
      await user.selectOptions(select, "6.267_100_HUF");
      await user.type(input, "100");

      await waitFor(() => {
        const result = screen.getByTestId("conversion-result");
        // Formula: (100 / 6.267) * 100 = 1595.676...
        expect(result.textContent).toMatch(/1,595\.6[6-8]/);
      });
    });

    it("handles zero amount", async () => {
      const user = userEvent.setup();
      render(<ConversionPanel rates={mockRates} />);

      const input = screen.getByPlaceholderText("Enter amount in CZK");
      const select = screen.getByRole("combobox");

      await user.selectOptions(select, "21.095_1_USD");
      await user.type(input, "0");

      await waitFor(() => {
        const result = screen.getByTestId("conversion-result");
        expect(result.textContent).toMatch(/\$0\.00/);
      });
    });

    it("handles large amounts", async () => {
      const user = userEvent.setup();
      render(<ConversionPanel rates={mockRates} />);

      const input = screen.getByPlaceholderText("Enter amount in CZK");
      const select = screen.getByRole("combobox");

      await user.selectOptions(select, "21.095_1_USD");
      await user.type(input, "1000000");

      await waitFor(() => {
        const result = screen.getByTestId("conversion-result");
        // Formula: (1000000 / 21.095) * 1 = 47406.02...
        expect(result.textContent).toMatch(/\$47,40[4-6]/);
      });
    });

    it("handles decimal amounts", async () => {
      const user = userEvent.setup();
      render(<ConversionPanel rates={mockRates} />);

      const input = screen.getByPlaceholderText("Enter amount in CZK");
      const select = screen.getByRole("combobox");

      await user.selectOptions(select, "21.095_1_USD");
      await user.type(input, "50.5");

      await waitFor(() => {
        const result = screen.getByTestId("conversion-result");
        // Formula: (50.5 / 21.095) * 1 = 2.393999...
        expect(result.textContent).toMatch(/\$2\.3[7-9]/);
      });
    });
  });

  describe("form submission", () => {
    it("updates result on form submit", async () => {
      const user = userEvent.setup();
      render(<ConversionPanel rates={mockRates} />);

      const input = screen.getByPlaceholderText("Enter amount in CZK");
      const select = screen.getByRole("combobox");

      await user.selectOptions(select, "21.095_1_USD");
      await user.type(input, "100");

      // Form should auto-submit on input change
      await waitFor(() => {
        const result = screen.getByTestId("conversion-result");
        expect(result.textContent).not.toBe("–");
      });
    });

    it("prevents default form submission", async () => {
      const user = userEvent.setup();
      render(<ConversionPanel rates={mockRates} />);

      const input = screen.getByPlaceholderText("Enter amount in CZK");
      await user.type(input, "100");

      // Should not cause page navigation or reload
      expect(window.location.href).toBe("http://localhost:3000/");
    });
  });

  describe("event handlers", () => {
    it("triggers conversion on amount change", async () => {
      const user = userEvent.setup();
      render(<ConversionPanel rates={mockRates} />);

      const input = screen.getByPlaceholderText("Enter amount in CZK");
      const select = screen.getByRole("combobox");

      await user.selectOptions(select, "21.095_1_USD");
      await user.type(input, "100");

      await waitFor(() => {
        const result = screen.getByTestId("conversion-result");
        expect(result.textContent).toMatch(/\$4\.74/);
      });
    });

    it("triggers conversion on currency change", async () => {
      const user = userEvent.setup();
      render(<ConversionPanel rates={mockRates} />);

      const input = screen.getByPlaceholderText("Enter amount in CZK");
      const select = screen.getByRole("combobox");

      await user.type(input, "100");
      await user.selectOptions(select, "21.095_1_USD");

      await waitFor(() => {
        const result = screen.getByTestId("conversion-result");
        expect(result.textContent).toMatch(/\$4\.74/);
      });
    });

    it("updates result when switching currencies", async () => {
      const user = userEvent.setup();
      render(<ConversionPanel rates={mockRates} />);

      const input = screen.getByPlaceholderText("Enter amount in CZK");
      const select = screen.getByRole("combobox");

      await user.type(input, "100");
      await user.selectOptions(select, "21.095_1_USD");

      await waitFor(() => {
        expect(screen.getByTestId("conversion-result").textContent).toMatch(/\$4\.74/);
      });

      await user.selectOptions(select, "24.38_1_EUR");

      await waitFor(() => {
        expect(screen.getByTestId("conversion-result").textContent).toMatch(/€4\.10/);
      });
    });
  });

  describe("state management", () => {
    it("initializes with zero result and empty code", () => {
      render(<ConversionPanel rates={mockRates} />);

      const result = screen.getByTestId("conversion-result");
      expect(result.textContent).toBe("–");
    });

    it("updates state after conversion", async () => {
      const user = userEvent.setup();
      render(<ConversionPanel rates={mockRates} />);

      const input = screen.getByPlaceholderText("Enter amount in CZK");
      const select = screen.getByRole("combobox");

      await user.selectOptions(select, "21.095_1_USD");
      await user.type(input, "100");

      await waitFor(() => {
        const result = screen.getByTestId("conversion-result");
        expect(result.textContent).toMatch(/\$4\.74/);
      });
    });

    it("maintains state across multiple conversions", async () => {
      const user = userEvent.setup();
      render(<ConversionPanel rates={mockRates} />);

      const input = screen.getByPlaceholderText("Enter amount in CZK");
      const select = screen.getByRole("combobox");

      // First conversion
      await user.selectOptions(select, "21.095_1_USD");
      await user.type(input, "100");

      await waitFor(() => {
        expect(screen.getByTestId("conversion-result").textContent).toMatch(/\$4\.74/);
      });

      // Clear and do second conversion
      await user.clear(input);
      await user.type(input, "200");

      await waitFor(() => {
        expect(screen.getByTestId("conversion-result").textContent).toMatch(/\$9\.48/);
      });
    });
  });

  describe("edge cases", () => {
    it("handles empty rates array", () => {
      render(<ConversionPanel rates={[]} />);

      const options = screen.queryAllByRole("option");

      expect(options).toHaveLength(0);
    });

    it("handles single rate", () => {
      const singleRate = [mockRates[0]];
      render(<ConversionPanel rates={singleRate} />);

      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(1);
    });
  });
});
