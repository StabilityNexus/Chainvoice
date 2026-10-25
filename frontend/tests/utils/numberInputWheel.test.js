import { jest } from "@jest/globals";
import { getInputWheelHandler } from "../../src/utils/numberInputWheel.js";

const makeWheelEvent = () => ({ currentTarget: { blur: jest.fn() } });

describe("getInputWheelHandler", () => {
  test("blurs a number input so the wheel cannot step its value", () => {
    const event = makeWheelEvent();
    getInputWheelHandler("number")(event);

    expect(event.currentTarget.blur).toHaveBeenCalledTimes(1);
  });

  test("still calls the caller's handler on a number input", () => {
    const onWheel = jest.fn();
    const event = makeWheelEvent();
    getInputWheelHandler("number", onWheel)(event);

    expect(onWheel).toHaveBeenCalledWith(event);
    expect(event.currentTarget.blur).toHaveBeenCalledTimes(1);
  });

  test.each(["text", "email", undefined])("leaves a %s input alone", (type) => {
    const onWheel = jest.fn();

    expect(getInputWheelHandler(type, onWheel)).toBe(onWheel);
    expect(getInputWheelHandler(type)).toBeUndefined();
  });
});
