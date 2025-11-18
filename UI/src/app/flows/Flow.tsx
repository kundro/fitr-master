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
import { PinDirection, NodeCommandType } from "../models/enums";

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
  flowGroups: ObservableValue<IFlowGroupObservable[]>;
  position: IPosition;
}

export interface IFlowGroupObservable {
  id: string;
  flowId: number;
  flowName: string;
  isCollapsed: ObservableValue<boolean>;
  nodes: INodeObservable[];
  internalConnectors: ObservableValue<IConnectorObservable>[];
  externalConnectors: ObservableValue<IConnectorObservable>[];
  collapsedNode?: INodeObservable;
  position: { x: number; y: number };
  color?: string;
}

export interface IConnectorObservable {
  key: string;
  startPin: IPinObservable;
  endPin: IPinObservable;
}

export interface INodeObservable {
  model: ObservableValue<IFlowNodeOutputModel>;
  connectors: ObservableValue<IConnectorObservable>[];
  flowGroupId?: string;
  groupColor?: string;
  isFlowProxy?: boolean;
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
    flowGroups: new ObservableValue<IFlowGroupObservable[]>([]),
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

        // Create and add the flow group
        updateAddedFlowObservable(response);

        // Handle connectors for the added flow
        const connectors: ObservableValue<IConnectorObservable>[] = [];

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
            const connectorObservable =
              new ObservableValue<IConnectorObservable>({
                key: newGuid(),
                startPin: { model: startPin, node: startNode },
                endPin: { model: endPin, node: endNode },
              });

            startPin.connections = startPin.connections
              ? [...startPin.connections, connectorObservable.value.key]
              : [connectorObservable.value.key];
            startNode.connectors.push(connectorObservable);

            endPin.connections = endPin.connections
              ? [...endPin.connections, connectorObservable.value.key]
              : [connectorObservable.value.key];
            endNode.connectors.push(connectorObservable);

