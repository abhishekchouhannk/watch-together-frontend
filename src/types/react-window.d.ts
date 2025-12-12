declare module "react-window" {
  import * as React from "react";

  export type GridChildComponentProps = {
    columnIndex: number;
    rowIndex: number;
    style: React.CSSProperties;
    data?: any;
  };

  export const FixedSizeGrid: React.ComponentType<any>;
  export const VariableSizeGrid: React.ComponentType<any>;
  export const FixedSizeList: React.ComponentType<any>;
  export const VariableSizeList: React.ComponentType<any>;

  const _default: any;
  export default _default;
}
