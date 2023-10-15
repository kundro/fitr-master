import React from "react";
import { FormGroup, Label } from "reactstrap";
import {
  Checkbox,
  Input,
  ObservableValue,
} from "../../../../../utils/observable";

export interface IFlowSettingsProps {
  name: ObservableValue<string>;
  isActive: ObservableValue<boolean>;
}

export default function FlowSettings({
  name,
  isActive,
}: IFlowSettingsProps): JSX.Element {
  return (
    <>
      <dt>Flow</dt>
      <div>
        <FormGroup>
          <Label for="name">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            observable={name}
            placeholder="Enter flow name"
            onChange={(e) => (name.value = e.target.value)}
          />
        </FormGroup>
        <FormGroup check>
          <Label>
            <Checkbox
              type="checkbox"
              id="isActive"
              name="isActive"
              observable={isActive}
              onChange={(e) => (isActive.value = e.target.checked)}
            />
            Active
          </Label>
        </FormGroup>
      </div>
    </>
  );
}
