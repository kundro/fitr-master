import { NodeCommandType, PinDirection, PinValueType } from "../enums";

export interface IPlatformOutputModel {
  id: number;
  name?: string;
  author?: string;
  description?: string;
  isActive: boolean;
}

export interface IPlatformListItemOutputModel {
  id: number;
  name?: string;
  author?: string;
  description?: string;
  isActive: boolean;
}

export interface IPlatformNodeOutputModel {
  id: number;
  platformId: number;
  name?: string;
  command?: string;
  commandType: NodeCommandType;
  isActive: boolean;
}

export interface IPlatformNodeListItemOutputModel {
  id: number;
  name: string;
}

export interface IPlatformNodePinOutputModel {
  id: number;
  nodeId: number;
  name?: string;
  direction: PinDirection;
  valueType: PinValueType;
  isPublic: boolean;
}

export interface IPlatformNodePinListItemOutputModel {
  id: number;
  name?: string;
  direction: PinDirection;
}
