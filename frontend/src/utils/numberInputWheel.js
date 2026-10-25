/**
 * The wheel handler for an input of the given type.
 *
 * Browsers step a focused number input on every wheel tick, so scrolling the
 * page with the pointer over an amount field silently changes the amount.
 * Blurring the field first lets the wheel scroll the page instead.
 *
 * @param {string|undefined} type - the input's type attribute
 * @param {Function} [onWheel] - the caller's own handler, still called
 * @returns {Function|undefined}
 */
export function getInputWheelHandler(type, onWheel) {
  if (type !== "number") return onWheel;

  return (event) => {
    onWheel?.(event);
    event.currentTarget.blur();
  };
}
