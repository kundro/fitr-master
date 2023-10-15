import React from "react";
import { FormGroup, Input, Label } from "reactstrap";
import newGuid from "../../../utils/guid";
import { ObservableValue, Observer } from "../../../utils/observable";
import { FLOW_INPUT_NODE_ID, FLOW_OUTPUT_NODE_ID } from "../../models/common";
import { PinValueType } from "../../models/enums";
import { IRunFlowNodeModel, IRunNodePinModel } from "../../models/output/run";

export interface ICommandRunnerProps {
  model: IRunFlowNodeModel;
}

export const getInputByType = (
  pin: ObservableValue<IRunNodePinModel>,
  disabled?: boolean
): React.ReactNode | undefined => {
  const inputGuid = newGuid();

  if (
    ![PinValueType.Bool, PinValueType.Number, PinValueType.String].includes(
      pin.value.valueType
    )
  ) {
    return;
  }

  return (
    <FormGroup
      check={pin.value.valueType === PinValueType.Bool}
      key={newGuid()}
      className="w-50"
    >
      <Observer pin={pin}>
        {(observer: { pin: IRunNodePinModel }) =>
          (observer.pin.valueType === PinValueType.Bool && (
            <Label>
              <Input
                type="checkbox"
                checked={observer.pin.value === "true"}
                onChange={(e) => {
                  pin.value.value = `${e.target.checked}`;
                  pin.notify();
                }}
                disabled={disabled}
              />
              {observer.pin.name}
            </Label>
          )) ||
          (observer.pin.valueType === PinValueType.Number && (
            <>
              <Label for={inputGuid}>{observer.pin.name}</Label>
              <Input
                type="number"
                name={inputGuid}
                value={observer.pin.value ?? ""}
                onChange={(e) => {
                  pin.value.value = e.target.value;
                  pin.notify();
                }}
                disabled={disabled}
                placeholder={"Enter number value"}
              />
            </>
          )) ||
          (observer.pin.valueType === PinValueType.String && (
            <>
              <Label for={inputGuid}>{observer.pin.name}</Label>
              <Input
                type="text"
                name={inputGuid}
                value={observer.pin.value ?? ""}
                onChange={(e: any) => {
                  pin.value.value = e.target.value;
                  pin.notify();
                }}
                disabled={disabled}
                placeholder={"Enter string value"}
              />
            </>
          ))
        }
      </Observer>
    </FormGroup>
  );
};

export default function CommandRunner({
  model,
}: ICommandRunnerProps): JSX.Element {
  const inputPins = model.inputPins.map((x) => new ObservableValue(x));
  const outputPins = model.outputPins.map((x) => new ObservableValue(x));

  const cardBodyStyle = {
    overflow: "auto",
  };

  return (
    <div className="card-body" style={cardBodyStyle}>
      <div className="d-flex flex-row w-100">
        {(model.nodeId === FLOW_INPUT_NODE_ID && (
          <>
            <dl className="w-50 d-flex flex-column">
              <dt>Input Data</dt>
              {outputPins.map((x) => getInputByType(x, !!x.value.parentPin))}
            </dl>
          </>
        )) ||
          (model.nodeId === FLOW_OUTPUT_NODE_ID && (
            <>
              <dl className="w-50 d-flex flex-column">
                <dt>Output Data</dt>
                {inputPins.map((x) => getInputByType(x, true))}
              </dl>
            </>
          )) || (
            <>
              <dl className="w-50 d-flex flex-column">
                <dt>Input Data</dt>
                {inputPins.map((x) => getInputByType(x, !!x.value.parentPin))}
              </dl>
              <dl className="w-50 d-flex flex-column">
                <dt>Output Data</dt>
                {outputPins.map((x) => getInputByType(x, true))}
              </dl>
            </>
          )}
      </div>
    </div>
  );
}
