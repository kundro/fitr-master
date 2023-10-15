import React from "react";
import { FormGroup, Input, Label } from "reactstrap";
import FormModel, { IFormLoader } from "../components/Form/FormModel";
import Navbar from "../components/Navbar";
import api from "../api";
import { IPlatformNodePinOutputModel } from "../models/output/platformOutput";
import { IPlatformNodePinInputModel } from "../models/input/platformInput";
import { PinDirection, PinValueType } from "../models/enums";
import { useHistory } from "react-router";

interface IPlatformNodePinParams {
  id: number;
  platformId: number;
  nodeId: number;
}

export default function PlatformNodePin({
  id,
  platformId,
  nodeId,
}: IPlatformNodePinParams) {
  const history = useHistory();
  const isNew = id === 0;

  const onSubmit = (model: IPlatformNodePinInputModel, loader: IFormLoader) => {
    loader.start();

    if (model.id === 0) {
      api.platformNodePin.post(model, {
        success: (response: number) => {
          if (response) {
            history.push(
              `/platforms/${platformId}/nodes/${nodeId}/pins/${response}`
            );
          }
        },
        finally: () => {
          loader.complete();
        },
      });
    } else {
      api.platformNodePin.put(model, {
        finally: () => {
          loader.complete();
        },
      });
    }
  };

  const onDelete = (model: IPlatformNodePinInputModel, loader: IFormLoader) => {
    loader.start();

    api.platformNodePin.delete(model.id, {
      success: () => {
        history.push(`/platforms/${platformId}/nodes/${nodeId}`);
      },
      finally: () => {
        loader.complete();
      },
    });
  };

  return (
    <>
      <Navbar
        nav={[
          { name: "Platforms", href: "/platforms" },
          { name: `${platformId}`, href: `/platforms/${platformId}` },
          { name: "Nodes" },
          {
            name: `${nodeId}`,
            href: `/platforms/${platformId}/nodes/${nodeId}`,
          },
          { name: "Pins" },
          { name: isNew ? "create" : `${id}` },
        ]}
      >
        <FormModel
          header="Pin"
          className="mb-5"
          isNew={isNew}
          hrefBack={`/platforms/${platformId}/nodes/${nodeId}`}
          default={{
            id: 0,
            nodeId: nodeId,
            direction: PinDirection.Input,
            valueType: PinValueType.String,
            isPublic: true,
          }}
          api={(response) => api.platformNodePin.get(id, response)}
          apiMapper={(model: IPlatformNodePinOutputModel) => model}
          onSubmit={onSubmit}
          onSaveAsNew={(model, loader) => {
            model.id = 0;
            onSubmit(model, loader);
          }}
          onDelete={onDelete}
          children={(model, disabled, handleChange) => (
            <>
              <FormGroup>
                <Label for="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  disabled={disabled}
                  value={model.name}
                  placeholder="Enter pin name"
                  onChange={(e) => handleChange(e)}
                />
              </FormGroup>
              <FormGroup>
                <Label for="valueType">Value Type</Label>
                <Input
                  type="select"
                  id="valueType"
                  name="valueType"
                  disabled={disabled}
                  value={model.valueType}
                  onChange={(e) => {
                    handleChange(e, (e) => +e.target.value);
                  }}
                >
                  <option value={PinValueType.Bool}>Bool</option>
                  <option value={PinValueType.Node}>Node</option>
                  <option value={PinValueType.Number}>Number</option>
                  <option value={PinValueType.Object}>Object</option>
                  <option value={PinValueType.String}>String</option>
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="direction">Direction</Label>
                <Input
                  type="select"
                  id="direction"
                  name="direction"
                  disabled={disabled}
                  value={model.direction}
                  onChange={(e) => {
                    handleChange(e, (e) => +e.target.value);
                  }}
                >
                  <option value={PinDirection.Input}>Input</option>
                  <option value={PinDirection.Output}>Output</option>
                </Input>
              </FormGroup>
              <FormGroup check>
                <Label>
                  <Input
                    type="checkbox"
                    name="isPublic"
                    checked={model.isPublic}
                    disabled={disabled}
                    onChange={(e) => handleChange(e, (e) => e.target.checked)}
                  />
                  Is Public
                </Label>
              </FormGroup>
            </>
          )}
        />
      </Navbar>
    </>
  );
}
