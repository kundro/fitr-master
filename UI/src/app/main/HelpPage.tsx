import React from "react";
import Navbar from "../components/Navbar";
import { Card, Container, Row, Col } from "reactstrap";

export default function HelpPage() {
  return (
    <Navbar>
      <Container className="mt-4 mb-5">
        <h2 className="mb-4 text-center">TaskCraft© Help & Documentation</h2>
        
        <Row>
          <Col md={6} className="mb-4">
            <Card className="h-100 shadow-sm border-0" style={{ borderLeft: '4px solid #007bff' }}>
              <div className="p-4">
                <h4 className="mb-3" style={{ color: '#007bff' }}>Getting Started</h4>
                <h6 className="text-muted mb-3">Creating Your Account</h6>
                <ol className="mb-0">
                  <li className="mb-2">Click "LOGIN" in the top navigation</li>
                  <li className="mb-2">Select "Sign Up" to create a new account</li>
                  <li className="mb-2">Choose your role (Student or Teacher)</li>
                  <li className="mb-2">Wait for approval from Admin (Teachers) or Teacher (Students)</li>
                </ol>
              </div>
            </Card>
          </Col>

          <Col md={6} className="mb-4">
            <Card className="h-100 shadow-sm border-0" style={{ borderLeft: '4px solid #dc3545' }}>
              <div className="p-4">
                <h4 className="mb-3" style={{ color: '#dc3545' }}>For Administrators</h4>
                <h6 className="text-muted mb-3">Admin Responsibilities</h6>
                <ul className="mb-0" style={{ listStyle: 'none', paddingLeft: 0 }}>
                  <li className="mb-2">✓ <strong>Approve Teachers:</strong> Review and approve teacher registration requests</li>
                  <li className="mb-2">✓ <strong>Full System Access:</strong> Manage flows, view runs, and configure platforms</li>
                  <li className="mb-2">✓ <strong>System Oversight:</strong> Monitor all activities across the platform</li>
                </ul>
              </div>
            </Card>
          </Col>

          <Col md={6} className="mb-4">
            <Card className="h-100 shadow-sm border-0" style={{ borderLeft: '4px solid #28a745' }}>
              <div className="p-4">
                <h4 className="mb-3" style={{ color: '#28a745' }}>For Teachers</h4>
                <h6 className="text-muted mb-3">Teacher Features</h6>
                <ul className="mb-0" style={{ listStyle: 'none', paddingLeft: 0 }}>
                  <li className="mb-2">✓ <strong>Approve Students:</strong> Review and approve student registration requests</li>
                  <li className="mb-2">✓ <strong>Create Flows:</strong> Design computational flows for educational purposes</li>
                  <li className="mb-2">✓ <strong>Manage Assignments:</strong> Create and track student assignments</li>
                  <li className="mb-2">✓ <strong>View Runs:</strong> Monitor student execution results</li>
                </ul>
              </div>
            </Card>
          </Col>

          <Col md={6} className="mb-4">
            <Card className="h-100 shadow-sm border-0" style={{ borderLeft: '4px solid #ffc107' }}>
              <div className="p-4">
                <h4 className="mb-3" style={{ color: '#f39c12' }}>For Students</h4>
                <h6 className="text-muted mb-3">Student Capabilities</h6>
                <ul className="mb-0" style={{ listStyle: 'none', paddingLeft: 0 }}>
                  <li className="mb-2">✓ <strong>View Assignments:</strong> Access tasks assigned by your teacher</li>
                  <li className="mb-2">✓ <strong>Execute Flows:</strong> Run computational flows and see results</li>
                  <li className="mb-2">✓ <strong>Submit Work:</strong> Complete and submit assignments</li>
                </ul>
              </div>
            </Card>
          </Col>

          <Col md={6} className="mb-4">
            <Card className="h-100 shadow-sm border-0" style={{ borderLeft: '4px solid #6f42c1' }}>
              <div className="p-4">
                <h4 className="mb-3" style={{ color: '#6f42c1' }}>Working with Flows</h4>
                <h6 className="text-muted mb-3">Flow Creation & Execution</h6>
                <ul className="mb-0" style={{ listStyle: 'none', paddingLeft: 0 }}>
                  <li className="mb-2">✓ <strong>Visual Editor:</strong> Drag and drop nodes to create flows</li>
                  <li className="mb-2">✓ <strong>Color Coding:</strong> Subflows automatically receive unique colors for easy identification</li>
                  <li className="mb-2">✓ <strong>Node Types:</strong> Utilize various node types (Input, Output, Process, Decision)</li>
                  <li className="mb-2">✓ <strong>Run & Debug:</strong> Execute flows and view real-time results</li>
                </ul>
              </div>
            </Card>
          </Col>

          <Col md={6} className="mb-4">
            <Card className="h-100 shadow-sm border-0" style={{ borderLeft: '4px solid #17a2b8' }}>
              <div className="p-4">
                <h4 className="mb-3" style={{ color: '#17a2b8' }}>Troubleshooting</h4>
                <h6 className="text-muted mb-3">Common Issues</h6>
                <ul className="mb-0" style={{ listStyle: 'none', paddingLeft: 0 }}>
                  <li className="mb-2">✓ <strong>Cannot Login:</strong> Ensure your account has been approved by the appropriate role</li>
                  <li className="mb-2">✓ <strong>Missing Features:</strong> Check that you're logged in with the correct role</li>
                  <li className="mb-2">✓ <strong>Flow Won't Run:</strong> Verify all required nodes are connected properly</li>
                  <li className="mb-2">✓ <strong>Need Help:</strong> Contact your system administrator</li>
                </ul>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
}
