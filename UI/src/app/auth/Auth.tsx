import { Route } from "react-router-dom";
import LoginPage from "./login/LoginPage";
import SignUpPage from "./signUp/SignUpPage";
import AdminDashboard from "./admin/AdminDashboard";
import TeacherDashboard from "./teacher/TeacherDashboard";
import StudentDashboard from "./student/StudentDashboard";

export const authRoutes = [
  <Route
    key="login"
    path="/login"
    exact
    render={(props) => <LoginPage />}
  />,
  <Route
    key="signup"
    path="/signup"
    exact
    render={(props) => <SignUpPage />}
  />,
  <Route
    key="admin"
    path="/admin"
    exact
    render={(props) => <AdminDashboard />}
  />,
  <Route
    key="teacher"
    path="/teacher"
    exact
    render={(props) => <TeacherDashboard />}
  />,
  <Route
    key="student"
    path="/student"
    exact
    render={(props) => <StudentDashboard />}
  />,
];
