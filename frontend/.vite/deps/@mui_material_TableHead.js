import {
  Tablelvl2Context_default
} from "./chunk-FV4JRIR3.js";
import {
  useDefaultProps
} from "./chunk-T4IY7EUN.js";
import {
  composeClasses,
  generateUtilityClass,
  generateUtilityClasses,
  require_prop_types,
  styled_default
} from "./chunk-CG2KCXUZ.js";
import {
  clsx_default
} from "./chunk-LNJWJNFR.js";
import {
  require_jsx_runtime
} from "./chunk-OZ6CQKAS.js";
import {
  require_react
} from "./chunk-PNII7RQZ.js";
import {
  __toESM
} from "./chunk-ONY6HBPH.js";

// node_modules/@mui/material/TableHead/TableHead.js
var React = __toESM(require_react());
var import_prop_types = __toESM(require_prop_types());

// node_modules/@mui/material/TableHead/tableHeadClasses.js
function getTableHeadUtilityClass(slot) {
  return generateUtilityClass("MuiTableHead", slot);
}
var tableHeadClasses = generateUtilityClasses("MuiTableHead", ["root"]);
var tableHeadClasses_default = tableHeadClasses;

// node_modules/@mui/material/TableHead/TableHead.js
var import_jsx_runtime = __toESM(require_jsx_runtime());
var useUtilityClasses = (ownerState) => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ["root"]
  };
  return composeClasses(slots, getTableHeadUtilityClass, classes);
};
var TableHeadRoot = styled_default("thead", {
  name: "MuiTableHead",
  slot: "Root",
  overridesResolver: (props, styles) => styles.root
})({
  display: "table-header-group"
});
var tablelvl2 = {
  variant: "head"
};
var defaultComponent = "thead";
var TableHead = React.forwardRef(function TableHead2(inProps, ref) {
  const props = useDefaultProps({
    props: inProps,
    name: "MuiTableHead"
  });
  const {
    className,
    component = defaultComponent,
    ...other
  } = props;
  const ownerState = {
    ...props,
    component
  };
  const classes = useUtilityClasses(ownerState);
  return (0, import_jsx_runtime.jsx)(Tablelvl2Context_default.Provider, {
    value: tablelvl2,
    children: (0, import_jsx_runtime.jsx)(TableHeadRoot, {
      as: component,
      className: clsx_default(classes.root, className),
      ref,
      role: component === defaultComponent ? null : "rowgroup",
      ownerState,
      ...other
    })
  });
});
true ? TableHead.propTypes = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │    To update them, edit the d.ts file and run `pnpm proptypes`.     │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * The content of the component, normally `TableRow`.
   */
  children: import_prop_types.default.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: import_prop_types.default.object,
  /**
   * @ignore
   */
  className: import_prop_types.default.string,
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: import_prop_types.default.elementType,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: import_prop_types.default.oneOfType([import_prop_types.default.arrayOf(import_prop_types.default.oneOfType([import_prop_types.default.func, import_prop_types.default.object, import_prop_types.default.bool])), import_prop_types.default.func, import_prop_types.default.object])
} : void 0;
var TableHead_default = TableHead;
export {
  TableHead_default as default,
  getTableHeadUtilityClass,
  tableHeadClasses_default as tableHeadClasses
};
//# sourceMappingURL=@mui_material_TableHead.js.map
