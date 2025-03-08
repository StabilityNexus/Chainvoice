import {
  Drawer_default,
  getAnchor,
  isHorizontal
} from "./chunk-RCFQWYE3.js";
import {
  getTransitionProps
} from "./chunk-56LPINQB.js";
import {
  useSlot
} from "./chunk-LDI67BOE.js";
import "./chunk-IWHMODLJ.js";
import "./chunk-5GZ4DTWO.js";
import {
  mergeSlotProps,
  ownerDocument_default,
  ownerWindow_default
} from "./chunk-EBBET3WM.js";
import {
  capitalize_default
} from "./chunk-JAQOTTDK.js";
import "./chunk-NSR2DZIS.js";
import {
  useEnhancedEffect_default as useEnhancedEffect_default2,
  useEventCallback_default,
  useForkRef_default
} from "./chunk-H6CGQO7T.js";
import {
  memoTheme_default
} from "./chunk-ATZQIXHB.js";
import {
  useDefaultProps
} from "./chunk-T4IY7EUN.js";
import {
  elementTypeAcceptingRef_default,
  exactProp,
  require_prop_types,
  rootShouldForwardProp_default,
  styled_default,
  useEnhancedEffect_default,
  useTheme
} from "./chunk-CG2KCXUZ.js";
import {
  clsx_default
} from "./chunk-LNJWJNFR.js";
import {
  require_jsx_runtime
} from "./chunk-OZ6CQKAS.js";
import {
  require_react_dom
} from "./chunk-2JZJ2OCM.js";
import {
  require_react
} from "./chunk-PNII7RQZ.js";
import {
  __toESM
} from "./chunk-ONY6HBPH.js";

// node_modules/@mui/material/SwipeableDrawer/SwipeableDrawer.js
var React3 = __toESM(require_react());
var ReactDOM = __toESM(require_react_dom());
var import_prop_types3 = __toESM(require_prop_types());

// node_modules/@mui/material/NoSsr/NoSsr.js
var React = __toESM(require_react());
var import_prop_types = __toESM(require_prop_types());
function NoSsr(props) {
  const {
    children,
    defer = false,
    fallback = null
  } = props;
  const [mountedState, setMountedState] = React.useState(false);
  useEnhancedEffect_default(() => {
    if (!defer) {
      setMountedState(true);
    }
  }, [defer]);
  React.useEffect(() => {
    if (defer) {
      setMountedState(true);
    }
  }, [defer]);
  return mountedState ? children : fallback;
}
true ? NoSsr.propTypes = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * You can wrap a node.
   */
  children: import_prop_types.default.node,
  /**
   * If `true`, the component will not only prevent server-side rendering.
   * It will also defer the rendering of the children into a different screen frame.
   * @default false
   */
  defer: import_prop_types.default.bool,
  /**
   * The fallback content to display.
   * @default null
   */
  fallback: import_prop_types.default.node
} : void 0;
if (true) {
  NoSsr["propTypes"] = exactProp(NoSsr.propTypes);
}
var NoSsr_default = NoSsr;

