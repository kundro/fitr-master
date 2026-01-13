import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { Card, Button, Alert, Badge } from "reactstrap";

export default function StudentDashboard() {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      history.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "Student") {
      history.push("/login");
      return;
    }

    if (!parsedUser.isApproved) {
      setError("Your account is pending teacher approval");
      setLoading(false);
      return;
    }

    setUser(parsedUser);
    setLoading(false);
  }, [history]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    history.push("/login");
  };

  if (loading) {
    return (
      <Navbar authPage={false}>
        <div className="text-center" style={{ color: "white", marginTop: "50px" }}>
          Loading...
        </div>
      </Navbar>
    );
  }

  return (
    <Navbar authPage={false}>
      <div className="container mt-4">
        <div className="mb-4">
          <h2 style={{ color: "white" }}>Student Dashboard</h2>
          {user && (
            <p style={{ color: "#ccc" }}>
              Welcome, {user.firstName} {user.lastName}
            </p>
          )}
        </div>

        {error && <Alert color="danger">{error}</Alert>}

        <Card className="p-4">
          <h4 className="mb-3">
            My Assignments <Badge color="primary">0</Badge>
          </h4>
          <p className="text-muted">
            No assignments available yet. Your teacher will assign tasks soon.
          </p>
        </Card>

        <Card className="p-4 mt-4">
          <h4 className="mb-3">Student Access</h4>
          <p className="text-muted mb-3">
            View your runs and submissions:
          </p>
          <Button color="primary" onClick={() => history.push("/runs")}>
            View My Runs
          </Button>
        </Card>
      </div>
    </Navbar>
  );
}
