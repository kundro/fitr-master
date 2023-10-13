import React from "react";
import { Card } from "reactstrap/lib";
import api from "../api";
import Navbar from "../components/Navbar";
import Column from "../components/Table/Column";
import Table from "../components/Table/Table";
import Tab from "../components/Tabs/Tab";
import Tabs from "../components/Tabs/Tabs";
import { IRunFlowListItemModel, IRunNodeListItemModel } from "../models/run";

export default function RunList() {
  return (
    <>
      <Navbar nav={{ name: "Run" }}>
        <Card>
          <h6 className="card-header border-0">Run</h6>
          <Tabs>
            <Tab tabId="flows" header="Flows">
              <Table display="inner" api={api.runFlow.getAll}>
                <Column
                  header="Id"
                  render={(props: IRunFlowListItemModel) => props.id}
                />
                <Column
                  header="Name"
                  render={(props: IRunFlowListItemModel) => props.name}
                  search
                />
                <Column
                  render={(props: IRunFlowListItemModel) => (
                    <a
                      className="btn-icon-only text-light btn btn- btn-sm"
                      href={"/run/flows/" + props.id}
                    >
                      <i className="fas fa-play"></i>
                    </a>
                  )}
                />
              </Table>
            </Tab>
            <Tab tabId="nodes" header="Nodes">
              <Table display="inner" api={api.runNode.getAll}>
                <Column
                  header="Id"
                  render={(props: IRunNodeListItemModel) => props.id}
                />
                <Column
                  header="Name"
                  render={(props: IRunNodeListItemModel) => props.name}
                  search
                />
                <Column
                  render={(props: IRunNodeListItemModel) => (
                    <a
                      className="btn-icon-only text-light btn btn- btn-sm"
                      href={"/run/nodes/" + props.id}
                    >
                      <i className="fas fa-play"></i>
                    </a>
                  )}
                />
              </Table>
            </Tab>
          </Tabs>
        </Card>
      </Navbar>
    </>
  );
}