// node_modules/@mui/material/SwipeableDrawer/SwipeArea.js
var React2 = __toESM(require_react());
var import_prop_types2 = __toESM(require_prop_types());
var import_jsx_runtime = __toESM(require_jsx_runtime());
var SwipeAreaRoot = styled_default("div", {
  shouldForwardProp: rootShouldForwardProp_default
})(memoTheme_default(({
  theme
}) => ({
  position: "fixed",
  top: 0,
  left: 0,
  bottom: 0,
  zIndex: theme.zIndex.drawer - 1,
  variants: [{
    props: {
      anchor: "left"
    },
    style: {
      right: "auto"
    }
  }, {
    props: {
      anchor: "right"
    },
    style: {
      left: "auto",
      right: 0
    }
  }, {
    props: {
      anchor: "top"
    },
    style: {
      bottom: "auto",
      right: 0
    }
  }, {
    props: {
      anchor: "bottom"
    },
    style: {
      top: "auto",
      bottom: 0,
      right: 0
    }
  }]
})));
var SwipeArea = React2.forwardRef(function SwipeArea2(props, ref) {
  const {
    anchor,
    classes = {},
    className,
    width,
    style,
    ...other
  } = props;
  const ownerState = props;
  return (0, import_jsx_runtime.jsx)(SwipeAreaRoot, {
    className: clsx_default("PrivateSwipeArea-root", classes.root, classes[`anchor${capitalize_default(anchor)}`], className),
    ref,
    style: {
      [isHorizontal(anchor) ? "width" : "height"]: width,
      ...style
    },
    ownerState,
    ...other
  });
});
true ? SwipeArea.propTypes = {
  /**
   * Side on which to attach the discovery area.
   */
  anchor: import_prop_types2.default.oneOf(["left", "top", "right", "bottom"]).isRequired,
  /**
   * @ignore
   */
  classes: import_prop_types2.default.object,
  /**
   * @ignore
   */
  className: import_prop_types2.default.string,
  /**
   * @ignore
   */
  style: import_prop_types2.default.object,
  /**
   * The width of the left most (or right most) area in `px` where the
   * drawer can be swiped open from.
   */
  width: import_prop_types2.default.number.isRequired
} : void 0;
var SwipeArea_default = SwipeArea;

