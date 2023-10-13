import React from "react";
import { Button, FormGroup, Input, Label } from "reactstrap/lib";
import FormModel, { IFormLoader } from "../components/Form/FormModel";
import Navbar from "../components/Navbar";
import api from "../api";
import {
  IPlatformNodeOutputModel,
  IPlatformNodePinOutputModel,
} from "../models/output/platformOutput";
import Tabs from "../components/Tabs/Tabs";
import Tab from "../components/Tabs/Tab";
import Table from "../components/Table/Table";
import Column from "../components/Table/Column";
import { IPlatformNodeInputModel } from "../models/input/platformInput";
import { NodeCommandType, PinDirection } from "../models/enums";
import { useHistory } from "react-router";

interface IPlatformNodeParams {
  id: number;
  platformId: number;
}

export default function PlatformNode({ id, platformId }: IPlatformNodeParams) {
  const history = useHistory();
  const isNew = id === 0;

  const onSubmit = (model: IPlatformNodeInputModel, loader: IFormLoader) => {
    loader.start();

    if (isNew) {
      api.platformNode.post(model, {
        success: (response: number) => {
          if (response) {
            history.push(`/platforms/${platformId}/nodes/${response}`);
          }
        },
        finally: () => {
          loader.complete();
        },
      });
    } else {
      api.platformNode.put(model, {
        finally: () => {
          loader.complete();
        },
      });
    }
  };

  const onDelete = (model: IPlatformNodeInputModel, loader: IFormLoader) => {
    loader.start();

    api.platformNode.delete(model.id, {
      success: () => {
        history.push(`/platforms/${platformId}`);
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
          { name: isNew ? "create" : `${id}` },
        ]}
      >
        <FormModel
          header="Node"
          className="mb-5"
          isNew={isNew}
          hrefBack={`/platforms/${platformId}`}
          default={{
            id: 0,
            platformId: platformId,
            commandType: NodeCommandType.None,
            isActive: true,
          }}
          api={(response) => api.platformNode.get(id, response)}
          apiMapper={(model: IPlatformNodeOutputModel) => model}
          onSubmit={onSubmit}
          onDelete={onDelete}
          tabs={
            <Tabs>
              <Tab tabId="pins" header="Pins" disabled={isNew}>
                <Table
                  display="inner"
                  api={(response, options) =>
                    api.platformNodePin.getAll(id, response, options)
                  }
                  title={
                    <Button
                      color="primary"
                      size="sm"
                      type="button"
                      href={
                        "/platforms/" +
                        platformId +
                        "/nodes/" +
                        id +
                        "/pins/create"
                      }
                    >
                      <span className="align-middle">Add new</span>
                    </Button>
                  }
                >
                  <Column
                    header="Id"
                    render={(props: IPlatformNodePinOutputModel) => props.id}
                  />
                  <Column
                    header="Name"
                    render={(props: IPlatformNodePinOutputModel) => props.name}
                    search
                  />
                  <Column
                    header="Direction"
                    render={(props: IPlatformNodePinOutputModel) =>
                      props.direction === PinDirection.Input
                        ? "Input"
                        : "Output"
                    }
                    search
                  />
                  <Column
                    render={(props: IPlatformNodePinOutputModel) => (
                      <a
                        className="btn-icon-only text-light btn btn- btn-sm"
                        href={
                          "/platforms/" +
                          platformId +
                          "/nodes/" +
                          id +
                          "/pins/" +
                          props.id
                        }
                      >
                        <i className="fas fa-pencil-alt"></i>
                      </a>
                    )}
                  />
                </Table>
              </Tab>
            </Tabs>
          }
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
                  placeholder="Enter node name"
                  onChange={(e) => handleChange(e)}
                />
              </FormGroup>
              <FormGroup>
                <Label for="commandType">Command type</Label>
                <Input
                  type="select"
                  id="commandType"
                  name="commandType"
                  disabled={disabled}
                  value={model.commandType}
                  onChange={(e) => {
                    handleChange(e, (e) => +e.target.value);
                  }}
                >
                  <option value={NodeCommandType.None}>
                    Select command type
                  </option>
                  <option value={NodeCommandType.Api}>Api</option>
                  <option value={NodeCommandType.Command}>Command</option>
                  <option value={NodeCommandType.Page}>Page</option>
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="command">Command Value</Label>
                <Input
                  type="text"
                  id="command"
                  name="command"
                  disabled={disabled}
                  value={model.command}
                  placeholder="Enter command value"
                  onChange={(e) => handleChange(e)}
                />
              </FormGroup>
              <FormGroup check>
                <Label>
                  <Input
                    type="checkbox"
                    name="isActive"
                    checked={model.isActive}
                    disabled={disabled}
                    onChange={(e) => handleChange(e, (e) => e.target.checked)}
                  />
                  Active
                </Label>
              </FormGroup>
            </>
          )}
        />
      </Navbar>
    </>
  );
}
