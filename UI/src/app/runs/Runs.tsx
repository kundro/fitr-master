import { Redirect, Route } from "react-router-dom";
import RunNode from "./RunNode";
import RunList from "./RunList";
import RunFlow from "./RunFlow";

export { RunList };

export const runRoutes = [
  <Route key="runsRoute1" path="/run" exact render={(props) => <RunList />} />,
  <Route
    key="runsRoute2"
    path="/run/flows/:id(\d+)"
    exact
    render={(props) => <RunFlow id={props.match.params.id} />}
  />,
  <Route
    key="runsRoute3"
    path="/run/nodes/:id(\d+)"
    exact
    render={(props) => <RunNode id={props.match.params.id} />}
  />,
];

export const runRedirects = [
  <Redirect
    key="runsRedirect1"
    from="/run/flows/:id(\d+)"
    to="/run/flows/:id(\d+)"
  />,
  <Redirect
    key="runsRedirect2"
    from="/run/nodes/:id(\d+)"
    to="/run/nodes/:id(\d+)"
  />,
  <Redirect key="runsRedirect3" from="/run" to="/run" />,
];
