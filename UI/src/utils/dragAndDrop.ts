import { IPinObservable } from "../app/flows/Flow";

export interface IPinDragAndDropData {
  pin: IPinObservable;
}

export default class DragAndDrop {
  private static pinData: IPinDragAndDropData | undefined;

  static getPinData = (): IPinDragAndDropData | undefined => {
    return DragAndDrop.pinData;
  };
  static setPinData = (data: IPinDragAndDropData | undefined) => {
    DragAndDrop.pinData = data;
  };
}
