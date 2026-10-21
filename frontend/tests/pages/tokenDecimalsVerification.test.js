
import { readFileSync } from "node:fs";
import { describe, expect, it } from "@jest/globals";

const pages = [
  "src/page/CreateInvoice.jsx",
  "src/page/CreateInvoicesBatch.jsx",
  "src/page/GenerateLink.jsx",
];

describe("ERC-20 token decimals verification regression", () => {
  it.each(pages)(
    "%s rejects failed decimals reads and does not mark the token verified",
    (file) => {
      const source = readFileSync(new URL(`../../${file}`, import.meta.url), "utf8");

      expect(source).toMatch(/contract\.decimals\(\)/);
      expect(source).not.toMatch(/decimals:\s*await\s+contract\.decimals\(\)\.catch/);
      expect(source).not.toMatch(/contract\.decimals\(\)\.catch\(\(\)\s*=>\s*18\)/);
      expect(source).toMatch(/setTokenVerificationState\("error"\)/);
      expect(source).toMatch(/setVerifiedToken\(null\)/);
    }
  );
});
