import React from "react";
import Draggable, {
  DraggableEventHandler,
  DraggableEvent,
  DraggableData,
} from "react-draggable";
import "./Node.scss";
import {
  IFlowNodeOutputModel,
  IPinValueOutputModel,
} from "../../../models/output/flowOutput";
import {
  NodeCommandType,
  PinDirection,
  PinValueType,
} from "../../../models/enums";
import { Observer } from "../../../../utils/observable";
import classNames from "classnames";
import { Icon } from "@fluentui/react";
import Pin, { PinGhost } from "../Pin/Pin";
import { INodeObservable, IPinObservable } from "../../Flow";

interface INodeProps {
  key: string;
  observable: INodeObservable;
  selected?: boolean;
  onMouseDown?: (node: INodeObservable) => void;
  onPinsConnect?: (startPin: IPinObservable, endPin: IPinObservable) => void;
}

function commandToIconName(command: NodeCommandType): string {
  switch (command) {
    case NodeCommandType.Page:
      return "TVMonitor";
    case NodeCommandType.Command:
      return "Settings";
    case NodeCommandType.Api:
      return "LightningBolt";
  }

  return "";
}

export default function Node({
  observable,
  selected,
  onMouseDown,
  onPinsConnect,
}: INodeProps) {
  const onDrag: DraggableEventHandler = (
    e: DraggableEvent,
    data: DraggableData
  ) => {
    observable.model.value.x = Math.round(data.x);
    observable.model.value.y = Math.round(data.y);

    observable.connectors.forEach((x) => x.notify());
  };

  const pinToObservable = (pin: IPinValueOutputModel): IPinObservable => {
    return { model: pin, node: observable };
  };

  return (
    <Observer model={observable.model}>
      {(observer: { model: IFlowNodeOutputModel }) => {
        let inputPin = observer.model.inputPins.find(
          (x) => x.valueType === PinValueType.Node
        );

        let outputPin = observer.model.outputPins.find(
          (x) => x.valueType === PinValueType.Node
        );

        if (
          observer.model.inputPins.length < 2 &&
          observer.model.outputPins.length < 2
        ) {
          inputPin = observer.model.inputPins.find((x) => x);
          outputPin = observer.model.outputPins.find((x) => x);
        }
        return (
          <Draggable
            cancel=".pin"
            defaultPosition={{
              x: Math.round(observer.model.x),
              y: Math.round(observer.model.y),
            }}
            onDrag={onDrag}
            onMouseDown={(e) => {
              onMouseDown && onMouseDown(observable);
              e.stopPropagation();
            }}
          >
            <div
              className={classNames("card node d-flex flex-column noselect", {
                "node-selected": selected,
              })}
            >
              <div className="d-flex flex-row justify-content-between">
                {(inputPin && (
                  <Pin
                    key={inputPin.key}
                    observable={pinToObservable(inputPin)}
                    node={observable}
                    hideName
                    onPinsConnect={onPinsConnect}
                  />
                )) || (
                  <PinGhost
                    direction={PinDirection.Input}
                    valueType={PinValueType.Node}
                  />
                )}
                <span className="node-name font-weight-bold">
                  <Icon
                    iconName={commandToIconName(observer.model.commandType)}
                    className="mr-1 font-weight-bold align-middle"
                  />
                  <span className="align-middle">{observer.model.name}</span>
                </span>
                {(outputPin && (
                  <Pin
                    key={outputPin.key}
                    observable={pinToObservable(outputPin)}
                    node={observable}
                    hideName
                    onPinsConnect={onPinsConnect}
                  />
                )) || (
                  <PinGhost
                    direction={PinDirection.Output}
                    valueType={PinValueType.Node}
                  />
                )}
              </div>
              <div
                className="d-flex justify-content-between"
                style={{ width: "100%" }}
              >
                <div className="input-pins">
                  {observer.model.inputPins
                    .filter((x) => x !== inputPin)
                    .map((pin) => (
                      <Pin
                        key={pin.key}
                        observable={pinToObservable(pin)}
                        node={observable}
                        onPinsConnect={onPinsConnect}
                      />
                    ))}
                </div>
                <div className="output-pins">
                  {observer.model.outputPins
                    .filter((x) => x !== outputPin)
                    .map((pin) => (
                      <Pin
                        key={pin.key}
                        observable={pinToObservable(pin)}
                        node={observable}
                        onPinsConnect={onPinsConnect}
                      />
                    ))}
                </div>
              </div>
            </div>
          </Draggable>
        );
      }}
    </Observer>
  );
}
