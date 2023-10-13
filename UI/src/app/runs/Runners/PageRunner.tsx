import React, { useEffect } from "react";
import { ObservableValue, useObservable } from "../../../utils/observable";
import { PinValueType } from "../../models/enums";
import { IRunFlowNodeModel } from "../../models/output/run";
import {
  getObjectFromValues,
  ICommandParameter,
  processNode,
} from "../processor";
import { ISubmitCallback } from "../RunNode";
import { getInputByType } from "./CommandRunner";

export interface ICommandRunnerProps {
  model: IRunFlowNodeModel;
  submitCallback: ObservableValue<ISubmitCallback | undefined>;
  view: "input" | "page" | "output";
}

const send = (data: any) => {
  var iframe: any = document.getElementById("page-runner-iframe");
  iframe?.contentWindow?.postMessage(data, iframe.src);
};

export default function PageRunner({
  model,
  submitCallback,
  view,
}: ICommandRunnerProps): JSX.Element {
  submitCallback.value = {
    call: async () => {
      send("submit");

      if (view === "page") {
        await new Promise((resolve) => {
          resolvePromise.value = resolve;
          setTimeout(resolve, 10000);
        });

        processNode(model, response.value);
      } else if (view === "output") {
        model.inputPins.forEach((x) => (x.value = undefined));
        model.outputPins.forEach((x) => (x.value = undefined));
        model.processed = false;
      }

      return view === "input" ? "page" : view === "page" ? "output" : "input";
    },
  };

  const response = useObservable<any>(undefined);
  const resolvePromise = useObservable<(reason?: any) => void>(() => {});
  const inputPins = model.inputPins.map((x) => new ObservableValue(x));
  const outputPins = model.outputPins.map((x) => new ObservableValue(x));

  useEffect(() => {
    const handleMessage = (e: MessageEvent<any>) => {
      response.value = e.data;
      resolvePromise.value();
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [response, resolvePromise]);

  const cardBodyStyle = {
    overflow: 'auto',
  };

  return (
    <>
      {(view === "input" && (
        <div className="card-body" style={cardBodyStyle}>
          <div className="d-flex flex-row w-100">
            <dl className="w-50 d-flex flex-column">
              <dt>Input Data</dt>
              {inputPins.map((x) => getInputByType(x, !!x.value.parentPin))}
            </dl>
          </div>
        </div>
      )) ||
        (view === "output" && (
          <div className="card-body" style={cardBodyStyle}>
            <div className="d-flex flex-row w-100">
              <dl className="w-50 d-flex flex-column">
                <dt>Output Data</dt>
                {outputPins.map((x) => getInputByType(x, true))}
              </dl>
            </div>
          </div>
        )) || (
          <iframe
            id="page-runner-iframe"
            className="h-100 w-100 overflow-hidden"
            title="page-runner"
            src={model.command}
            onLoad={() =>
              send(
                getObjectFromValues(
                  model.inputPins
                    .filter((x) => x.valueType !== PinValueType.Node)
                    .map<ICommandParameter>((x) => ({
                      name: x.name,
                      valueType: x.valueType,
                      value: x.value ?? "",
                    }))
                )
              )
            }
          ></iframe>
        )}
    </>
  );
}
