import classNames from "classnames";
import React, { useState } from "react";
import DragAndDrop from "../../../../utils/dragAndDrop";
import newGuid from "../../../../utils/guid";
import { PinDirection, PinValueType } from "../../../models/enums";
import { INodeObservable, IPinObservable } from "../../Flow";
import "./Pin.scss";

interface IPinProps {
  key: string;
  hideName?: boolean;
  node?: INodeObservable;
  observable: IPinObservable;
  onPinsConnect?: (startPin: IPinObservable, endPin: IPinObservable) => void;
}

const renderTitle = (
  title: string,
  pinDirection: PinDirection,
  valueType: PinValueType,
  isPinConnected: boolean,
  hideName?: boolean,
  hasValue?: boolean
) => {
  const isNodeValue = valueType === PinValueType.Node;

  const icon = (
    <i
      className={classNames(`pin-icon s-80 pin-color-${valueType}`, {
        "icon-play": isNodeValue && isPinConnected,
        "icon-play-o": isNodeValue && !isPinConnected,
        "icon-circle": !isNodeValue && isPinConnected,
        "icon-circle-o": !isNodeValue && !isPinConnected,
      })}
    ></i>
  );

  const titleContent = !hideName && (
    <span className={classNames({ "font-weight-bold": hasValue })}>
      {title}
      {hasValue && "*"}
    </span>
  );

  return (
    <>
      {pinDirection === PinDirection.Output && title && titleContent}
      {icon}
      {pinDirection === PinDirection.Input && title && titleContent}
    </>
  );
};

const hasConnectors = (pin1: IPinObservable, pin2: IPinObservable): boolean => {
  const [startPin, endPin] =
    pin1.model.direction === PinDirection.Input ? [pin2, pin1] : [pin1, pin2];

  const startConnector = startPin.node.connectors.find(
    (x) =>
      x.value.startPin.model === startPin.model &&
      x.value.endPin.model === endPin.model
  );

  const endConnector = endPin.node.connectors.find(
    (x) =>
      x.value.startPin.model === startPin.model &&
      x.value.endPin.model === endPin.model
  );

  return !!startConnector && !!endConnector;
};

const canPinsConnect = (
  pin1: IPinObservable,
  pin2: IPinObservable
): boolean => {
  return (
    pin1.model.valueType === pin2.model.valueType &&
    pin1.model.direction !== pin2.model.direction &&
    !hasConnectors(pin1, pin2)
  );
};

function Pin({ observable, hideName, onPinsConnect }: IPinProps) {
  const [isdragOver, setDragOverClass] = useState(false);

  return (
    <div
      hidden={!observable.model.isPublic}
      id={observable.model.key}
      className={classNames("pin", { "drag-over": isdragOver })}
      draggable
      onDragOver={(e) => {
        setDragOverClass(true);
        e.preventDefault();
      }}
      onDragLeave={(e) => {
        setDragOverClass(false);
        e.preventDefault();
      }}
      onDrop={(e) => {
        setDragOverClass(false);
        e.preventDefault();
        const drop = DragAndDrop.getPinData();

        if (onPinsConnect && drop && canPinsConnect(observable, drop.pin)) {
          const [start, end] =
            observable.model.direction === PinDirection.Input
              ? [drop.pin, observable]
              : [observable, drop.pin];

          onPinsConnect(start, end);
        }
      }}
      onDragStart={(e) => {
        e.dataTransfer.setDragImage(new Image(), 0, 0);
        DragAndDrop.setPinData({ pin: observable });
      }}
    >
      {renderTitle(
        observable.model.name,
        observable.model.direction,
        observable.model.valueType,
        !!observable.model.connections?.length,
        hideName,
        !!observable.model.value
      )}
    </div>
  );
}

export function PinGhost(props: {
  direction: PinDirection;
  valueType: PinValueType;
}) {
  return (
    <div
      style={{ display: "block", visibility: "hidden" }}
      key={newGuid()}
      className="pin"
    >
      {renderTitle("", props.direction, props.valueType, false)}
    </div>
  );
}

export default Pin;
