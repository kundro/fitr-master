export enum NodeCommandType {
  None = 0,
  Page = 1,
  Api = 2,
  Command = 3,
  Flow = 4,
}

export enum PinValueType {
  String = 1,
  Number = 2,
  Bool = 3,
  Node = 4,
  Object = 5,
}

export enum PinDirection {
  Input = 1,
  Output = 2,
}
