import React from "react";
import { useHistory } from "react-router";
import { Button, Card, FormGroup, Label } from "reactstrap/lib";
import { Checkbox, ObservableValue, Observer } from "../../utils/observable";
import api from "../api";
import { FLOW_INPUT_NODE_ID, FLOW_OUTPUT_NODE_ID } from "../models/common";
import { NodeCommandType, PinDirection } from "../models/enums";
import {
  IRunConnector,
  IRunFlowModel,
  IRunFlowNodeModel,
  IRunNodePinModel,
} from "../models/output/run";
import {
  canProcessNode,
  preprocessNode,
  processNode,
  processWhilePossible,
} from "./processor";
import CommandRunner from "./Runners/CommandRunner";
import PageRunner from "./Runners/PageRunner";
import { ISubmitCallback } from "./RunNode";
import "./Runs.scss";
export interface IRunFlowProps {
  id: number;
}

export default function RunFlow({ id }: IRunFlowProps) {
  const history = useHistory();

  const processIfPossible = new ObservableValue(true);
  const ignoreActivePins = new ObservableValue(true);
  const submitCallback = new ObservableValue<ISubmitCallback | undefined>(
    undefined
  );

  const model = new ObservableValue<IRunFlowModel | undefined>(undefined);
  const selectedNode = new ObservableValue<IRunFlowNodeModel | undefined>(
    undefined
  );

  const isOutputNodeSelected = () =>
    selectedNode.value?.nodeId === FLOW_OUTPUT_NODE_ID;

  api.runFlow.get(id, {
    success: (response) => {
      model.value = response;

      response.aliases.forEach((x) => (x.id = -x.id));
      response.connectors.push(
        ...response.aliases.flatMap((x) =>
          x.pinValueIds.map<IRunConnector>((pinValueId) => {
            const [startId, endId] =
              x.direction === PinDirection.Input
                ? [x.id, pinValueId]
                : [pinValueId, x.id];
            return {
              id: 0,
              startPinValueId: startId,
              endPinValueId: endId,
            };
          })
        )
      );

      const inputNode = response.nodes.find(
        (x) => x.nodeId === FLOW_INPUT_NODE_ID
      );

      if (inputNode) {
        inputNode.outputPins = response.aliases
          .filter((x) => x.direction === PinDirection.Input)
          .map<IRunNodePinModel>((x) => ({
            id: x.id,
            nodeId: inputNode.nodeId,
            flowNodeId: inputNode.id,
            name: x.name,
            isPublic: true,
            pinId: 0,
            value: "",
            valueType: x.valueType,
            direction: x.direction,
          }));
      }

      const outputNode = response.nodes.find(
        (x) => x.nodeId === FLOW_OUTPUT_NODE_ID
      );

      if (outputNode) {
        outputNode.inputPins = response.aliases
          .filter((x) => x.direction === PinDirection.Output)
          .map<IRunNodePinModel>((x) => ({
            id: x.id,
            nodeId: outputNode.nodeId,
            flowNodeId: outputNode.id,
            name: x.name,
            isPublic: true,
            pinId: 0,
            value: "",
            valueType: x.valueType,
            direction: x.direction,
          }));
      }

      const inputPins = response.nodes.flatMap((node) => {
        node.inputPins.forEach((x) => (x.node = node));
        return node.inputPins;
      });

      const outputPins = response.nodes.flatMap((node) => {
        node.outputPins.forEach((x) => (x.node = node));
        return node.outputPins;
      });

      response.connectors.forEach((connector) => {
        const startPin = outputPins.find(
          (x) => x.id === connector.startPinValueId
        );
        const endPin = inputPins.find((x) => x.id === connector.endPinValueId);

        if (startPin && endPin) {
          endPin.parentPin = startPin;
        }
      });

      selectedNode.value = inputNode;
    },
  });

  const onClose = () => {
    history.push("/run");
  };

  return (
    <Observer
      model={model}
      selectedNode={selectedNode}
      processIfPossible={processIfPossible}
    >
      {(observer: {
        model?: IRunFlowModel;
        selectedNode?: IRunFlowNodeModel;
        processIfPossible: boolean;
      }) => {
        if (!observer.model) return <div>Loading...</div>;

        return (
          <Card className="vh-100 m-0">
            <h6 className="card-header border-0">
              {observer.model && `Flow: ${observer.model.name}`}

              {observer.selectedNode && (
                <small>
                  <br />
                  Node: {observer.selectedNode.name}
                </small>
              )}
            </h6>
            {(observer.selectedNode?.commandType ===
              NodeCommandType.Command && (
              <CommandRunner model={observer.selectedNode} />
            )) ||
              (observer.selectedNode?.commandType === NodeCommandType.Page && (
                <PageRunner
                  view={"page"}
                  model={observer.selectedNode}
                  submitCallback={submitCallback}
                />
              ))}
            <div className="card-footer d-flex justify-content-between">
              <div className="d-flex flex-row">
                <FormGroup check>
                  <Label>
                    <Checkbox
                      observable={processIfPossible}
                      onChange={(e) => {
                        processIfPossible.value = e.target.checked;
                        if (!processIfPossible.value)
                          ignoreActivePins.value = false;
                      }}
                    />
                    Process while possible
                  </Label>
                </FormGroup>
                <FormGroup
                  check
                  className="ml-2"
                  hidden={!observer.processIfPossible}
                >
                  <Label>
                    <Checkbox
                      observable={ignoreActivePins}
                      onChange={(e) =>
                        (ignoreActivePins.value = e.target.checked)
                      }
                    />
                    Ignore active parameters
                  </Label>
                </FormGroup>
              </div>
              <div>
                <Button
                  color="primary"
                  size="sm"
                  outline
                  type="button"
                  onClick={onClose}
                >
                  Close
                </Button>
                <Button
                  color="success"
                  size="sm"
                  type="button"
                  onClick={async () => {
                    if (!selectedNode.value || isOutputNodeSelected()) {
                      onClose();
                      return;
                    }

                    let nextNode: IRunFlowNodeModel | undefined;

                    switch (selectedNode.value.commandType) {
                      case NodeCommandType.Command:
                        if (processIfPossible.value) {
                          nextNode = processWhilePossible(
                            selectedNode.value,
                            model.value?.nodes ?? [],
                            ignoreActivePins.value
                          );
                        } else {
                          processNode(selectedNode.value);
                          nextNode = model.value?.nodes.find((x) =>
                            canProcessNode(x)
                          );
                        }
                        break;
                      case NodeCommandType.Page:
                        await submitCallback.value?.call();
                        nextNode = model.value?.nodes.find((x) =>
                          canProcessNode(x)
                        );

                        if (
                          nextNode?.commandType === NodeCommandType.Command &&
                          processIfPossible.value
                        ) {
                          nextNode = processWhilePossible(
                            selectedNode.value,
                            model.value?.nodes ?? [],
                            ignoreActivePins.value
                          );
                        }
                        break;
                    }

                    if (nextNode) preprocessNode(nextNode);

                    selectedNode.value = nextNode;
                  }}
                >
                  {isOutputNodeSelected() ? "Close" : "Submit"}
                </Button>
              </div>
            </div>
          </Card>
        );
      }}
    </Observer>
  );
}
