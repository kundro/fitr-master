import React from "react";
import { FlowMenu } from "./components/Flow/FlowMenu";
import Draggable from "react-draggable";
import NodeList from "./components/Flow/FlowPanel/NodeList";
import ConnectorList from "./components/Flow/FlowPanel/ConnectorList";
import "./flows.scss";
import SearchList from "./components/Flow/FlowPanel/SearchList";
import {
  ObservableValue,
  Observer,
  useObservable,
} from "../../utils/observable";
import {
  IFlowNodeOutputModel,
  IPinValueOutputModel,
  IFlowOutputModel,
  IConnectorOutputModel,
} from "../models/output/flowOutput";
import {
  FLOW_INPUT_NODE_ID,
  FLOW_OUTPUT_NODE_ID,
  IPosition,
} from "../models/common";
import api from "../api";
import newGuid from "../../utils/guid";
import { PinDirection } from "../models/enums";

interface IFlowParams {
  id: number;
}

export interface IFlowSelection {
  flow?: number;
  searchBox?: boolean;
  node?: INodeObservable;
  connector?: IConnectorObservable;
}

export interface IFlowObservable {
  id: number;
  name: ObservableValue<string>;
  isActive: ObservableValue<boolean>;
  nodes: ObservableValue<INodeObservable[]>;
  connectors: ObservableValue<ObservableValue<IConnectorObservable>[]>;
  position: IPosition;
}

export interface IConnectorObservable {
  key: string;
  startPin: IPinObservable;
  endPin: IPinObservable;
}

export interface INodeObservable {
  model: ObservableValue<IFlowNodeOutputModel>;
  connectors: ObservableValue<IConnectorObservable>[];
}

export interface IPinObservable {
  model: IPinValueOutputModel;
  node: INodeObservable;
}

