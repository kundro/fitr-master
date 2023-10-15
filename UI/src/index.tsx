import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/scss/argon-design-system-react.scss?v1.1.0";
import "./assets/scss/site.scss";
import "./assets/scss/icomoon.scss";
import "react-toastify/dist/ReactToastify.css";

import App from "./app/App";
import { platformRoutes, platformRedirects } from "./app/platforms/Platforms";
import { flowRoutes, flowRedirects } from "./app/flows/Flows";
import { runRedirects, runRoutes } from "./app/runs/Runs";
import { initializeIcons } from "@uifabric/icons";
import { ToastContainer } from "react-toastify";

initializeIcons();

ReactDOM.render(
  <div className="app-container">
    <BrowserRouter>
      <Switch>
        <Route key="rootRoute" path="/" exact>
          <App />
        </Route>
        {platformRoutes}
        {flowRoutes}
        {runRoutes}

        {platformRedirects}
        {flowRedirects}
        {runRedirects}
        <Redirect key="rootRedirect" to="/" />
      </Switch>
    </BrowserRouter>

    <ToastContainer />
  </div>,
  document.getElementById("root")
);
