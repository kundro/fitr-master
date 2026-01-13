import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Navbar from "../../components/Navbar";
import {
  Button,
  Card,
  Form,
  FormGroup,
  Label,
  Alert,
  Input as BootstrapInput,
} from "reactstrap";
import { Input } from "../../../utils/observable";

export default function SignUpPage() {
  const history = useHistory();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    role: "Student",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      if (data.success) {
        setSuccess(data.message);
        setTimeout(() => {
          history.push("/login");
        }, 2000);
      } else {
        setError(data.message);
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
        <Card className="p-4" style={{ width: "450px" }}>
          <div
            className="pb-4"
            style={{ textAlign: "center", fontWeight: 600, fontSize: "20px" }}
          >
            SIGN UP
          </div>
          {error && <Alert color="danger">{error}</Alert>}
          {success && <Alert color="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="email">Email *</Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <div className="d-flex" style={{ gap: "10px" }}>
              <FormGroup style={{ flex: 1 }}>
                <Label for="firstName">First Name *</Label>
                <Input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup style={{ flex: 1 }}>
                <Label for="lastName">Last Name *</Label>
                <Input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </div>
            <FormGroup>
              <Label for="role">Role *</Label>
              <BootstrapInput
                type="select"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
              </BootstrapInput>
              <small className="text-muted">
                {formData.role === "Teacher"
                  ? "Requires admin approval"
                  : "Requires teacher approval"}
              </small>
            </FormGroup>
            <FormGroup>
              <Label for="password">Password *</Label>
              <Input
                type={passwordVisible ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter password (min 6 characters)"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="confirmPassword">Confirm Password *</Label>
              <Input
                type={passwordVisible ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
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
              {loading ? "Signing up..." : "SIGN UP"}
            </Button>
            <div className="text-center mt-3">
              <span>Already have an account? </span>
              <a href="/login" style={{ color: "#007bff" }}>
                Login
              </a>
            </div>
          </Form>
        </Card>
      </div>
    </Navbar>
  );
}
