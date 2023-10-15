import React from "react";
import { useHistory } from "react-router";
import { Button } from "reactstrap";
import { ObservableValue } from "../../../../utils/observable";
import {
  IConnectorObservable,
  IFlowObservable,
  IFlowSelection,
  INodeObservable,
  IPinObservable,
} from "../../Flow";
import { History } from "history";
import api from "../../../api";
import FlowSettings from "./FlowMenu/FlowSettings";
import NodeSettings from "./FlowMenu/NodeSettings";
import ConnectorSettings from "./FlowMenu/ConnectorSettings";
import { IPinValueOutputModel } from "../../../models/output/flowOutput";
import {
  NodeCommandType,
  PinDirection,
  PinValueType,
} from "../../../models/enums";
import newGuid from "../../../../utils/guid";
import {
  IAliasInputModel,
  IConnectorInputModel,
  IFlowInputModel,
  IFlowNodeInputModel,
  IPinValueInputModel,
} from "../../../models/input/flowInput";
import {
  FLOW_INPUT_NODE_ID,
  FLOW_IN_COMMAND,
  FLOW_OUTPUT_NODE_ID,
  FLOW_OUT_COMMAND,
} from "../../../models/common";

export interface IFlowMenuProps {
  flow: IFlowObservable;
  selection: ObservableValue<IFlowSelection>;
}

let oldVersionsIds: number[];
oldVersionsIds = [];

const renderHeader = (flowId: number) => {
  const isNew = flowId === 0;

  return (
    <h6 className="card-header">{isNew ? "Create Flow" : "Update Flow"}</h6>
  );
};

const renderFooter = (flow: IFlowObservable, history: History<unknown>) => {
  const isNew = flow.id === 0;

  const onFlowDelete = () => {
    api.flow.delete(flow.id, {
      success: onClose,
    });
  };

  const onSave = (saveAsNew = false, update = false) => {
    const res = mapFlowToInput(flow);

    const oldId = res.id;

    if (isNew || saveAsNew || update) {
      res.id = 0;
      res.aliases.forEach((x) => (x.id = 0));
      res.flowNodes.forEach((x) => {
        x.id = 0;
        x.pinValues.forEach((p) => (p.id = 0));
      });

      api.flow.post(res, {
        success: (id) => {
          if (update) {
            oldVersionsIds.push(oldId);
          }

          history.push(`/flows/${id}`);
        },
      });
    } else {
      api.flow.put(res, {});
    }
  };

  const onClose = () => {
    if (oldVersionsIds) {
      oldVersionsIds.forEach((x) => api.flow.delete(x, { success: () => {} }));
    }

    history.push("/flows");
  };

  return (
    <div className="card-footer d-flex justify-content-between">
      <div>
        {!isNew && (
          <Button
            className="text-danger"
            color="link"
            size="sm"
            outline
            type="button"
            onClick={onFlowDelete}
          >
            Delete
          </Button>
        )}
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
          color="primary"
          size="sm"
          type="button"
          onClick={isNew ? () => onSave() : () => onSave(false, true)}
        >
          {isNew ? "Save" : "Update"}
        </Button>
        {!isNew && (
          <Button
            color="success"
            size="sm"
            type="button"
            onClick={() => onSave(true)}
          >
            Save as new
          </Button>
        )}
      </div>
    </div>
  );
};

const mapFlowToInput = (flow: IFlowObservable): IFlowInputModel => {
  const mapAliases = () => {
    const aliases: IAliasInputModel[] = [];

    const inputNode = flow.nodes.value.find(
      (x) =>
        x.model.value.commandType === NodeCommandType.Command &&
        x.model.value.command === FLOW_IN_COMMAND
    );

    if (inputNode) {
      aliases.push(
        ...inputNode.model.value.outputPins.map<IAliasInputModel>((x) => ({
          id: x.id,
          name: x.name,
          valueType: x.valueType,
          direction: PinDirection.Input,
          pinValueKeys: inputNode.connectors
            .filter((connector) => connector.value.startPin.model === x)
            .map((connector) => connector.value.endPin.model.key),
        }))
      );
    }

    const outputNode = flow.nodes.value.find(
      (x) =>
        x.model.value.commandType === NodeCommandType.Command &&
        x.model.value.command === FLOW_OUT_COMMAND
    );

    if (outputNode) {
      aliases.push(
        ...outputNode.model.value.inputPins.map<IAliasInputModel>((x) => ({
          id: x.id,
          name: x.name,
          valueType: x.valueType,
          direction: PinDirection.Output,
          pinValueKeys: outputNode.connectors
            .filter((connector) => connector.value.endPin.model === x)
            .map((connector) => connector.value.startPin.model.key),
        }))
      );
    }

    return aliases;
  };

  const mapConnectors = () => {
    return flow.connectors.value.map<IConnectorInputModel>((x) => ({
      startPinValueKey: x.value.startPin.model.key,
      endPinValueKey: x.value.endPin.model.key,
    }));
  };

  const mapFlowNodes = (
    aliases: IAliasInputModel[],
    connectors: IConnectorInputModel[]
  ) => {
    const nodes = flow.nodes.value.map<IFlowNodeInputModel>((x) => {
      const node = x.model.value;

      const pinValues = [...node.inputPins, ...node.outputPins]
        .map<IPinValueInputModel>((pin) => ({
          id: pin.id,
          pinId: pin.pinId,
          key: pin.key,
          value: pin.value,
        }))
        .filter(
          (x) =>
            !!x.value ||
            aliases.some((a) => a.pinValueKeys.includes(x.key)) ||
            connectors.some((c) =>
              [c.startPinValueKey, c.endPinValueKey].includes(x.key)
            )
        );

      return {
        id: node.id,
        nodeId: node.nodeId,
        name: node.name,
        x: Math.round(node.x),
        y: Math.round(node.y),
        pinValues: pinValues,
      };
    });

    nodes
      .filter((x) =>
        [FLOW_INPUT_NODE_ID, FLOW_OUTPUT_NODE_ID].includes(x.nodeId)
      )
      .forEach((x) => (x.pinValues = []));

    return nodes;
  };

  const aliases = mapAliases();
  const connectors = mapConnectors();
  const flowNodes = mapFlowNodes(aliases, connectors);

  return {
    id: flow.id,
    name: flow.name.value,
    isActive: flow.isActive.value,
    aliases: aliases,
    connectors: connectors,
    flowNodes: flowNodes,
    x: Math.round(flow.position.x),
    y: Math.round(flow.position.y),
  };
};

