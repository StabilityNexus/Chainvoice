import { describe, expect, it } from "@jest/globals";
import {
  findBatchSuggestions,
  visibleInvoiceIds,
} from "../../src/utils/batchSelection.js";

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

describe("token filter -> suggestions -> selection", () => {
  const sender = { address: "0x71aee14669eaf0a2f55b783eed64ad12b66177ee" };
  const ETH = {
    address: "0x0000000000000000000000000000000000000000",
    symbol: "ETH",
    decimals: 18,
  };
  const LINK = {
    address: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
    symbol: "LINK",
    decimals: 18,
  };
  const invoice = (id, paymentToken) => ({
    id,
    user: sender,
    paymentToken,
    issueDate: "2026-11-26",
    amountDueBaseUnits: "1000000000000000",
    isPaid: false,
    isCancelled: false,
  });
  const all = [invoice("1", ETH), invoice("2", ETH), invoice("3", LINK)];
  const filtered = all.filter((inv) => inv.paymentToken.symbol === "LINK");

  it("suggests no ETH batch while a LINK filter is on", () => {
    expect(
      findBatchSuggestions(filtered).filter(
        (s) => s.token.symbol === "ETH"
      )
    ).toEqual([]);
  });

  it("selects none of an ETH suggestion's invoices under a LINK filter", () => {
    const [ethSuggestion] = findBatchSuggestions(all);
    expect(ethSuggestion.token.symbol).toBe("ETH");
    expect(ethSuggestion.invoices.map((inv) => inv.id)).toEqual(["1", "2"]);
    expect(ethSuggestion.totalAmount).toBe("0.002");
    expect(visibleInvoiceIds(ethSuggestion.invoices, filtered)).toEqual([]);
  });
});
