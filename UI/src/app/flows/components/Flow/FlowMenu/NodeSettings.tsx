import React from "react";
import { Button, FormGroup, Label } from "reactstrap";
import * as RS from "reactstrap";
import { Observer } from "../../../../../utils/observable";
import {
  NodeCommandType,
  PinDirection,
  PinValueType,
} from "../../../../models/enums";
import {
  IFlowNodeOutputModel,
  IPinValueOutputModel,
} from "../../../../models/output/flowOutput";
import { INodeObservable } from "../../../Flow";
import { FLOW_IN_COMMAND, FLOW_OUT_COMMAND } from "../../../../models/common";
import { Icon } from "@fluentui/react";

export interface INodeSettingsProps {
  node: INodeObservable;
  onNodeDelete?: (node: INodeObservable) => void;
  onAliasAdd?: (node: INodeObservable, direction: PinDirection) => void;
  onAliasDelete?: (pin: IPinValueOutputModel, node: INodeObservable) => void;
}

const isTemplateNode = (node: IFlowNodeOutputModel): boolean => {
  if (
    node.commandType === NodeCommandType.Command &&
    ["FLOW_IN", "FLOW_OUT"].includes(node.command)
  )
    return true;

  return node.commandType === NodeCommandType.Flow;
};

const hasDataPins = (
  node: IFlowNodeOutputModel,
  direction: PinDirection
): boolean => {
  const pins =
    direction === PinDirection.Input ? node.inputPins : node.outputPins;

  return pins.filter((x) => x.valueType !== PinValueType.Node).some((x) => x);
};

const getInputByType = (
  pin: IPinValueOutputModel,
  node: INodeObservable,
  onChange?: (newValue: string) => void
): React.ReactNode | undefined => {
  let message = "";
  const isConnected = !!pin.connections?.length;
  const disabled = pin.direction === PinDirection.Output || isConnected;

  if (pin.direction === PinDirection.Input && isConnected) {
    const connector = node.connectors.find((x) => x.value.endPin.model === pin);

    if (connector) {
      message = `Inherited from "${connector.value.startPin.node.model.value.name}.${connector.value.startPin.model.name}"`;
    }
  }

  return (
    <FormGroup check={pin.valueType === PinValueType.Bool} key={pin.key}>
      {(pin.valueType === PinValueType.Bool && (
        <Label>
          <RS.Input
            type="checkbox"
            id={pin.key}
            name={pin.key}
            checked={pin.value === "true"}
            onChange={(e) => onChange && onChange(`${e.target.checked}`)}
            disabled={disabled}
          />
          {pin.name}
          {message && <small>{` (${message})`}</small>}
        </Label>
      )) ||
        (pin.valueType === PinValueType.Number && (
          <>
            <Label for={pin.key}>{pin.name}</Label>
            <RS.Input
              type="number"
              id={pin.key}
              name={pin.key}
              value={pin.value ?? ""}
              onChange={(e) => onChange && onChange(e.target.value)}
              disabled={disabled}
              placeholder={message || "Enter number value"}
            />
          </>
        )) ||
        (pin.valueType === PinValueType.String && (
          <>
            <Label for={pin.key}>{pin.name}</Label>
            <RS.Input
              type="text"
              id={pin.key}
              name={pin.key}
              value={pin.value ?? ""}
              onChange={(e) => onChange && onChange(e.target.value)}
              disabled={disabled}
              placeholder={message || "Enter string value"}
            />
          </>
        ))}
    </FormGroup>
  );
};

