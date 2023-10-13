import React from "react";
import { Button } from "reactstrap";
import api from "../api";
import Navbar from "../components/Navbar";
import Column from "../components/Table/Column";
import Table from "../components/Table/Table";
import { IFlowListItemModel } from "../models/flow";

export default function FlowList() {
  return (
    <>
      <Navbar nav={{ name: "Flows" }}>
        <Table
          header="Flows"
          api={api.flow.getAll}
          title={
            <Button
              color="primary"
              size="sm"
              type="button"
              href="/flows/create"
            >
              <span className="align-middle">Add new</span>
            </Button>
          }
        >
          <Column
            header="Id"
            render={(props: IFlowListItemModel) => props.id}
          />
          <Column
            header="Name"
            render={(props: IFlowListItemModel) => props.name}
            search
          />
          <Column
            render={(props: IFlowListItemModel) => (
              <a
                className="btn-icon-only text-light btn btn- btn-sm"
                href={"/flows/" + props.id}
              >
                <i className="fas fa-pencil-alt"></i>
              </a>
            )}
          />
        </Table>
      </Navbar>
    </>
  );
}
