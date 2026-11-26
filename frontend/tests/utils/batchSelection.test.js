import { describe, expect, it } from "@jest/globals";
import { visibleInvoiceIds } from "../../src/utils/batchSelection.js";

const eth1 = { id: "1", paymentToken: { symbol: "ETH" } };
const eth2 = { id: "2", paymentToken: { symbol: "ETH" } };
const link3 = { id: "3", paymentToken: { symbol: "LINK" } };

describe("visibleInvoiceIds", () => {
  it("returns every id when the whole suggestion is visible", () => {
    expect(visibleInvoiceIds([eth1, eth2], [eth1, eth2, link3])).toEqual([
      "1",
      "2",
    ]);
  });

  it("returns nothing when a LINK filter hides every ETH invoice", () => {
    expect(visibleInvoiceIds([eth1, eth2], [link3])).toEqual([]);
  });

  it("keeps only the visible ids of a partly hidden suggestion, in order", () => {
    expect(visibleInvoiceIds([eth1, eth2, link3], [link3, eth1])).toEqual([
      "1",
      "3",
    ]);
  });

  it("returns nothing when no invoice is visible", () => {
    expect(visibleInvoiceIds([eth1, eth2], [])).toEqual([]);
  });
});
