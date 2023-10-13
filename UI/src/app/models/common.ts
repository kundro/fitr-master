import { PinValueType } from "./enums";

export interface IPosition {
  x: number;
  y: number;
}

export interface IConnector {
  key: string;
  startNodeKey: string;
  startPinKey: string;
  endNodeKey: string;
  endPinKey: string;
  pinValueType: PinValueType;
  // startElement: HTMLElement;
  // endElement: HTMLElement;
}

export const FLOW_IN_COMMAND = "FLOW_IN";
export const FLOW_OUT_COMMAND = "FLOW_OUT";

export const FLOW_INPUT_NODE_ID = 1;
export const FLOW_OUTPUT_NODE_ID = 2;
