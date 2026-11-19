import { describe, expect, it } from "@jest/globals";
import { isCancelTargetCurrent } from "../../src/utils/cancelTarget.js";

const SENDER = "0x69fF0f180e74112cF707DdDEC729095631c4B809";
const OTHER = "0xA1D7f4b5E7F3f2d9C9d3bE8dB1F3E2a4C5b6DDEb";
const target = { invoice: { id: 0 }, chainId: 11155111, address: SENDER };

describe("isCancelTargetCurrent", () => {
  it("accepts the network and account the dialog was opened on", () => {
    expect(isCancelTargetCurrent(target, 11155111, SENDER)).toBe(true);
  });

  it("ignores address casing", () => {
    expect(isCancelTargetCurrent(target, 11155111, SENDER.toLowerCase())).toBe(true);
  });

  it("rejects the target after a network switch", () => {
    expect(isCancelTargetCurrent(target, 63, SENDER)).toBe(false);
  });

  it("rejects the target after an account switch", () => {
    expect(isCancelTargetCurrent(target, 11155111, OTHER)).toBe(false);
  });

  it("rejects a cleared target", () => {
    expect(isCancelTargetCurrent(null, 11155111, SENDER)).toBe(false);
  });
});