            connectors.push(connectorObservable);
          }
        });

        // Add connectors to the flow
        flow.connectors.value = [...flow.connectors.value, ...connectors];
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

    // Load flow groups if they exist
    loadFlowGroups(model);

    selection.value = { flow: flow.id };
  };

  const updateAddedFlowObservable = (model: IFlowOutputModel) => {
    // Create a flow group for the added flow
    const flowGroup = createFlowGroup(model);

    // Add the flow group to the list
    flow.flowGroups.value = [...flow.flowGroups.value, flowGroup];

    // Add all nodes from the group (starts in expanded state)
    flow.nodes.value = [...flow.nodes.value, ...flowGroup.nodes];

    // Add all internal connectors from the group
    flow.connectors.value = [
      ...flow.connectors.value,
      ...flowGroup.internalConnectors,
    ];

    // Auto-save the flow with new subflow relationship
    saveFlowGroups();

    selection.value = { flow: flow.id };
  };

  // Generate different colors for flow groups
  const getGroupColor = (groupIndex: number): string => {
    const colors = [
      "#8e44ad",
      "#3498db",
      "#e74c3c",
      "#f39c12",
      "#27ae60",
      "#9b59b6",
      "#34495e",
      "#e67e22",
    ];
    return colors[groupIndex % colors.length];
  };

  const createFlowGroup = (
    addedFlow: IFlowOutputModel
  ): IFlowGroupObservable => {
    const groupId = newGuid();
    const groupIndex = flow.flowGroups.value.length;

    const addedNodes = addedFlow.nodes
      .filter((node) => node.nodeId !== 1 && node.nodeId !== 2) // Exclude input/output nodes
      .map<INodeObservable>((x) => ({
        model: new ObservableValue(x),
        connectors: [],
        flowGroupId: groupId,
      }));

    // Create internal connectors (connections between nodes within the group)
    const internalConnectors: ObservableValue<IConnectorObservable>[] = [];

    addedFlow.connectors.forEach((connectorData) => {
      // Check if both start and end pins belong to nodes in this group
      const startNodeId = addedFlow.nodes.find(
        (n) =>
          n.inputPins.some((p) => p.id === connectorData.startPinValueId) ||
          n.outputPins.some((p) => p.id === connectorData.startPinValueId)
      )?.nodeId;
      const endNodeId = addedFlow.nodes.find(
        (n) =>
          n.inputPins.some((p) => p.id === connectorData.endPinValueId) ||
          n.outputPins.some((p) => p.id === connectorData.endPinValueId)
      )?.nodeId;

      // Include connector if both nodes are in the group (not input/output nodes)
      if (
        startNodeId &&
        endNodeId &&
        startNodeId !== 1 &&
        startNodeId !== 2 &&
        endNodeId !== 1 &&
        endNodeId !== 2
      ) {
        // Find start and end pins in the added nodes
        const startPin = addedNodes
          .flatMap((node) => [
            ...node.model.value.inputPins.map((pin) => ({ pin, node })),
            ...node.model.value.outputPins.map((pin) => ({ pin, node })),
          ])
          .find((p) => p.pin.id === connectorData.startPinValueId);

        const endPin = addedNodes
          .flatMap((node) => [
            ...node.model.value.inputPins.map((pin) => ({ pin, node })),
            ...node.model.value.outputPins.map((pin) => ({ pin, node })),
          ])
          .find((p) => p.pin.id === connectorData.endPinValueId);

        if (startPin && endPin) {
          const connectorObservable = new ObservableValue<IConnectorObservable>(
            {
              key: newGuid(),
              startPin: { model: startPin.pin, node: startPin.node },
              endPin: { model: endPin.pin, node: endPin.node },
            }
          );

          // Update pin connections
          startPin.pin.connections = startPin.pin.connections
            ? [...startPin.pin.connections, connectorObservable.value.key]
            : [connectorObservable.value.key];
          startPin.node.connectors.push(connectorObservable);

          endPin.pin.connections = endPin.pin.connections
            ? [...endPin.pin.connections, connectorObservable.value.key]
            : [connectorObservable.value.key];
          endPin.node.connectors.push(connectorObservable);

          internalConnectors.push(connectorObservable);
        }
      }
    });

    // Calculate group position (center of nodes)
    const groupX =
      addedNodes.length > 0
        ? addedNodes.reduce((sum, node) => sum + node.model.value.x, 0) /
          addedNodes.length
        : 0;
    const groupY =
      addedNodes.length > 0
        ? addedNodes.reduce((sum, node) => sum + node.model.value.y, 0) /
          addedNodes.length
        : 0;

    return {
      id: groupId,
      flowId: addedFlow.id,
      flowName: addedFlow.name,
      isCollapsed: new ObservableValue(false),
      nodes: addedNodes,
      internalConnectors: internalConnectors,
      externalConnectors: [],
      position: { x: groupX, y: groupY },
      color: getGroupColor(groupIndex),
    };
  };

  const toggleFlowGroup = (groupId: string) => {
    const group = flow.flowGroups.value.find((g) => g.id === groupId);
    if (!group) return;

    if (group.isCollapsed.value) {
      // Expand: Remove proxy node, add all group nodes
      if (group.collapsedNode) {
        flow.nodes.value = flow.nodes.value.filter(
          (n) => n !== group.collapsedNode
        );
        group.collapsedNode = undefined;
      }

      // Add all group nodes back
      flow.nodes.value = [...flow.nodes.value, ...group.nodes];

      // Restore internal connectors
      flow.connectors.value = [
        ...flow.connectors.value,
        ...group.internalConnectors,
      ];

      group.isCollapsed.value = false;
    } else {
      // Collapse: Remove all group nodes, add single proxy node
      flow.nodes.value = flow.nodes.value.filter(
        (n) => !group.nodes.includes(n)
      );

      // Remove internal connectors and store them
      const internalConnectorKeys = new Set<string>();
      group.nodes.forEach((node) => {
        node.connectors.forEach((conn) => {
          const startInGroup = group.nodes.some((n) =>
            n.model.value.outputPins.some(
              (p) => p.id === conn.value.startPin.model.id
            )
          );
          const endInGroup = group.nodes.some((n) =>
            n.model.value.inputPins.some(
              (p) => p.id === conn.value.endPin.model.id
            )
          );
          if (startInGroup && endInGroup) {
            internalConnectorKeys.add(conn.value.key);
          }
        });
      });

      // Store internal connectors
      group.internalConnectors = flow.connectors.value.filter((conn) =>
        internalConnectorKeys.has(conn.value.key)
      );

      // Remove internal connectors from main flow
      flow.connectors.value = flow.connectors.value.filter(
        (conn) => !internalConnectorKeys.has(conn.value.key)
      );

      // Create proxy node
      const proxyNode: INodeObservable = {
        model: new ObservableValue({
          key: newGuid(),
          id: -group.flowId, // Negative ID to distinguish from real nodes
          nodeId: -group.flowId,
          name: group.flowName,
          x: group.position.x,
          y: group.position.y,
          isActive: true,
          commandType: NodeCommandType.Command,
          command: "SUBFLOW",
          inputPins: [], // Will be populated with external connections
          outputPins: [], // Will be populated with external connections
        }),
        connectors: [],
        flowGroupId: groupId,
        isFlowProxy: true,
      };

      group.collapsedNode = proxyNode;
      flow.nodes.value = [...flow.nodes.value, proxyNode];

      group.isCollapsed.value = true;
    }

    // Trigger UI update
    flow.nodes.value = [...flow.nodes.value];
    flow.connectors.value = [...flow.connectors.value];

    // Auto-save after toggle
    saveFlowGroups();
  };

  const saveFlowGroups = () => {
    if (flow.id === 0) return; // Don't save template flows

    const flowData = {
      id: flow.id,
      name: flow.name.value,
      isActive: flow.isActive.value,
      x: flow.position.x,
      y: flow.position.y,
      aliases: [], // Will be populated by existing save logic
      flowNodes: flow.nodes.value.map((node) => ({
        id: node.model.value.id,
        nodeId: node.model.value.nodeId,
        name: node.model.value.name,
        x: node.model.value.x,
        y: node.model.value.y,
        subFlowId: node.model.value.subFlowId,
        flowSubFlowId: node.model.value.flowSubFlowId,
        pinValues: [], // Will be populated by existing save logic
      })),
      connectors: [], // Will be populated by existing save logic
      subFlows: flow.flowGroups.value.map((group) => ({
        id: 0, // Let backend assign ID
        subFlowId: group.flowId,
        groupId: group.id,
        groupName: group.flowName,
        isCollapsed: group.isCollapsed.value,
        positionX: group.position.x,
        positionY: group.position.y,
      })),
    };

    // Use existing PUT API to save flow with subflows
    api.flow.put(flowData, {
      success: () => {
        console.log("Flow groups saved successfully");
      },
      error: (error) => {
        console.error("Failed to save flow groups:", error);
      },
    });
  };

  const loadFlowGroups = (flowData: IFlowOutputModel) => {
    if (!flowData.subFlows || flowData.subFlows.length === 0) return;

    const loadedGroups: IFlowGroupObservable[] = [];

    flowData.subFlows.forEach((subFlowData) => {
      // Find nodes that belong to this subflow group
      const groupNodes = flow.nodes.value.filter(
        (node) => node.model.value.flowSubFlowId === subFlowData.id
      );

      const flowGroup: IFlowGroupObservable = {
        id: subFlowData.groupId,
        flowId: subFlowData.subFlowId,
        flowName: subFlowData.groupName,
        isCollapsed: new ObservableValue(subFlowData.isCollapsed),
        nodes: groupNodes,
        internalConnectors: [],
        externalConnectors: [],
        position: { x: subFlowData.positionX, y: subFlowData.positionY },
      };

      // Set group ID on nodes
      groupNodes.forEach((node) => {
        node.flowGroupId = subFlowData.groupId;
      });

      // If collapsed, create proxy node
      if (subFlowData.isCollapsed) {
        const proxyNode: INodeObservable = {
          model: new ObservableValue({
            key: newGuid(),
            id: -subFlowData.subFlowId,
            nodeId: -subFlowData.subFlowId,
            name: subFlowData.groupName,
            x: subFlowData.positionX,
            y: subFlowData.positionY,
            isActive: true,
            commandType: NodeCommandType.Command,
            command: "SUBFLOW",
            inputPins: [],
            outputPins: [],
          }),
          connectors: [],
          flowGroupId: subFlowData.groupId,
          isFlowProxy: true,
        };

        flowGroup.collapsedNode = proxyNode;

        // Remove group nodes from main flow and add proxy
        flow.nodes.value = flow.nodes.value.filter(
          (n) => !groupNodes.includes(n)
        );
        flow.nodes.value = [...flow.nodes.value, proxyNode];
      }

      loadedGroups.push(flowGroup);
    });

    flow.flowGroups.value = loadedGroups;
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

                <FlowMenu
                  flow={flow}
                  selection={selection}
                  onToggleFlowGroup={toggleFlowGroup}
                />
              </div>
            );
          }}
        </Observer>
      </div>
    </>
  );
}
