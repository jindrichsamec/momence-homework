import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Flag } from "./Flag";

describe("Flag", () => {
  describe("flag lookup", () => {

    it("displays all different flags correctly", () => {
      const codes = [
        { code: "AUD", flag: "🇦🇺" },
        { code: "CAD", flag: "🇨🇦" },
        { code: "CHF", flag: "🇨🇭" },
      ];

      codes.forEach(({ code, flag }) => {
        const { container } = render(<Flag countryCode={code} />);
        expect(container.textContent).toBe(flag);
      });
    });
  });

  describe("fallback behavior", () => {
    it.each([
      ["unknown country code", "XYZ"],
      ["empty string code", ""],
      ["undefined code", undefined],
      ["null code", null],
      ["code not in flagsData", "INVALID"],
    ])("displays white flag for %s", (_, countryCode) => {
      const { container } = render(<Flag countryCode={countryCode as string} />);

      expect(container.textContent).toBe("🏳️");
    });
  });

  describe("size prop", () => {
    it("uses default size of 24 when not specified", () => {
      const { container } = render(<Flag countryCode="USD" />);
      const span = container.querySelector("span");

      expect(span).toHaveStyle({ fontSize: "24px" });
    });

    it("applies custom size prop", () => {
      const { container } = render(<Flag countryCode="USD" size={48} />);
      const span = container.querySelector("span");

      expect(span).toHaveStyle({ fontSize: "48px" });
    });
  });
});
