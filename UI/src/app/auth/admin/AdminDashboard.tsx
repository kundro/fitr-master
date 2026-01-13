import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { Card, Button, Table, Alert, Badge } from "reactstrap";

interface PendingTeacher {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export default function AdminDashboard() {
  const history = useHistory();
  const [pendingTeachers, setPendingTeachers] = useState<PendingTeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      history.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "Admin") {
      history.push("/login");
      return;
    }

    setUser(parsedUser);
    loadPendingTeachers();
  }, [history]);

  const loadPendingTeachers = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(
        "https://localhost:44300/api/admin/pending-teachers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPendingTeachers(data);
      } else if (response.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        history.push("/login");
      }
    } catch (err) {
      setError("Failed to load pending teachers");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (teacherId: number) => {
    const token = localStorage.getItem("authToken");
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `https://localhost:44300/api/admin/approve-teacher/${teacherId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setSuccess("Teacher approved successfully!");
        loadPendingTeachers();
      } else {
        setError("Failed to approve teacher");
      }
    } catch (err) {
      setError("Connection error");
    }
  };

  const handleReject = async (teacherId: number) => {
    const token = localStorage.getItem("authToken");
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `https://localhost:44300/api/admin/reject-teacher/${teacherId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setSuccess("Teacher rejected successfully!");
        loadPendingTeachers();
      } else {
        setError("Failed to reject teacher");
      }
    } catch (err) {
      setError("Connection error");
    }
  };

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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 style={{ color: "white" }}>Admin Dashboard</h2>
            {user && (
              <p style={{ color: "#ccc" }}>
                Welcome, {user.firstName} {user.lastName}
              </p>
            )}
          </div>
          <Button color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {error && <Alert color="danger">{error}</Alert>}
        {success && <Alert color="success">{success}</Alert>}

        <Card className="p-4">
          <h4 className="mb-3">
            Pending Teacher Approvals{" "}
            <Badge color="primary">{pendingTeachers.length}</Badge>
          </h4>

          {pendingTeachers.length === 0 ? (
            <p className="text-muted">No pending teacher approvals</p>
          ) : (
            <Table striped>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingTeachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td>
                      {teacher.firstName} {teacher.lastName}
                    </td>
                    <td>{teacher.email}</td>
                    <td>
                      <Button
                        color="success"
                        size="sm"
                        className="me-2"
                        onClick={() => handleApprove(teacher.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => handleReject(teacher.id)}
                      >
                        Reject
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>

        <div className="mt-4">
          <Button color="primary" onClick={() => history.push("/flows")}>
            Go to Flows
          </Button>
        </div>
      </div>
    </Navbar>
  );
}
