import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Currency } from "./Currency";

describe("Currency", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("locale detection", () => {
    it("uses first language from navigator.languages", () => {
      vi.stubGlobal("navigator", {
        languages: ["en-US", "en"],
        language: "en-GB",
      });

      render(<Currency amount={100} code="USD" />);

      // en-US format uses $ symbol
      expect(screen.getByText(/\$100\.00/)).toBeInTheDocument();
    });

    it("falls back to navigator.language when languages is empty", () => {
      vi.stubGlobal("navigator", {
        languages: [],
        language: "en-GB",
      });

      render(<Currency amount={100} code="GBP" />);

      // en-GB format uses £ symbol
      expect(screen.getByText(/£100\.00/)).toBeInTheDocument();
    });

    it("falls back to navigator.language when languages is undefined", () => {
      vi.stubGlobal("navigator", {
        language: "en-US",
      });

      render(<Currency amount={100} code="USD" />);

      expect(screen.getByText(/\$100\.00/)).toBeInTheDocument();
    });
  });

  describe("currency formatting", () => {
    beforeEach(() => {
      vi.stubGlobal("navigator", {
        languages: ["en-US"],
        language: "en-US",
      });
    });

    it("formats USD correctly", () => {
      render(<Currency amount={1234.56} code="USD" />);

      expect(screen.getByText("$1,234.56")).toBeInTheDocument();
    });

    it("formats EUR correctly", () => {
      render(<Currency amount={999.99} code="EUR" />);

      expect(screen.getByText(/999\.99/)).toBeInTheDocument();
    });

    it("formats CZK correctly", () => {
      render(<Currency amount={25.5} code="CZK" />);

      expect(screen.getByText(/25\.50/)).toBeInTheDocument();
    });

    it("formats zero amount", () => {
      render(<Currency amount={0} code="USD" />);

      expect(screen.getByText("$0.00")).toBeInTheDocument();
    });

    it("formats negative amount", () => {
      render(<Currency amount={-50} code="USD" />);

      expect(screen.getByText(/-\$50\.00/)).toBeInTheDocument();
    });

    it("formats large amounts with thousands separators", () => {
      render(<Currency amount={1000000} code="USD" />);

      expect(screen.getByText("$1,000,000.00")).toBeInTheDocument();
    });

    it("formats small decimal amounts", () => {
      render(<Currency amount={0.01} code="USD" />);

      expect(screen.getByText("$0.01")).toBeInTheDocument();
    });
  });

  describe("empty code handling", () => {
    it("returns dash when code is empty string", () => {
      render(<Currency amount={100} code="" />);

      expect(screen.getByText("–")).toBeInTheDocument();
    });

    it("returns dash when code is undefined", () => {
      render(<Currency amount={100} code={undefined as any} />);

      expect(screen.getByText("–")).toBeInTheDocument();
    });

    it("returns dash when code is null", () => {
      render(<Currency amount={100} code={null as any} />);

      expect(screen.getByText("–")).toBeInTheDocument();
    });
  });

  describe("different locales", () => {
    it("formats with Czech locale (cs-CZ)", () => {
      vi.stubGlobal("navigator", {
        languages: ["cs-CZ"],
        language: "cs-CZ",
      });

      render(<Currency amount={1234.56} code="CZK" />);

      // Czech format uses space as thousands separator and comma as decimal
      expect(screen.getByText(/1.*234.*56.*Kč/)).toBeInTheDocument();
    });

    it("formats with German locale (de-DE)", () => {
      vi.stubGlobal("navigator", {
        languages: ["de-DE"],
        language: "de-DE",
      });

      render(<Currency amount={1234.56} code="EUR" />);

      // German format uses period as thousands separator and comma as decimal
      expect(screen.getByText(/1\.234,56/)).toBeInTheDocument();
    });
  });
});
