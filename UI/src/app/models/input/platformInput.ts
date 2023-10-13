import { NodeCommandType, PinDirection, PinValueType } from "../enums";

export interface IPlatformInputModel {
  id: number;
  name?: string;
  description?: string;
  author?: string;
  isActive: boolean;
}

export interface IPlatformNodeInputModel {
  id: number;
  platformId: number;
  name?: string;
  command?: string;
  commandType: NodeCommandType;
  isActive: boolean;
}

export interface IPlatformNodePinInputModel {
  id: number;
  nodeId: number;
  name?: string;
  direction: PinDirection;
  valueType: PinValueType;
  isPublic: boolean;
}
