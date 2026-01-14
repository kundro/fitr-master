import React from "react";
import Navbar from "../components/Navbar";
import { Card, Container, Accordion, AccordionBody, AccordionHeader, AccordionItem } from "reactstrap";

export default function HelpPage() {
  const [open, setOpen] = React.useState('1');
  const toggle = (id: string) => {
    if (open === id) {
      setOpen('');
    } else {
      setOpen(id);
    }
  };

  return (
    <Navbar>
      <Container className="mt-4">
        <Card className="p-4">
          <h2 className="mb-4">TaskCraft© Help & Documentation</h2>
          
          <Accordion open={open}>
            <AccordionItem>
              <AccordionHeader targetId="1" onClick={() => toggle('1')}>Getting Started</AccordionHeader>
              <AccordionBody accordionId="1">
                <h5>Creating Your Account</h5>
                <ol>
                  <li>Click "LOGIN" in the top navigation</li>
                  <li>Select "Sign Up" to create a new account</li>
                  <li>Choose your role (Student or Teacher)</li>
                  <li>Wait for approval from Admin (Teachers) or Teacher (Students)</li>
                </ol>
              </AccordionBody>
            </AccordionItem>

            <AccordionItem>
              <AccordionHeader targetId="2" onClick={() => toggle('2')}>For Administrators</AccordionHeader>
              <AccordionBody accordionId="2">
                <h5>Admin Responsibilities</h5>
                <ul>
                  <li><strong>Approve Teachers:</strong> Review and approve teacher registration requests</li>
                  <li><strong>Full System Access:</strong> Manage flows, view runs, and configure platforms</li>
                  <li><strong>System Oversight:</strong> Monitor all activities across the platform</li>
                </ul>
              </AccordionBody>
            </AccordionItem>

            <AccordionItem>
              <AccordionHeader targetId="3" onClick={() => toggle('3')}>For Teachers</AccordionHeader>
              <AccordionBody accordionId="3">
                <h5>Teacher Features</h5>
                <ul>
                  <li><strong>Approve Students:</strong> Review and approve student registration requests</li>
                  <li><strong>Create Flows:</strong> Design computational flows for educational purposes</li>
                  <li><strong>Manage Assignments:</strong> Create and track student assignments</li>
                  <li><strong>View Runs:</strong> Monitor student execution results</li>
                </ul>
              </AccordionBody>
            </AccordionItem>

            <AccordionItem>
              <AccordionHeader targetId="4" onClick={() => toggle('4')}>For Students</AccordionHeader>
              <AccordionBody accordionId="4">
                <h5>Student Capabilities</h5>
                <ul>
                  <li><strong>View Assignments:</strong> Access tasks assigned by your teacher</li>
                  <li><strong>Execute Flows:</strong> Run computational flows and see results</li>
                  <li><strong>Submit Work:</strong> Complete and submit assignments</li>
                </ul>
              </AccordionBody>
            </AccordionItem>

            <AccordionItem>
              <AccordionHeader targetId="5" onClick={() => toggle('5')}>Working with Flows</AccordionHeader>
              <AccordionBody accordionId="5">
                <h5>Flow Creation & Execution</h5>
                <ul>
                  <li><strong>Visual Editor:</strong> Drag and drop nodes to create flows</li>
                  <li><strong>Color Coding:</strong> Subflows automatically receive unique colors for easy identification</li>
                  <li><strong>Node Types:</strong> Utilize various node types (Input, Output, Process, Decision)</li>
                  <li><strong>Run & Debug:</strong> Execute flows and view real-time results</li>
                </ul>
              </AccordionBody>
            </AccordionItem>

            <AccordionItem>
              <AccordionHeader targetId="6" onClick={() => toggle('6')}>Troubleshooting</AccordionHeader>
              <AccordionBody accordionId="6">
                <h5>Common Issues</h5>
                <ul>
                  <li><strong>Cannot Login:</strong> Ensure your account has been approved by the appropriate role</li>
                  <li><strong>Missing Features:</strong> Check that you're logged in with the correct role</li>
                  <li><strong>Flow Won't Run:</strong> Verify all required nodes are connected properly</li>
                  <li><strong>Need Help:</strong> Contact your system administrator</li>
                </ul>
              </AccordionBody>
            </AccordionItem>
          </Accordion>
        </Card>
      </Container>
    </Navbar>
  );
}
