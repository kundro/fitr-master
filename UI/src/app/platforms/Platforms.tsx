import { Redirect, Route } from "react-router-dom";
import Platform from "./Platform";
import PlatformList from "./PlatformList";
import PlatformNode from "./PlatformNode";
import PlatformNodePin from "./PlatformNodePin";

export { Platform, PlatformList };

export const platformRoutes = [
  <Route
    key="platformsRoute1"
    path="/platforms"
    exact
    render={(props) => <PlatformList />}
  />,
  <Route
    key="platformsRoute2"
    path="/platforms/:id(\d+)"
    exact
    render={(props) => <Platform id={props.match.params.id} />}
  />,
  <Route
    key="platformsRoute3"
    path="/platforms/create"
    exact
    render={(props) => <Platform id={0} />}
  />,
  <Route
    key="platformsRoute4"
    path="/platforms/:platformId(\d+)/nodes/:id(\d+)"
    exact
    render={(props) => (
      <PlatformNode
        id={props.match.params.id}
        platformId={props.match.params.platformId}
      />
    )}
  />,
  <Route
    key="platformsRoute5"
    path="/platforms/:platformId(\d+)/nodes/create"
    exact
    render={(props) => (
      <PlatformNode id={0} platformId={props.match.params.platformId} />
    )}
  />,
  <Route
    key="platformsRoute6"
    path="/platforms/:platformId(\d+)/nodes/:nodeId(\d+)/pins/create"
    exact
    render={(props) => (
      <PlatformNodePin
        id={0}
        platformId={props.match.params.platformId}
        nodeId={props.match.params.nodeId}
      />
    )}
  />,
  <Route
    key="platformsRoute7"
    path="/platforms/:platformId(\d+)/nodes/:nodeId(\d+)/pins/:id(\d+)"
    exact
    render={(props) => (
      <PlatformNodePin
        id={props.match.params.id}
        platformId={props.match.params.platformId}
        nodeId={props.match.params.nodeId}
      />
    )}
  />,
];

export const platformRedirects = [
  <Redirect
    key="platformsRedirect1"
    from="/platforms/:platformId(\d+)/nodes/:nodeId(\d+)/pins/:pinId(\d+)"
    to="/platforms/:platformId(\d+)/nodes/:nodeId(\d+)/pins/:pinId(\d+)"
  />,
  <Redirect
    key="platformsRedirect2"
    from="/platforms/:platformId(\d+)/nodes/:nodeId(\d+)/pins"
    to="/platforms/:platformId(\d+)/nodes/:nodeId(\d+)/pins"
  />,
  <Redirect
    key="platformsRedirect3"
    from="/platforms/:platformId(\d+)/nodes/:nodeId(\d+)"
    to="/platforms/:platformId(\d+)/nodes/:nodeId(\d+)"
  />,
  <Redirect
    key="platformsRedirect4"
    from="/platforms/:platformId(\d+)/nodes"
    to="/platforms/:platformId(\d+)/nodes"
  />,
  <Redirect
    key="platformsRedirect5"
    from="/platforms/:platformId(\d+)"
    to="/platforms/:platformId(\d+)"
  />,
  <Redirect key="platformsRedirect6" from="/platforms" to="/platforms" />,
];
