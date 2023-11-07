import { Route } from "react-router-dom";
import LoginPage from "./login/LoginPage";
import SignUpPage from "./signUp/SignUpPage";

export const authRoutes = [
  <Route
    key="helpInfo"
    path="/login"
    exact
    render={(props) => <LoginPage />}
  />,
  <Route
    key="aboutUsInfo"
    path="/signup"
    exact
    render={(props) => <SignUpPage />}
  />,
];
