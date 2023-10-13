import React from "react";
import { Button } from "reactstrap";
import api from "../api";
import Navbar from "../components/Navbar";
import Column from "../components/Table/Column";
import Table from "../components/Table/Table";
import { IPlatformListItemOutputModel } from "../models/output/platformOutput";

export default function PlatformList() {
  return (
    <>
      <Navbar nav={{ name: "Platforms" }}>
        <Table
          header="Platforms"
          api={api.platform.getAll}
          title={
            <Button
              color="primary"
              size="sm"
              type="button"
              href="/platforms/create"
            >
              <span className="align-middle">Add new</span>
            </Button>
          }
        >
          <Column
            header="Id"
            render={(props: IPlatformListItemOutputModel) => props.id}
          />
          <Column
            header="Name"
            render={(props: IPlatformListItemOutputModel) => props.name}
            search
          />
          <Column
            header="Author"
            render={(props: IPlatformListItemOutputModel) => props.author}
            search
          />
          <Column
            header="Description"
            render={(props: IPlatformListItemOutputModel) => props.description}
          />
          <Column
            render={(props: IPlatformListItemOutputModel) => (
              <a
                className="btn-icon-only text-light btn btn- btn-sm"
                href={"/platforms/" + props.id}
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
