import { NodeCommandType, PinDirection, PinValueType } from "../enums";

export interface IRunFlowModel {
  id: number;
  name: string;
  aliases: IRunFlowAlias[];
  nodes: IRunFlowNodeModel[];
  connectors: IRunConnector[];
}

export interface IRunFlowNodeModel {
  id: number;
  nodeId: number;
  name: string;
  commandType: NodeCommandType;
  command: string;
  subFlowId?: number;
  inputPins: IRunNodePinModel[];
  outputPins: IRunNodePinModel[];
  processed?: boolean;
}

export interface IRunNodePinModel {
  id: number;
  name: string;
  valueType: PinValueType;
  isPublic: boolean;
  value?: string;
  node?: IRunFlowNodeModel;
  parentPin?: IRunNodePinModel;
}

export interface IRunFlowAlias {
  id: number;
  name: string;
  direction: PinDirection;
  valueType: PinValueType;
  pinValueIds: number[];
}

export interface IRunConnector {
  startPinValueId: number;
  endPinValueId: number;
}
