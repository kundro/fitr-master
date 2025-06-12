import { PinDirection, PinValueType, NodeCommandType } from "../enums";
import { IFlowListItemModel } from "../flow";

export interface IFlowOutputModel {
  id: number;
  name: string;
  isActive: boolean;
  aliases: IAliasOutputModel[];
  nodes: IFlowNodeOutputModel[];
  connectors: IConnectorOutputModel[];
  x: number;
  y: number;
}

export interface IFlowNodeOutputModel {
  key: string;
  id: number;
  nodeId: number;
  name: string;
  x: number;
  y: number;
  isActive: boolean;
  commandType: NodeCommandType;
  command: string;
  subFlowId?: number;
  inputPins: IPinValueOutputModel[];
  outputPins: IPinValueOutputModel[];
}

export interface IPinValueOutputModel {
  key: string;
  id: number;
  pinId: number;
  nodeId: number;
  flowNodeId: number;
  name: string;
  value: string;
  valueType: PinValueType;
  direction: PinDirection;
  isPublic: boolean;
  connections?: string[];
}

export interface IAliasOutputModel {
  id: number;
  name: string;
  direction: PinDirection;
  valueType: PinValueType;
  pinValueIds: number[];
}

export interface IFlowPlatformListItemOutputModel {
  id: number;
  name: string;
  nodes: IPlatformNodeListItemOutputModel[];
}

export interface IPlatformNodeListItemOutputModel {
  id: number;
  name: string;
}

export interface IConnectorOutputModel {
  id: number;
  startPinValueId: number;
  endPinValueId: number;
}

export interface IFlowsAsTasksListItemOutputModel {
  id: number;
  name: string;
  flows: IFlowListItemModel[];
}