const renderAliasInput = (
  pin: IPinValueOutputModel,
  node: INodeObservable,
  onDelete?: (pin: IPinValueOutputModel, node: INodeObservable) => void
): React.ReactNode => {
  if (pin.valueType === PinValueType.Node) return;
  const isConnected = !!pin.connections?.length;

  return (
    <FormGroup key={pin.key} className="d-flex flex-row mb-0 mt-2">
      <RS.Input
        type="text"
        bsSize="sm"
        placeholder="Alias name"
        value={pin.name}
        onChange={(e) => {
          pin.name = e.target.value;
          node.model.notify();
        }}
      />
      <RS.Input
        className="mx-1"
        type="select"
        bsSize="sm"
        disabled={isConnected}
        value={pin.valueType}
        onChange={(e) => {
          pin.valueType = +e.target.value;
          node.model.notify();
        }}
      >
        <option value={PinValueType.Bool}>Bool</option>
        <option value={PinValueType.Number}>Number</option>
        <option value={PinValueType.String}>String</option>
      </RS.Input>
      <Button
        className="text-danger"
        color="link"
        size="sm"
        onClick={() => onDelete && onDelete(pin, node)}
      >
        <Icon iconName="Delete" />
      </Button>
    </FormGroup>
  );
};

export default function NodeSettings({
  node,
  onNodeDelete,
  onAliasAdd,
  onAliasDelete,
}: INodeSettingsProps): JSX.Element {
  return (
    <Observer node={node.model}>
      {(observer: { node: IFlowNodeOutputModel }) => (
        <div>
          <dt>Selected Node</dt>
          <div>
            <FormGroup>
              <Label>Name</Label>
              <RS.Input
                type="text"
                disabled={isTemplateNode(observer.node)}
                value={observer.node.name}
                onChange={(e) => {
                  node.model.value.name = e.target.value;
                  node.model.notify();
                }}
              />
            </FormGroup>
            {(!isTemplateNode(observer.node) && (
              <div>
                {hasDataPins(observer.node, PinDirection.Input) && (
                  <FormGroup key="inputPins">
                    <dt>Input Data</dt>
                    {observer.node.inputPins.map((pin) => {
                      return getInputByType(pin, node, (newValue) => {
                        pin.value = newValue;
                        node.model.notify();
                      });
                    })}
                  </FormGroup>
                )}
                {hasDataPins(observer.node, PinDirection.Output) && (
                  <FormGroup key="outputPins">
                    <dt>Output Data</dt>
                    {observer.node.outputPins.map((pin) => {
                      return getInputByType(pin, node, (newValue) => {
                        pin.value = newValue;
                        node.model.notify();
                      });
                    })}
                  </FormGroup>
                )}
                <FormGroup>
                  <Button
                    className="text-danger"
                    color="link"
                    size="sm"
                    outline
                    type="button"
                    onClick={() => onNodeDelete && onNodeDelete(node)}
                  >
                    Delete
                  </Button>
                </FormGroup>
              </div>
            )) || (
              <div>
                {observer.node.commandType === NodeCommandType.Flow ? (
                  <p className="small">Subflow is read-only.</p>
                ) : (
                  <>
                    {(observer.node.command === FLOW_IN_COMMAND && (
                      <FormGroup key="inputPins">
                        <dt>Input Aliases</dt>
                        {observer.node.outputPins.map((pin) =>
                          renderAliasInput(pin, node, onAliasDelete)
                        )}
                      </FormGroup>
                    )) ||
                      (observer.node.command === FLOW_OUT_COMMAND && (
                        <FormGroup key="inputPins">
                          <dt>Output Aliases</dt>
                          {observer.node.inputPins.map((pin) =>
                            renderAliasInput(pin, node, onAliasDelete)
                          )}
                        </FormGroup>
                      ))}
                    <FormGroup>
                      <Button
                        className="text-primary"
                        color="link"
                        size="sm"
                        outline
                        type="button"
                        onClick={() =>
                          onAliasAdd &&
                          onAliasAdd(
                            node,
                            observer.node.command === FLOW_IN_COMMAND
                              ? PinDirection.Output
                              : PinDirection.Input
                          )
                        }
                      >
                        Add New
                      </Button>
                    </FormGroup>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </Observer>
  );
}
