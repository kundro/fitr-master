import React from "react";
import "./App.scss";
import Navbar from "./components/Navbar";
import { Icon } from "@fluentui/react";
import { initializeIcons } from "@uifabric/icons";

const cardStyle = {
  fontSize: "6rem",
  padding: "0 2rem 2rem 2rem",
};

const cardTextStyle: React.CSSProperties = {
  fontWeight: 600,
  textAlign: "center",
};

const renderButtonCard = (name: string, iconName: string, href: string) => (
  <div className="card mx-4">
    <a className="text-default" href={href}>
      <div className="card-header text-default" style={cardTextStyle}>
        {name}
      </div>
      <div className="card-body">
        <Icon iconName={iconName} style={cardStyle} />
      </div>
    </a>
  </div>
);

function App() {
  initializeIcons(undefined, { disableWarnings: true });
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const isAdmin = user?.role?.toLowerCase() === "admin";
  const isTeacher = user?.role?.toLowerCase() === "teacher";
  const isStudent = user?.role?.toLowerCase() === "student";

  return (
    <Navbar>
      <div className="container">
        <div className="row justify-content-center">
          {(isAdmin) && renderButtonCard("Platforms", "ConnectVirtualMachine", "platforms")}
          {(isAdmin || isTeacher) && renderButtonCard("Flows", "HighlightMappedShapes", "flows")}
          {renderButtonCard("Runs", "ServerProcesses", "run")}
        </div>
      </div>
    </Navbar>
  );
}

export default App;
