import React from "react";
import { Button, FormGroup, Input, Label } from "reactstrap/lib";
import Navbar from "../components/Navbar";
import Column from "../components/Table/Column";
import Table from "../components/Table/Table";
import {
  IPlatformNodeListItemOutputModel,
  IPlatformOutputModel,
} from "../models/output/platformOutput";
import api from "../api";
import FormModel, { IFormLoader } from "../components/Form/FormModel";
import Tabs from "../components/Tabs/Tabs";
import Tab from "../components/Tabs/Tab";
import { useHistory } from "react-router";
import { IPlatformInputModel } from "../models/input/platformInput";

interface IPlatformParams {
  id: number;
}

export default function Platform({ id }: IPlatformParams) {
  const history = useHistory();
  const isNew = id === 0;

  const onSubmit = (model: IPlatformInputModel, loader: IFormLoader) => {
    loader.start();

    if (isNew) {
      api.platform.post(model, {
        success: (response: number) => {
          if (response) {
            history.push(`/platforms/${response}`);
          }
        },
        finally: () => {
          loader.complete();
        },
      });
    } else {
      api.platform.put(model, {
        finally: () => {
          loader.complete();
        },
      });
    }
  };

  const onDelete = (model: IPlatformInputModel, loader: IFormLoader) => {
    loader.start();

    api.platform.delete(model.id, {
      success: () => {
        history.push("/platforms");
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
          { name: isNew ? "create" : `${id}` },
        ]}
      >
        <FormModel
          header="Platform"
          className="mb-5"
          isNew={isNew}
          hrefBack="/platforms"
          default={{ id: 0, isActive: true }}
          api={(response) => api.platform.get(id, response)}
          apiMapper={(model: IPlatformOutputModel) => model}
          onSubmit={onSubmit}
          onDelete={onDelete}
          tabs={
            <Tabs>
              <Tab tabId="nodes" header="Nodes" disabled={isNew}>
                <Table
                  display="inner"
                  api={(response, options) =>
                    api.platformNode.getAll(id, response, options)
                  }
                  title={
                    <Button
                      color="primary"
                      size="sm"
                      type="button"
                      href={"/platforms/" + id + "/nodes/create"}
                    >
                      <span className="align-middle">Add new</span>
                    </Button>
                  }
                >
                  <Column
                    header="Id"
                    render={(props: IPlatformNodeListItemOutputModel) =>
                      props.id
                    }
                  />
                  <Column
                    header="Name"
                    render={(props: IPlatformNodeListItemOutputModel) =>
                      props.name
                    }
                    search
                  />
                  <Column
                    render={(props: IPlatformNodeListItemOutputModel) => (
                      <a
                        className="btn-icon-only text-light btn btn- btn-sm"
                        href={"/platforms/" + id + "/nodes/" + props.id}
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
                  placeholder="Enter platform name"
                  onChange={(e) => handleChange(e)}
                />
              </FormGroup>
              <FormGroup>
                <Label for="author">Author</Label>
                <Input
                  type="text"
                  id="author"
                  name="author"
                  disabled={disabled}
                  value={model.author}
                  placeholder="Enter author name"
                  onChange={(e) => handleChange(e)}
                />
              </FormGroup>
              <FormGroup>
                <Label for="description">Description</Label>
                <Input
                  type="textarea"
                  id="description"
                  name="description"
                  disabled={disabled}
                  value={model.description}
                  placeholder="Enter description"
                  onChange={(e) => handleChange(e)}
                />
              </FormGroup>
              <FormGroup check>
                <Label>
                  <Input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    disabled={disabled}
                    checked={model.isActive}
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
