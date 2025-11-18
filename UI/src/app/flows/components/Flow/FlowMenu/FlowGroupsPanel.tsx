import React from "react";
import { Button, Card, CardBody, CardHeader } from "reactstrap";
import { Observer } from "../../../../../utils/observable";
import { IFlowGroupObservable, IFlowObservable } from "../../../Flow";

interface IFlowGroupsPanelProps {
  flow: IFlowObservable;
  onToggleGroup: (groupId: string) => void;
}

export default function FlowGroupsPanel({ flow, onToggleGroup }: IFlowGroupsPanelProps) {
  return (
    <Observer flowGroups={flow.flowGroups}>
      {(observer: { flowGroups: IFlowGroupObservable[] }) => {
        if (!observer.flowGroups || observer.flowGroups.length === 0) {
          return null;
        }

        return (
          <Card className="mb-3">
            <CardHeader>
              <h6 className="mb-0">Flow Groups</h6>
              <small className="text-muted">
                Toggle between expanded and collapsed view
              </small>
            </CardHeader>
            <CardBody>
              {observer.flowGroups.map((group) => (
                <Observer key={group.id} isCollapsed={group.isCollapsed}>
                  {(groupObserver: { isCollapsed: boolean }) => (
                    <div className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded" style={{ borderLeftColor: group.color || '#8e44ad', borderLeftWidth: '4px' }}>
                      <div>
                        <div className="d-flex align-items-center">
                          <div 
                            className="rounded-circle me-2" 
                            style={{ 
                              width: '12px', 
                              height: '12px', 
                              backgroundColor: group.color || '#8e44ad' 
                            }}
                          ></div>
                          <strong>{group.flowName}</strong>
                        </div>
                        <small className="text-muted">
                          {group.nodes.length} nodes • {groupObserver.isCollapsed ? 'Collapsed' : 'Expanded'}
                        </small>
                      </div>
                      <Button
                        size="sm"
                        color={groupObserver.isCollapsed ? "success" : "primary"}
                        outline
                        onClick={() => onToggleGroup(group.id)}
                        title={groupObserver.isCollapsed ? "Expand flow group" : "Collapse flow group"}
                      >
                        {groupObserver.isCollapsed ? (
                          <>📦 Expand</>
                        ) : (
                          <>🔗 Collapse</>
                        )}
                      </Button>
                    </div>
                  )}
                </Observer>
              ))}
              <small className="text-muted">
                💡 <strong>Tip:</strong> Collapsed flows show as single nodes that you can connect to other elements.
                Expanded flows show all internal nodes for detailed editing.
              </small>
            </CardBody>
          </Card>
        );
      }}
    </Observer>
  );
}