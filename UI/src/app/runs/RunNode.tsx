import React from "react";
import { useHistory } from "react-router";
import { Button, Card } from "reactstrap";
import { ObservableValue, Observer } from "../../utils/observable";
import api from "../api";
import { NodeCommandType } from "../models/enums";
import { IRunFlowNodeModel } from "../models/output/run";
import { processCommandNode } from "./processor";
import CommandRunner from "./Runners/CommandRunner";
import PageRunner from "./Runners/PageRunner";
import "./Runs.scss";
export interface IRunNodeProps {
  id: number;
}

export interface ISubmitCallback {
  call: () => Promise<"input" | "page" | "output">;
}

export default function RunNode({ id }: IRunNodeProps) {
  const history = useHistory();
  const submitCallback = new ObservableValue<ISubmitCallback | undefined>(
    undefined
  );

  const model = new ObservableValue<IRunFlowNodeModel | undefined>(undefined);
  let view: "input" | "page" | "output" = "input";

  api.runNode.get(id, {
    success: (response) => {
      model.value = response;
    },
  });

  const onClose = () => {
    history.push("/run");
  };

  return (
    <Observer model={model}>
      {(observer: { model?: IRunFlowNodeModel }) => {
        if (!observer.model) return <div>Loading...</div>;

        return (
          <Card className="vh-100 m-0">
            <h6 className="card-header border-0">
              Run "{observer.model.name}"
            </h6>
            {(observer.model.commandType === NodeCommandType.Command && (
              <CommandRunner model={observer.model} />
            )) ||
              (observer.model.commandType === NodeCommandType.Page && (
                <PageRunner
                  view={view}
                  model={observer.model}
                  submitCallback={submitCallback}
                />
              ))}
            <div className="card-footer d-flex justify-content-end">
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
                  switch (observer.model?.commandType) {
                    case NodeCommandType.Command:
                      observer.model && processCommandNode(observer.model);
                      model.notify();
                      break;
                    case NodeCommandType.Page:
                      view = (await submitCallback.value?.call()) ?? "input";
                      model.notify();
                      break;
                  }
                }}
              >
                Submit
              </Button>
            </div>
          </Card>
        );
      }}
    </Observer>
  );
}
