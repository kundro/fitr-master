import React from "react";
import { ObservableValue, Observer } from "../../../../../utils/observable";
import { INodeObservable, IPinObservable } from "../../../Flow";
import Node from "../../Node/Node";

export interface INodeListProps {
  nodes: ObservableValue<INodeObservable[]>;
  selectedNode?: INodeObservable;
  onNodeSelect?: (node: INodeObservable) => void;
  onPinsConnect?: (startPin: IPinObservable, endPin: IPinObservable) => void;
  onOpenFlow?: (id: number) => void;
  readOnly?: boolean;
}

export default function NodeList({
  nodes,
  selectedNode,
  onNodeSelect,
  onPinsConnect,
  onOpenFlow,
  readOnly,
}: INodeListProps): JSX.Element {
  return (
    <Observer nodes={nodes}>
      {(observer: { nodes: INodeObservable[] }) => (
        <div>
          {observer.nodes.map((node) => {
            return (
              <Node
                key={node.model.value.key}
                selected={selectedNode?.model.value === node.model.value}
                observable={node}
                onMouseDown={onNodeSelect}
                onPinsConnect={onPinsConnect}
                onOpenFlow={onOpenFlow}
                readOnly={readOnly}
              />
            );
          })}
        </div>
      )}
    </Observer>
  );
}
