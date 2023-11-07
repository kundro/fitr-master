import { Route } from "react-router-dom";
import AboutUsPage from "./AboutPage";
import HelpPage from "./HelpPage";

export const infoRoutes = [
  <Route key="helpInfo" path="/help" exact render={(props) => <HelpPage />} />,
  <Route
    key="aboutUsInfo"
    path="/about"
    exact
    render={(props) => <AboutUsPage />}
  />,
];
