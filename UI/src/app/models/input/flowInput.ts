import { PinDirection, PinValueType } from "../enums";

export interface IFlowInputModel {
  id: number;
  name: string;
  isActive: boolean;
  aliases: IAliasInputModel[];
  flowNodes: IFlowNodeInputModel[];
  connectors: IConnectorInputModel[];
  x: number;
  y: number;
}

export interface IAliasInputModel {
  id: number;
  name: string;
  direction: PinDirection;
  valueType: PinValueType;
  pinValueKeys: string[];
}

export interface IFlowNodeInputModel {
  id: number;
  nodeId: number;
  name: string;
  pinValues: IPinValueInputModel[];
  x: number;
  y: number;
}

export interface IPinValueInputModel {
  id: number;
  pinId: number;
  key: string;
  value: string;
}

export interface IConnectorInputModel {
  startPinValueKey: string;
  endPinValueKey: string;
}
