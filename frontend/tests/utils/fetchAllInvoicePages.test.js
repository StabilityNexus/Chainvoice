
import { jest } from "@jest/globals";
import { fetchAllInvoicePages } from "../../src/utils/fetchAllInvoicePages";

describe("fetchAllInvoicePages", () => {
  test("fetches all invoices across multiple pages", async () => {
    const invoices = Array.from({ length: 51 }, (_, i) => ({
      id: i + 1,
    }));

    const view = jest.fn(async (_user, offset, limit) => [
      invoices.slice(offset, offset + limit),
      invoices.length,
    ]);

    const result = await fetchAllInvoicePages(view, "0xUser");

    expect(result).toHaveLength(51);
    expect(view).toHaveBeenCalledTimes(2);
    expect(view).toHaveBeenNthCalledWith(1, "0xUser", 0, 50);
    expect(view).toHaveBeenNthCalledWith(2, "0xUser", 50, 50);
  });

  test("uses the same blockTag for every page request", async () => {
    const invoices = Array.from({ length: 101 }, (_, i) => ({
      id: i + 1,
    }));
    const blockTag = 12345;

    const view = jest.fn(async (_user, offset, limit) => [
      invoices.slice(offset, offset + limit),
      invoices.length,
    ]);

    const result = await fetchAllInvoicePages(
      view,
      "0xUser",
      50,
      blockTag
    );

    expect(result).toHaveLength(101);
    expect(view).toHaveBeenCalledTimes(3);

    expect(view).toHaveBeenNthCalledWith(
      1,
      "0xUser",
      0,
      50,
      { blockTag }
    );

    expect(view).toHaveBeenNthCalledWith(
      2,
      "0xUser",
      50,
      50,
      { blockTag }
    );

    expect(view).toHaveBeenNthCalledWith(
      3,
      "0xUser",
      100,
      50,
      { blockTag }
    );
  });

  test("uses the pinned blockTag when the invoice list is empty", async () => {
    const blockTag = 12345;
    const view = jest.fn().mockResolvedValue([[], 0]);

    await expect(
      fetchAllInvoicePages(view, "0xUser", 50, blockTag)
    ).resolves.toEqual([]);

    expect(view).toHaveBeenCalledTimes(1);
    expect(view).toHaveBeenCalledWith(
      "0xUser",
      0,
      50,
      { blockTag }
    );
  });

  test("rejects an invoice count that changes between pages", async () => {
    const view = jest
      .fn()
      .mockResolvedValueOnce([
        Array.from({ length: 50 }, (_, i) => ({ id: i + 1 })),
        51,
      ])
      .mockResolvedValueOnce([[{ id: 51 }], 52]);

    await expect(
      fetchAllInvoicePages(view, "0xUser")
    ).rejects.toThrow(/Invoice data changed/);
  });

  test("rejects an incomplete page", async () => {
    const view = jest.fn().mockResolvedValue([
      [{ id: 1 }, { id: 2 }],
      3,
    ]);

    await expect(
      fetchAllInvoicePages(view, "0xUser", 3)
    ).rejects.toThrow(/Unable to retrieve all invoices/);
  });

  test("rejects an invalid invoice count", async () => {
    const view = jest.fn().mockResolvedValue([[], -1]);

    await expect(
      fetchAllInvoicePages(view, "0xUser")
    ).rejects.toThrow(/invalid invoice count/i);
  });

  test("rejects an invalid page size", async () => {
    const view = jest.fn();

    await expect(
      fetchAllInvoicePages(view, "0xUser", 0)
    ).rejects.toThrow(/Invalid invoice page size/);

    expect(view).not.toHaveBeenCalled();
  });

  test("rejects an invalid blockTag", async () => {
    const view = jest.fn();

    await expect(
      fetchAllInvoicePages(view, "0xUser", 50, -1)
    ).rejects.toThrow(/Invalid block tag/);

    expect(view).not.toHaveBeenCalled();
  });
});