export function FlowMenu({ flow, selection }: IFlowMenuProps): JSX.Element {
  const history = useHistory();

  const onNodeDelete = (node: INodeObservable) => {
    deleteConnectors(...node.connectors.map((x) => x.value));
    flow.nodes.value = flow.nodes.value.filter(
      (x) => x.model.value !== node.model.value
    );
    selection.value = {};
  };

  const onAliasAdd = (node: INodeObservable, direction: PinDirection) => {
    const pin: IPinValueOutputModel = {
      key: newGuid(),
      id: 0,
      flowNodeId: 0,
      direction: direction,
      isPublic: true,
      name: "NewAlias",
      valueType: PinValueType.String,
      nodeId: node.model.value.nodeId,
      pinId: 0,
      value: "",
    };
    if (direction === PinDirection.Input) {
      node.model.value.inputPins = [...node.model.value.inputPins, pin];
    } else if (direction === PinDirection.Output) {
      node.model.value.outputPins = [...node.model.value.outputPins, pin];
    }
    node.model.notify();
  };

  const onAliasDelete = (pin: IPinValueOutputModel, node: INodeObservable) => {
    const deleteItems = node.connectors
      .filter(
        (x) => x.value.startPin.model === pin || x.value.endPin.model === pin
      )
      .map((x) => x.value);

    let nodes = deleteItems
      .flatMap((x) => [x.startPin.node, x.endPin.node])
      .filter(function (x, i, a) {
        return a.indexOf(x) === i;
      });

    if (pin.direction === PinDirection.Input) {
      node.model.value.inputPins = node.model.value.inputPins.filter(
        (x) => x !== pin
      );
    } else if (pin.direction === PinDirection.Output) {
      node.model.value.outputPins = node.model.value.outputPins.filter(
        (x) => x !== pin
      );
    }

    deleteConnectors(...deleteItems);
    nodes.forEach((x) => x.model.notify());
    node.model.notify();
  };

  const deleteConnectors = (...connectors: IConnectorObservable[]) => {
    const deleteRefs = (
      connector: IConnectorObservable,
      pin: IPinObservable
    ) => {
      if (pin.model.connections) {
        pin.model.connections = pin.model.connections.filter(
          (x) => x !== connector.key
        );
      }

      pin.node.connectors = pin.node.connectors.filter(
        (x) => x.value !== connector
      );
    };

    connectors.forEach((connector) => {
      deleteRefs(connector, connector.startPin);
      deleteRefs(connector, connector.endPin);
    });

    flow.connectors.value = flow.connectors.value.filter(
      (x) => !connectors.includes(x.value)
    );
  };

  const onConnectorDelete = (connector: IConnectorObservable) => {
    deleteConnectors(connector);
    selection.value = {};
  };

  const cardBodyStyle = {
    overflow: "auto",
  };

  return (
    <div className="card properties-menu">
      <div className="vh-100 d-flex flex-column justify-content-between">
        {renderHeader(flow.id)}
        <div className="card-body" style={cardBodyStyle}>
          {selection.value.flow !== undefined && (
            <FlowSettings name={flow.name} isActive={flow.isActive} />
          )}
          {!!selection.value.node && (
            <NodeSettings
              node={selection.value.node}
              onNodeDelete={onNodeDelete}
              onAliasAdd={onAliasAdd}
              onAliasDelete={onAliasDelete}
            />
          )}
          {!!selection.value.connector && (
            <ConnectorSettings
              connector={selection.value.connector}
              onConnectorDelete={onConnectorDelete}
            />
          )}
        </div>
        {renderFooter(flow, history)}
      </div>
    </div>
  );
}