export default function Flow({ id }: IFlowParams) {
  const flowPanelRef = React.createRef<HTMLDivElement>();
  const draggableWrapperRef = React.createRef<HTMLDivElement>();

  const selection = useObservable<IFlowSelection>({ flow: id });

  const flow: IFlowObservable = {
    id: id,
    name: new ObservableValue(""),
    isActive: new ObservableValue(true),
    nodes: new ObservableValue<INodeObservable[]>([]),
    connectors: new ObservableValue<ObservableValue<IConnectorObservable>[]>(
      []
    ),
    position: { x: 0, y: 0 },
  };

  const updateKeys = (nodes: IFlowNodeOutputModel[]) => {
    nodes.forEach((node) => {
      node.key = newGuid();
      node.inputPins.forEach((x) => (x.key = newGuid()));
      node.outputPins.forEach((x) => (x.key = newGuid()));
    });
  };

  const onDrag = (data: IPosition) => {
    const tileX = data.x % 128;
    const tileY = data.y % 128;

    flow.position.x = Math.round(data.x);
    flow.position.y = Math.round(data.y);

    if (draggableWrapperRef.current?.style)
      draggableWrapperRef.current.style.transform = `translate(${-data.x}px,${-data.y}px)`;

    if (flowPanelRef.current?.style)
      flowPanelRef.current.style.backgroundPosition = `${tileX}px ${tileY}px`;
  };

  const onAddNode = (id: number) => {
    api.flowNode.get(id, {
      success: (response) => {
        const flowPanelSize = {
          width: flowPanelRef.current?.clientWidth || 0,
          height: flowPanelRef.current?.clientHeight || 0,
        };

        updateKeys([response]);

        response.x = response.x || flowPanelSize.width / 2 - flow.position.x;
        response.y = response.y || flowPanelSize.height / 2 - flow.position.y;

        const node = { model: new ObservableValue(response), connectors: [] };

        flow.nodes.value = [...flow.nodes.value, node];

        selection.value = { node: node };
      },
    });
  };

  const onAddFlow = (id: number) => {
    api.flow.get(id, {
      success: (response) => {
        updateKeys(response.nodes);

        const connectors: ObservableValue<IConnectorObservable>[] = [];

        updateAddedFlowObservable(response);

        response.connectors.forEach((connector) => {
          const startNode = flow.nodes.value.find((x) =>
            x.model.value.outputPins.some(
              (p) => p.id === connector.startPinValueId
            )
          );

          const startPin = startNode?.model.value.outputPins.find(
            (x) => x.id === connector.startPinValueId
          );

          const endNode = flow.nodes.value.find((x) =>
            x.model.value.inputPins.some(
              (p) => p.id === connector.endPinValueId
            )
          );

          const endPin = endNode?.model.value.inputPins.find(
            (x) => x.id === connector.endPinValueId
          );

          if (startPin && startNode && endPin && endNode) {
            const connector = new ObservableValue<IConnectorObservable>({
              key: newGuid(),
              startPin: { model: startPin, node: startNode },
              endPin: { model: endPin, node: endNode },
            });

            startPin.connections = startPin.connections
              ? [...startPin.connections, connector.value.key]
              : [connector.value.key];
            startNode.connectors.push(connector);

            endPin.connections = endPin.connections
              ? [...endPin.connections, connector.value.key]
              : [connector.value.key];
            endNode.connectors.push(connector);

            connectors.push(connector);
          }
        });

        connectors.forEach(connector => {
          flow.connectors.value = [...flow.connectors.value, connector];
        })

        flow.nodes.value = [...flow.nodes.value];
      },
    });
  };

  const onNodeSelect = (node: INodeObservable) => {
    selection.value = { node: node };
  };

  const onConnectorSelect = (connector: IConnectorObservable) => {
    selection.value = { connector: connector };
  };

  const onPinsConnect = (startPin: IPinObservable, endPin: IPinObservable) => {
    const connector = new ObservableValue<IConnectorObservable>({
      key: newGuid(),
      startPin: startPin,
      endPin: endPin,
    });

    startPin.model.connections = startPin.model.connections
      ? [...startPin.model.connections, connector.value.key]
      : [connector.value.key];
    startPin.node.connectors.push(connector);

    endPin.model.connections = endPin.model.connections
      ? [...endPin.model.connections, connector.value.key]
      : [connector.value.key];
    endPin.node.connectors.push(connector);

    flow.connectors.value = [...flow.connectors.value, connector];

    //TODO: Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method.

    startPin.node.model.notify();
    endPin.node.model.notify();
  };

  const updateFlowObservable = (model: IFlowOutputModel) => {
    flow.id = model.id;
    flow.name.value = model.name;
    flow.nodes.value = model.nodes.map<INodeObservable>((x) => ({
      model: new ObservableValue(x),
      connectors: [],
    }));
    onDrag({ x: model.x, y: model.y });

    selection.value = { flow: flow.id };
  };

  const updateAddedFlowObservable = (model: IFlowOutputModel) => {
    const addedNodes = model.nodes.map<INodeObservable>((x) => ({
      model: new ObservableValue(x),
      connectors: [],
    }));
    onDrag({ x: model.x, y: model.y });

    addedNodes.forEach(node => {
      if(node.model.value.nodeId !== 1 && node.model.value.nodeId !== 2){
        flow.nodes.value = [...flow.nodes.value, node];
      } 
    })

    selection.value = { flow: flow.id };
  };

  const loadFlow = () => {
    if (id === 0) {
      api.flow.getTemplate(id, {
        success: (response) => {
          const { width, height } = document
            .getElementById("flow-panel")!
            .getBoundingClientRect();

          const x1 = Math.round(width * 0.2);
          const x2 = Math.round(width * 0.7);
          const y = Math.round(height * 0.5);

          response.nodes[0].x = x1;
          response.nodes[0].y = y;
          response.nodes[1].x = x2;
          response.nodes[1].y = y;

          updateKeys(response.nodes);
          updateFlowObservable(response);
        },
      });
    } else {
      api.flow.get(id, {
        success: (response) => {
          updateKeys(response.nodes);

          const connectors: ObservableValue<IConnectorObservable>[] = [];

          response.aliases.forEach((x) => (x.id = -x.id));
          response.connectors.push(
            ...response.aliases.flatMap((x) =>
              x.pinValueIds.map<IConnectorOutputModel>((pinValueId) => {
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
              .map<IPinValueOutputModel>((x) => ({
                key: newGuid(),
                id: x.id,
                nodeId: inputNode.nodeId,
                flowNodeId: inputNode.id,
                name: x.name,
                isPublic: true,
                pinId: 0,
                value: "",
                valueType: x.valueType,
                direction: PinDirection.Output,
              }));
          }

          const outputNode = response.nodes.find(
            (x) => x.nodeId === FLOW_OUTPUT_NODE_ID
          );

          if (outputNode) {
            outputNode.inputPins = response.aliases
              .filter((x) => x.direction === PinDirection.Output)
              .map<IPinValueOutputModel>((x) => ({
                key: newGuid(),
                id: x.id,
                nodeId: outputNode.nodeId,
                flowNodeId: outputNode.id,
                name: x.name,
                isPublic: true,
                pinId: 0,
                value: "",
                valueType: x.valueType,
                direction: PinDirection.Input,
              }));
          }

          updateFlowObservable(response);

          response.connectors.forEach((connector) => {
            const startNode = flow.nodes.value.find((x) =>
              x.model.value.outputPins.some(
                (p) => p.id === connector.startPinValueId
              )
            );

            const startPin = startNode?.model.value.outputPins.find(
              (x) => x.id === connector.startPinValueId
            );

            const endNode = flow.nodes.value.find((x) =>
              x.model.value.inputPins.some(
                (p) => p.id === connector.endPinValueId
              )
            );

            const endPin = endNode?.model.value.inputPins.find(
              (x) => x.id === connector.endPinValueId
            );

            if (startPin && startNode && endPin && endNode) {
              const connector = new ObservableValue<IConnectorObservable>({
                key: newGuid(),
                startPin: { model: startPin, node: startNode },
                endPin: { model: endPin, node: endNode },
              });

              startPin.connections = startPin.connections
                ? [...startPin.connections, connector.value.key]
                : [connector.value.key];
              startNode.connectors.push(connector);

              endPin.connections = endPin.connections
                ? [...endPin.connections, connector.value.key]
                : [connector.value.key];
              endNode.connectors.push(connector);

              connectors.push(connector);
            }
          });

          flow.connectors.value = connectors;
          flow.nodes.value = [...flow.nodes.value];
        },
      });
    }
  };

  loadFlow();

  return (
    <>
      <div>
        <Observer selection={selection}>
          {(observer: { selection: IFlowSelection }) => {
            return (
              <div className="d-flex constructor-root">
                <div
                  id="flow-panel"
                  ref={flowPanelRef}
                  className="w-100 flow-panel overflow-hidden"
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <Draggable
                    defaultClassName="w-100 h-100"
                    handle=".draggable-wrapper"
                    cancel=".node, .search-panel"
                    position={flow.position}
                    onDrag={(_e, data) => onDrag(data)}
                    onMouseDown={() => (selection.value = { flow: id })}
                  >
                    <div>
                      <div
                        ref={draggableWrapperRef}
                        className="draggable-wrapper w-100 h-100 position-absolute"
                      ></div>
                      <ConnectorList
                        connectors={flow.connectors}
                        flowPosition={flow.position}
                        selectedConnector={selection.value.connector}
                        onConnectorSelect={onConnectorSelect}
                      />
                      <NodeList
                        nodes={flow.nodes}
                        selectedNode={selection.value.node}
                        onNodeSelect={onNodeSelect}
                        onPinsConnect={onPinsConnect}
                      />
                    </div>
                  </Draggable>
                  <SearchList
                    isExpanded={observer.selection.searchBox}
                    onMouseDown={() => (selection.value = { searchBox: true })}
                    onAddNode={onAddNode}
                    onAddFlow={onAddFlow}
                  />
                </div>

                <FlowMenu flow={flow} selection={selection} />
              </div>
            );
          }}
        </Observer>
      </div>
    </>
  );
}
