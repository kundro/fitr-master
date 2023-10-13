import React from "react";
import { Button, FormGroup } from "reactstrap/lib";
import { IConnectorObservable } from "../../../Flow";

export interface IConnectorSettingsProps {
  connector: IConnectorObservable;
  onConnectorDelete?: (connector: IConnectorObservable) => void;
}

export default function ConnectorSettings({
  connector,
  onConnectorDelete,
}: IConnectorSettingsProps): JSX.Element {
  return (
    <>
      <dt>Selected Connector</dt>
      <FormGroup className="mt-2">
        <Button
          className="text-danger"
          color="link"
          size="sm"
          outline
          type="button"
          onClick={() => onConnectorDelete && onConnectorDelete(connector)}
        >
          Delete
        </Button>
      </FormGroup>
    </>
  );
}
