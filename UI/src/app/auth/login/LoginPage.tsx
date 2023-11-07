import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import { Button, Card, Form, FormGroup, Label } from "reactstrap";
import { Input } from "../../../utils/observable";

export default function LoginPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <Navbar authPage={true}>
      <div className="d-flex justify-content-center">
        <Card className="p-4" style={{ width: "350px" }}>
          <div
            className="pb-4"
            style={{ textAlign: "center", fontWeight: 600 }}
          >
            LOGIN
          </div>
          <Form
            onSubmit={() => {
              alert("submit");
            }}
          >
            <FormGroup>
              <Label for="name">Username</Label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="Enter username"
              />
            </FormGroup>
            <FormGroup>
              <Label for="author">Password</Label>
              <Input
                type={passwordVisible ? "text" : "password"}
                id="author"
                name="author"
                placeholder="Enter passsword"
              />
            </FormGroup>
            <FormGroup check>
              <Label>
                <Input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  onChange={() => setPasswordVisible(!passwordVisible)}
                />
                Show password
              </Label>
            </FormGroup>
            <Button className="mt-3 w-100" type="submit">
              LOGIN
            </Button>
          </Form>
        </Card>
      </div>
    </Navbar>
  );
}
