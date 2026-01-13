import React from "react";
import Navbar from "../components/Navbar";
import { Card, Container } from "reactstrap";

export default function AboutUsPage() {
  return (
    <Navbar>
      <Container className="mt-4">
        <Card className="p-4">
          <h2 className="mb-4">About TaskCraft© Learning Management</h2>
          
          <section className="mb-4">
            <h4>Project Overview</h4>
            <p>
              TaskCraft© is an innovative visual programming and learning management platform 
              designed to facilitate computational thinking education. The system combines 
              flow-based programming with role-based access control to create a comprehensive 
              educational environment.
            </p>
          </section>

          <section className="mb-4">
            <h4>Key Features</h4>
            <ul>
              <li><strong>Visual Flow Programming:</strong> Intuitive drag-and-drop interface for creating computational flows</li>
              <li><strong>Role-Based Architecture:</strong> Three-tier system (Admin, Teacher, Student) with approval workflows</li>
              <li><strong>Color-Coded Subflows:</strong> Automatic color assignment using golden angle algorithm for visual distinction</li>
              <li><strong>Assignment Management:</strong> Teachers can create and track student assignments</li>
              <li><strong>Real-time Execution:</strong> Run and visualize computational flows with immediate feedback</li>
            </ul>
          </section>

          <section className="mb-4">
            <h4>Technology Stack</h4>
            <ul>
              <li><strong>Frontend:</strong> React with TypeScript</li>
              <li><strong>Backend:</strong> ASP.NET Core 6 Web API</li>
              <li><strong>Database:</strong> SQL Server</li>
              <li><strong>Authentication:</strong> JWT-based with BCrypt password hashing</li>
            </ul>
          </section>

          <section>
            <h4>Academic Context</h4>
            <p>
              This platform was developed as part of a Master's thesis project, focusing on 
              creating accessible tools for teaching programming concepts through visual 
              representation and interactive learning experiences.
            </p>
          </section>
        </Card>
      </Container>
    </Navbar>
  );
}