// node_modules/@mui/material/SwipeableDrawer/SwipeableDrawer.js
var import_jsx_runtime2 = __toESM(require_jsx_runtime());
var UNCERTAINTY_THRESHOLD = 3;
var DRAG_STARTED_SIGNAL = 20;
var claimedSwipeInstance = null;
function calculateCurrentX(anchor, touches, doc) {
  return anchor === "right" ? doc.body.offsetWidth - touches[0].pageX : touches[0].pageX;
}
function calculateCurrentY(anchor, touches, containerWindow) {
  return anchor === "bottom" ? containerWindow.innerHeight - touches[0].clientY : touches[0].clientY;
}
function getMaxTranslate(horizontalSwipe, paperInstance) {
  return horizontalSwipe ? paperInstance.clientWidth : paperInstance.clientHeight;
}
function getTranslate(currentTranslate, startLocation, open, maxTranslate) {
  return Math.min(Math.max(open ? startLocation - currentTranslate : maxTranslate + startLocation - currentTranslate, 0), maxTranslate);
}
function getDomTreeShapes(element, rootNode) {
  const domTreeShapes = [];
  while (element && element !== rootNode.parentElement) {
    const style = ownerWindow_default(rootNode).getComputedStyle(element);
    if (
      // Ignore the scroll children if the element is absolute positioned.
      style.getPropertyValue("position") === "absolute" || // Ignore the scroll children if the element has an overflowX hidden
      style.getPropertyValue("overflow-x") === "hidden"
    ) {
    } else if (element.clientWidth > 0 && element.scrollWidth > element.clientWidth || element.clientHeight > 0 && element.scrollHeight > element.clientHeight) {
      domTreeShapes.push(element);
    }
    element = element.parentElement;
  }
  return domTreeShapes;
}
function computeHasNativeHandler({
  domTreeShapes,
  start,
  current,
  anchor
}) {
  const axisProperties = {
    scrollPosition: {
      x: "scrollLeft",
      y: "scrollTop"
    },
    scrollLength: {
      x: "scrollWidth",
      y: "scrollHeight"
    },
    clientLength: {
      x: "clientWidth",
      y: "clientHeight"
    }
  };
  return domTreeShapes.some((shape) => {
    let goingForward = current >= start;
    if (anchor === "top" || anchor === "left") {
      goingForward = !goingForward;
    }
    const axis = anchor === "left" || anchor === "right" ? "x" : "y";
    const scrollPosition = Math.round(shape[axisProperties.scrollPosition[axis]]);
    const areNotAtStart = scrollPosition > 0;
    const areNotAtEnd = scrollPosition + shape[axisProperties.clientLength[axis]] < shape[axisProperties.scrollLength[axis]];
    if (goingForward && areNotAtEnd || !goingForward && areNotAtStart) {
      return true;
    }
    return false;
  });
}
var iOS = typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);
var SwipeableDrawer = React3.forwardRef(function SwipeableDrawer2(inProps, ref) {
  const props = useDefaultProps({
    name: "MuiSwipeableDrawer",
    props: inProps
  });
  const theme = useTheme();
  const transitionDurationDefault = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen
  };
  const {
    anchor = "left",
    disableBackdropTransition = false,
    disableDiscovery = false,
    disableSwipeToOpen = iOS,
    hideBackdrop,
    hysteresis = 0.52,
    allowSwipeInChildren = false,
    minFlingVelocity = 450,
    ModalProps: {
      BackdropProps,
      ...ModalPropsProp
    } = {},
    onClose,
    onOpen,
    open = false,
    PaperProps = {},
    SwipeAreaProps,
    swipeAreaWidth = 20,
    transitionDuration = transitionDurationDefault,
    variant = "temporary",
    // Mobile first.
    slots = {},
    slotProps = {},
    ...other
  } = props;
  const [maybeSwiping, setMaybeSwiping] = React3.useState(false);
  const swipeInstance = React3.useRef({
    isSwiping: null
  });
  const swipeAreaRef = React3.useRef();
  const backdropRef = React3.useRef();
  const paperRef = React3.useRef();
  const handleRef = useForkRef_default(PaperProps.ref, paperRef);
  const touchDetected = React3.useRef(false);
  const calculatedDurationRef = React3.useRef();
  useEnhancedEffect_default2(() => {
    calculatedDurationRef.current = null;
  }, [open]);
  const setPosition = React3.useCallback((translate, options = {}) => {
    const {
      mode = null,
      changeTransition = true
    } = options;
    const anchorRtl = getAnchor(theme, anchor);
    const rtlTranslateMultiplier = ["right", "bottom"].includes(anchorRtl) ? 1 : -1;
    const horizontalSwipe = isHorizontal(anchor);
    const transform = horizontalSwipe ? `translate(${rtlTranslateMultiplier * translate}px, 0)` : `translate(0, ${rtlTranslateMultiplier * translate}px)`;
    const drawerStyle = paperRef.current.style;
    drawerStyle.webkitTransform = transform;
    drawerStyle.transform = transform;
    let transition = "";
    if (mode) {
      transition = theme.transitions.create("all", getTransitionProps({
        easing: void 0,
        style: void 0,
        timeout: transitionDuration
      }, {
        mode
      }));
    }
    if (changeTransition) {
      drawerStyle.webkitTransition = transition;
      drawerStyle.transition = transition;
    }
    if (!disableBackdropTransition && !hideBackdrop) {
      const backdropStyle = backdropRef.current.style;
      backdropStyle.opacity = 1 - translate / getMaxTranslate(horizontalSwipe, paperRef.current);
      if (changeTransition) {
        backdropStyle.webkitTransition = transition;
        backdropStyle.transition = transition;
      }
    }
  }, [anchor, disableBackdropTransition, hideBackdrop, theme, transitionDuration]);
  const handleBodyTouchEnd = useEventCallback_default((nativeEvent) => {
    if (!touchDetected.current) {
      return;
    }
    claimedSwipeInstance = null;
    touchDetected.current = false;
    ReactDOM.flushSync(() => {
      setMaybeSwiping(false);
    });
    if (!swipeInstance.current.isSwiping) {
      swipeInstance.current.isSwiping = null;
      return;
    }
    swipeInstance.current.isSwiping = null;
    const anchorRtl = getAnchor(theme, anchor);
    const horizontal = isHorizontal(anchor);
    let current;
    if (horizontal) {
      current = calculateCurrentX(anchorRtl, nativeEvent.changedTouches, ownerDocument_default(nativeEvent.currentTarget));
    } else {
      current = calculateCurrentY(anchorRtl, nativeEvent.changedTouches, ownerWindow_default(nativeEvent.currentTarget));
    }
    const startLocation = horizontal ? swipeInstance.current.startX : swipeInstance.current.startY;
    const maxTranslate = getMaxTranslate(horizontal, paperRef.current);
    const currentTranslate = getTranslate(current, startLocation, open, maxTranslate);
    const translateRatio = currentTranslate / maxTranslate;
    if (Math.abs(swipeInstance.current.velocity) > minFlingVelocity) {
      calculatedDurationRef.current = Math.abs((maxTranslate - currentTranslate) / swipeInstance.current.velocity) * 1e3;
    }
    if (open) {
      if (swipeInstance.current.velocity > minFlingVelocity || translateRatio > hysteresis) {
        onClose();
      } else {
        setPosition(0, {
          mode: "exit"
        });
      }
      return;
    }
    if (swipeInstance.current.velocity < -minFlingVelocity || 1 - translateRatio > hysteresis) {
      onOpen();
    } else {
      setPosition(getMaxTranslate(horizontal, paperRef.current), {
        mode: "enter"
      });
    }
  });
  const startMaybeSwiping = (force = false) => {
    if (!maybeSwiping) {
      if (force || !(disableDiscovery && allowSwipeInChildren)) {
        ReactDOM.flushSync(() => {
          setMaybeSwiping(true);
        });
      }
      const horizontalSwipe = isHorizontal(anchor);
      if (!open && paperRef.current) {
        setPosition(getMaxTranslate(horizontalSwipe, paperRef.current) + (disableDiscovery ? 15 : -DRAG_STARTED_SIGNAL), {
          changeTransition: false
        });
      }
      swipeInstance.current.velocity = 0;
      swipeInstance.current.lastTime = null;
      swipeInstance.current.lastTranslate = null;
      swipeInstance.current.paperHit = false;
      touchDetected.current = true;
    }
  };
  const handleBodyTouchMove = useEventCallback_default((nativeEvent) => {
    if (!paperRef.current || !touchDetected.current) {
      return;
    }
    if (claimedSwipeInstance !== null && claimedSwipeInstance !== swipeInstance.current) {
      return;
    }
    startMaybeSwiping(true);
    const anchorRtl = getAnchor(theme, anchor);
    const horizontalSwipe = isHorizontal(anchor);
    const currentX = calculateCurrentX(anchorRtl, nativeEvent.touches, ownerDocument_default(nativeEvent.currentTarget));
    const currentY = calculateCurrentY(anchorRtl, nativeEvent.touches, ownerWindow_default(nativeEvent.currentTarget));
    if (open && paperRef.current.contains(nativeEvent.target) && claimedSwipeInstance === null) {
      const domTreeShapes = getDomTreeShapes(nativeEvent.target, paperRef.current);
      const hasNativeHandler = computeHasNativeHandler({
        domTreeShapes,
        start: horizontalSwipe ? swipeInstance.current.startX : swipeInstance.current.startY,
        current: horizontalSwipe ? currentX : currentY,
        anchor
      });
      if (hasNativeHandler) {
        claimedSwipeInstance = true;
        return;
      }
      claimedSwipeInstance = swipeInstance.current;
    }
    if (swipeInstance.current.isSwiping == null) {
      const dx = Math.abs(currentX - swipeInstance.current.startX);
      const dy = Math.abs(currentY - swipeInstance.current.startY);
      const definitelySwiping = horizontalSwipe ? dx > dy && dx > UNCERTAINTY_THRESHOLD : dy > dx && dy > UNCERTAINTY_THRESHOLD;
      if (definitelySwiping && nativeEvent.cancelable) {
        nativeEvent.preventDefault();
      }
      if (definitelySwiping === true || (horizontalSwipe ? dy > UNCERTAINTY_THRESHOLD : dx > UNCERTAINTY_THRESHOLD)) {
        swipeInstance.current.isSwiping = definitelySwiping;
        if (!definitelySwiping) {
          handleBodyTouchEnd(nativeEvent);
          return;
        }
        swipeInstance.current.startX = currentX;
        swipeInstance.current.startY = currentY;
        if (!disableDiscovery && !open) {
          if (horizontalSwipe) {
            swipeInstance.current.startX -= DRAG_STARTED_SIGNAL;
          } else {
            swipeInstance.current.startY -= DRAG_STARTED_SIGNAL;
          }
        }
      }
    }
    if (!swipeInstance.current.isSwiping) {
      return;
    }
    const maxTranslate = getMaxTranslate(horizontalSwipe, paperRef.current);
    let startLocation = horizontalSwipe ? swipeInstance.current.startX : swipeInstance.current.startY;
    if (open && !swipeInstance.current.paperHit) {
      startLocation = Math.min(startLocation, maxTranslate);
    }
    const translate = getTranslate(horizontalSwipe ? currentX : currentY, startLocation, open, maxTranslate);
    if (open) {
      if (!swipeInstance.current.paperHit) {
        const paperHit = horizontalSwipe ? currentX < maxTranslate : currentY < maxTranslate;
        if (paperHit) {
          swipeInstance.current.paperHit = true;
          swipeInstance.current.startX = currentX;
          swipeInstance.current.startY = currentY;
        } else {
          return;
        }
      } else if (translate === 0) {
        swipeInstance.current.startX = currentX;
        swipeInstance.current.startY = currentY;
      }
    }
    if (swipeInstance.current.lastTranslate === null) {
      swipeInstance.current.lastTranslate = translate;
      swipeInstance.current.lastTime = performance.now() + 1;
    }
    const velocity = (translate - swipeInstance.current.lastTranslate) / (performance.now() - swipeInstance.current.lastTime) * 1e3;
    swipeInstance.current.velocity = swipeInstance.current.velocity * 0.4 + velocity * 0.6;
    swipeInstance.current.lastTranslate = translate;
    swipeInstance.current.lastTime = performance.now();
    if (nativeEvent.cancelable) {
      nativeEvent.preventDefault();
    }
    setPosition(translate);
  });
  const handleBodyTouchStart = useEventCallback_default((nativeEvent) => {
    var _a;
    if (nativeEvent.defaultPrevented) {
      return;
    }
    if (nativeEvent.defaultMuiPrevented) {
      return;
    }
    if (open && (hideBackdrop || !backdropRef.current.contains(nativeEvent.target)) && !paperRef.current.contains(nativeEvent.target)) {
      return;
    }
    const anchorRtl = getAnchor(theme, anchor);
    const horizontalSwipe = isHorizontal(anchor);
    const currentX = calculateCurrentX(anchorRtl, nativeEvent.touches, ownerDocument_default(nativeEvent.currentTarget));
    const currentY = calculateCurrentY(anchorRtl, nativeEvent.touches, ownerWindow_default(nativeEvent.currentTarget));
    if (!open) {
      if (disableSwipeToOpen || !(nativeEvent.target === swipeAreaRef.current || ((_a = paperRef.current) == null ? void 0 : _a.contains(nativeEvent.target)) && (typeof allowSwipeInChildren === "function" ? allowSwipeInChildren(nativeEvent, swipeAreaRef.current, paperRef.current) : allowSwipeInChildren))) {
        return;
      }
      if (horizontalSwipe) {
        if (currentX > swipeAreaWidth) {
          return;
        }
      } else if (currentY > swipeAreaWidth) {
        return;
      }
    }
    nativeEvent.defaultMuiPrevented = true;
    claimedSwipeInstance = null;
    swipeInstance.current.startX = currentX;
    swipeInstance.current.startY = currentY;
    startMaybeSwiping();
  });
  React3.useEffect(() => {
    if (variant === "temporary") {
      const doc = ownerDocument_default(paperRef.current);
      doc.addEventListener("touchstart", handleBodyTouchStart);
      doc.addEventListener("touchmove", handleBodyTouchMove, {
        passive: !open
      });
      doc.addEventListener("touchend", handleBodyTouchEnd);
      return () => {
        doc.removeEventListener("touchstart", handleBodyTouchStart);
        doc.removeEventListener("touchmove", handleBodyTouchMove, {
          passive: !open
        });
        doc.removeEventListener("touchend", handleBodyTouchEnd);
      };
    }
    return void 0;
  }, [variant, open, handleBodyTouchStart, handleBodyTouchMove, handleBodyTouchEnd]);
  React3.useEffect(() => () => {
    if (claimedSwipeInstance === swipeInstance.current) {
      claimedSwipeInstance = null;
    }
  }, []);
  React3.useEffect(() => {
    if (!open) {
      setMaybeSwiping(false);
    }
  }, [open]);
  const [SwipeAreaSlot, swipeAreaSlotProps] = useSlot("swipeArea", {
    ref: swipeAreaRef,
    elementType: SwipeArea_default,
    ownerState: props,
    externalForwardedProps: {
      slots,
      slotProps: {
        swipeArea: SwipeAreaProps,
        ...slotProps
      }
    },
    additionalProps: {
      width: swipeAreaWidth,
      anchor
    }
  });
  return (0, import_jsx_runtime2.jsxs)(React3.Fragment, {
    children: [(0, import_jsx_runtime2.jsx)(Drawer_default, {
      open: variant === "temporary" && maybeSwiping ? true : open,
      variant,
      ModalProps: {
        BackdropProps: {
          ...BackdropProps,
          ref: backdropRef
        },
        // Ensures that paperRef.current will be defined inside the touch start event handler
        // See https://github.com/mui/material-ui/issues/30414 for more information
        ...variant === "temporary" && {
          keepMounted: true
        },
        ...ModalPropsProp
      },
      hideBackdrop,
      anchor,
      transitionDuration: calculatedDurationRef.current || transitionDuration,
      onClose,
      ref,
      slots,
      slotProps: {
        ...slotProps,
        backdrop: mergeSlotProps(slotProps.backdrop ?? BackdropProps, {
          ref: backdropRef
        }),
        paper: mergeSlotProps(slotProps.paper ?? PaperProps, {
          style: {
            pointerEvents: variant === "temporary" && !open && !allowSwipeInChildren ? "none" : ""
          },
          ref: handleRef
        })
      },
      ...other
    }), !disableSwipeToOpen && variant === "temporary" && (0, import_jsx_runtime2.jsx)(NoSsr_default, {
      children: (0, import_jsx_runtime2.jsx)(SwipeAreaSlot, {
        ...swipeAreaSlotProps
      })
    })]
  });
});
true ? SwipeableDrawer.propTypes = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │    To update them, edit the d.ts file and run `pnpm proptypes`.     │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * If set to true, the swipe event will open the drawer even if the user begins the swipe on one of the drawer's children.
   * This can be useful in scenarios where the drawer is partially visible.
   * You can customize it further with a callback that determines which children the user can drag over to open the drawer
   * (for example, to ignore other elements that handle touch move events, like sliders).
   *
   * @param {TouchEvent} event The 'touchstart' event
   * @param {HTMLDivElement} swipeArea The swipe area element
   * @param {HTMLDivElement} paper The drawer's paper element
   *
   * @default false
   */
  allowSwipeInChildren: import_prop_types3.default.oneOfType([import_prop_types3.default.func, import_prop_types3.default.bool]),
  /**
   * @ignore
   */
  anchor: import_prop_types3.default.oneOf(["bottom", "left", "right", "top"]),
  /**
   * The content of the component.
   */
  children: import_prop_types3.default.node,
  /**
   * Disable the backdrop transition.
   * This can improve the FPS on low-end devices.
   * @default false
   */
  disableBackdropTransition: import_prop_types3.default.bool,
  /**
   * If `true`, touching the screen near the edge of the drawer will not slide in the drawer a bit
   * to promote accidental discovery of the swipe gesture.
   * @default false
   */
  disableDiscovery: import_prop_types3.default.bool,
  /**
   * If `true`, swipe to open is disabled. This is useful in browsers where swiping triggers
   * navigation actions. Swipe to open is disabled on iOS browsers by default.
   * @default typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent)
   */
  disableSwipeToOpen: import_prop_types3.default.bool,
  /**
   * @ignore
   */
  hideBackdrop: import_prop_types3.default.bool,
  /**
   * Affects how far the drawer must be opened/closed to change its state.
   * Specified as percent (0-1) of the width of the drawer
   * @default 0.52
   */
  hysteresis: import_prop_types3.default.number,
  /**
   * Defines, from which (average) velocity on, the swipe is
   * defined as complete although hysteresis isn't reached.
   * Good threshold is between 250 - 1000 px/s
   * @default 450
   */
  minFlingVelocity: import_prop_types3.default.number,
  /**
   * @ignore
   */
  ModalProps: import_prop_types3.default.shape({
    BackdropProps: import_prop_types3.default.shape({
      component: elementTypeAcceptingRef_default
    })
  }),
  /**
   * Callback fired when the component requests to be closed.
   *
   * @param {React.SyntheticEvent<{}>} event The event source of the callback.
   */
  onClose: import_prop_types3.default.func.isRequired,
  /**
   * Callback fired when the component requests to be opened.
   *
   * @param {React.SyntheticEvent<{}>} event The event source of the callback.
   */
  onOpen: import_prop_types3.default.func.isRequired,
  /**
   * If `true`, the component is shown.
   * @default false
   */
  open: import_prop_types3.default.bool,
  /**
   * @ignore
   */
  PaperProps: import_prop_types3.default.shape({
    component: elementTypeAcceptingRef_default,
    style: import_prop_types3.default.object
  }),
  /**
   * The props used for each slot inside.
   * @default {}
   */
  slotProps: import_prop_types3.default.shape({
    backdrop: import_prop_types3.default.oneOfType([import_prop_types3.default.func, import_prop_types3.default.object]),
    docked: import_prop_types3.default.oneOfType([import_prop_types3.default.func, import_prop_types3.default.object]),
    paper: import_prop_types3.default.oneOfType([import_prop_types3.default.func, import_prop_types3.default.object]),
    root: import_prop_types3.default.oneOfType([import_prop_types3.default.func, import_prop_types3.default.object]),
    swipeArea: import_prop_types3.default.oneOfType([import_prop_types3.default.func, import_prop_types3.default.object]),
    transition: import_prop_types3.default.oneOfType([import_prop_types3.default.func, import_prop_types3.default.object])
  }),
  /**
   * The components used for each slot inside.
   * @default {}
   */
  slots: import_prop_types3.default.shape({
    backdrop: import_prop_types3.default.elementType,
    docked: import_prop_types3.default.elementType,
    paper: import_prop_types3.default.elementType,
    root: import_prop_types3.default.elementType,
    swipeArea: import_prop_types3.default.elementType,
    transition: import_prop_types3.default.elementType
  }),
  /**
   * The element is used to intercept the touch events on the edge.
   * @deprecated use the `slotProps.swipeArea` prop instead. This prop will be removed in v7. See [Migrating from deprecated APIs](https://mui.com/material-ui/migration/migrating-from-deprecated-apis/) for more details.
   */
  SwipeAreaProps: import_prop_types3.default.object,
  /**
   * The width of the left most (or right most) area in `px` that
   * the drawer can be swiped open from.
   * @default 20
   */
  swipeAreaWidth: import_prop_types3.default.number,
  /**
   * The duration for the transition, in milliseconds.
   * You may specify a single timeout for all transitions, or individually with an object.
   * @default {
   *   enter: theme.transitions.duration.enteringScreen,
   *   exit: theme.transitions.duration.leavingScreen,
   * }
   */
  transitionDuration: import_prop_types3.default.oneOfType([import_prop_types3.default.number, import_prop_types3.default.shape({
    appear: import_prop_types3.default.number,
    enter: import_prop_types3.default.number,
    exit: import_prop_types3.default.number
  })]),
  /**
   * @ignore
   */
  variant: import_prop_types3.default.oneOf(["permanent", "persistent", "temporary"])
} : void 0;
var SwipeableDrawer_default = SwipeableDrawer;
export {
  SwipeableDrawer_default as default
};
//# sourceMappingURL=@mui_material_SwipeableDrawer.js.map
