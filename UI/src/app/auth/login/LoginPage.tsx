import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { Button, Card, Form, FormGroup, Label, Alert } from "reactstrap";
import { Input } from "../../../utils/observable";

export default function LoginPage() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://localhost:44300/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      // API returns data wrapped in "result"
      const result = data.result || data;

      if (!response.ok) {
        setError(result.message || "Login failed");
        setLoading(false);
        return;
      }

      if (result.success) {
        // Save token to localStorage
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));

        // Redirect based on role
        switch (result.user.role) {
          case "Admin":
            history.push("/admin");
            break;
          case "Teacher":
            history.push("/teacher");
            break;
          case "Student":
            history.push("/student");
            break;
          default:
            history.push("/flows");
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Navbar authPage={true}>
      <div className="d-flex justify-content-center">
        <Card className="p-4" style={{ width: "400px" }}>
          <div
            className="pb-4"
            style={{ textAlign: "center", fontWeight: 600, fontSize: "20px" }}
          >
            LOGIN
          </div>
          {error && <Alert color="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                type={passwordVisible ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup check>
              <Label>
                <Input
                  type="checkbox"
                  id="showPassword"
                  name="showPassword"
                  onChange={() => setPasswordVisible(!passwordVisible)}
                />
                Show password
              </Label>
            </FormGroup>
            <Button className="mt-3 w-100" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "LOGIN"}
            </Button>
            <div className="text-center mt-3">
              <span>Don't have an account? </span>
              <a href="/signup" style={{ color: "#007bff" }}>
                Sign Up
              </a>
            </div>
          </Form>
        </Card>
      </div>
    </Navbar>
  );
}
