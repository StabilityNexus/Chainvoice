
/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import InvoiceFinancialSummary from "../../src/components/InvoiceFinancialSummary";

describe("InvoiceFinancialSummary", () => {
  test("renders the loading state", () => {
    render(<InvoiceFinancialSummary loading />);

    expect(
      screen.getByText("Calculating financial summary...")
    ).toBeTruthy();

    expect(screen.getByRole("progressbar")).toBeTruthy();
    expect(screen.queryByText("Financial Summary")).toBeNull();
  });

  test("renders the error state", () => {
    render(
      <InvoiceFinancialSummary
        error="Unable to connect to the network."
      />
    );

    expect(screen.getByRole("alert")).toBeTruthy();

    expect(
      screen.getByText(
        "Financial summary unavailable: Unable to connect to the network."
      )
    ).toBeTruthy();
  });

  test("renders an empty summary with zero invoice counts", () => {
    render(<InvoiceFinancialSummary summary={[]} />);

    expect(screen.getByText("Financial Summary")).toBeTruthy();
    expect(screen.getByText("No invoices found.")).toBeTruthy();

    expect(getMetricValue("Total invoices")).toBe("0");
    expect(getMetricValue("Paid")).toBe("0");
    expect(getMetricValue("Outstanding")).toBe("0");
    expect(getMetricValue("Cancelled")).toBe("0");
  });

  test("renders invoice counts and amounts for multiple tokens", () => {
    const summary = [
      {
        chainId: "1",
        tokenAddress: "0xUSDC",
        symbol: "USDC",
        decimals: 6,
        total: 3,
        paid: 1,
        outstanding: 1,
        cancelled: 1,
        totalBaseUnits: 12345000n,
        paidBaseUnits: 2345000n,
        outstandingBaseUnits: 8000000n,
        cancelledBaseUnits: 1000000n,
      },
      {
        chainId: "137",
        tokenAddress: "0xETH",
        symbol: "ETH",
        decimals: 18,
        total: 2,
        paid: 1,
        outstanding: 1,
        cancelled: 0,
        totalBaseUnits: 2500000000000000000n,
        paidBaseUnits: 1000000000000000000n,
        outstandingBaseUnits: 1500000000000000000n,
        cancelledBaseUnits: 0n,
      },
    ];

    render(<InvoiceFinancialSummary summary={summary} />);

    // Overall invoice counts across both token groups.
    expect(getMetricValue("Total invoices")).toBe("5");
    expect(getMetricValue("Paid")).toBe("2");
    expect(getMetricValue("Outstanding")).toBe("2");
    expect(getMetricValue("Cancelled")).toBe("1");

    // Token groups and their chain identifiers.
    expect(screen.getByText("USDC — Chain 1")).toBeTruthy();
    expect(screen.getByText("ETH — Chain 137")).toBeTruthy();

    expect(screen.getByText("0xUSDC")).toBeTruthy();
    expect(screen.getByText("0xETH")).toBeTruthy();

    // USDC uses 6 decimal places.
    expect(screen.getByText("12.345 USDC")).toBeTruthy();
    expect(screen.getByText("2.345 USDC")).toBeTruthy();
    expect(screen.getByText("8.0 USDC")).toBeTruthy();
    expect(screen.getByText("1.0 USDC")).toBeTruthy();

    // ETH uses 18 decimal places.
    expect(screen.getByText("2.5 ETH")).toBeTruthy();
    expect(screen.getByText("1.0 ETH")).toBeTruthy();
    expect(screen.getByText("1.5 ETH")).toBeTruthy();
    expect(screen.getByText("0.0 ETH")).toBeTruthy();
  });

  test("uses the default token label when a symbol is missing", () => {
    const summary = [
      {
        chainId: "1",
        tokenAddress: "0xUNKNOWN",
        symbol: "",
        decimals: 6,
        total: 1,
        paid: 0,
        outstanding: 1,
        cancelled: 0,
        totalBaseUnits: 1000000n,
        paidBaseUnits: 0n,
        outstandingBaseUnits: 1000000n,
        cancelledBaseUnits: 0n,
      },
    ];

    render(<InvoiceFinancialSummary summary={summary} />);

    expect(screen.getByText("Token — Chain 1")).toBeTruthy();
    expect(screen.getAllByText("1.0 Token")).toHaveLength(2);
  });
});

function getMetricValue(label) {
  const labelElement = screen.getByText(label);
  const metricContainer = labelElement.parentElement;

  return metricContainer.querySelector("h6").textContent;
}
