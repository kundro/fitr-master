import { Redirect, Route } from "react-router-dom";
import Flow from "./Flow";
import FlowList from "./FlowList";

export { Flow, FlowList };

export const flowRoutes = [
  <Route
    key="flowsRoute1"
    path="/flows"
    exact
    render={(props) => <FlowList />}
  />,
  <Route
    key="flowsRoute2"
    path="/flows/:id(\d+)"
    exact
    render={(props) => <Flow id={props.match.params.id} />}
  />,
  <Route
    key="flowsRoute3"
    path="/flows/create"
    exact
    render={(props) => <Flow id={0} />}
  />,
];

export const flowRedirects = [
  <Redirect key="flowsRedirect1" from="/flows" to="/flows" />,
];
