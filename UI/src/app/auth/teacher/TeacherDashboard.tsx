import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Navbar from "../../components/Navbar";
import {
  Card,
  Button,
  Table,
  Alert,
  Badge,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import classnames from "classnames";

interface PendingStudent {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export default function TeacherDashboard() {
  const history = useHistory();
  const [activeTab, setActiveTab] = useState("students");
  const [pendingStudents, setPendingStudents] = useState<PendingStudent[]>([]);
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
    if (parsedUser.role !== "Teacher") {
      history.push("/login");
      return;
    }

    if (!parsedUser.isApproved) {
      setError("Your account is pending admin approval");
      setLoading(false);
      return;
    }

    setUser(parsedUser);
    loadPendingStudents();
  }, [history]);

  const loadPendingStudents = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(
        "https://localhost:44300/api/teacher/pending-students",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPendingStudents(data);
      } else if (response.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        history.push("/login");
      }
    } catch (err) {
      setError("Failed to load pending students");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (studentId: number) => {
    const token = localStorage.getItem("authToken");
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `https://localhost:44300/api/teacher/approve-student/${studentId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setSuccess("Student approved successfully!");
        loadPendingStudents();
      } else {
        setError("Failed to approve student");
      }
    } catch (err) {
      setError("Connection error");
    }
  };

  const handleReject = async (studentId: number) => {
    const token = localStorage.getItem("authToken");
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `https://localhost:44300/api/teacher/reject-student/${studentId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setSuccess("Student rejected successfully!");
        loadPendingStudents();
      } else {
        setError("Failed to reject student");
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
            <h2 style={{ color: "white" }}>Teacher Dashboard</h2>
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

        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "students" })}
              onClick={() => setActiveTab("students")}
              style={{ cursor: "pointer" }}
            >
              Pending Students{" "}
              <Badge color="primary">{pendingStudents.length}</Badge>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "assignments" })}
              onClick={() => setActiveTab("assignments")}
              style={{ cursor: "pointer" }}
            >
              Assignments
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={activeTab}>
          <TabPane tabId="students">
            <Card className="p-4 mt-3">
              <h4 className="mb-3">Pending Student Approvals</h4>

              {pendingStudents.length === 0 ? (
                <p className="text-muted">No pending student approvals</p>
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
                    {pendingStudents.map((student) => (
                      <tr key={student.id}>
                        <td>
                          {student.firstName} {student.lastName}
                        </td>
                        <td>{student.email}</td>
                        <td>
                          <Button
                            color="success"
                            size="sm"
                            className="me-2"
                            onClick={() => handleApprove(student.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            color="danger"
                            size="sm"
                            onClick={() => handleReject(student.id)}
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
          </TabPane>

          <TabPane tabId="assignments">
            <Card className="p-4 mt-3">
              <h4 className="mb-3">Manage Assignments</h4>
              <p className="text-muted">
                Assignment management coming soon...
              </p>
              <Button color="primary" onClick={() => alert("Coming soon!")}>
                Create New Assignment
              </Button>
            </Card>
          </TabPane>
        </TabContent>

        <Card className="p-4 mt-4">
          <h4 className="mb-3">Teacher Access</h4>
          <p className="text-muted mb-3">
            Access your teaching tools:
          </p>
          <div className="d-flex gap-2">
            <Button color="primary" onClick={() => history.push("/flows")}>
              Manage Flows
            </Button>
            <Button color="primary" onClick={() => history.push("/runs")}>
              View Runs
            </Button>
          </div>
        </Card>
      </div>
    </Navbar>
  );
}
