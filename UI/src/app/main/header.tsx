import React, { useState } from "react";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./main.scss";
import CustomDialog from "./dialog";
import LanguageSelect from "../components/LanguageSelect/LanguageSelect";
import Button from "@mui/material/Button";
import { useHistory } from "react-router";

export default function Header({ authPage }: { authPage?: boolean }) {
  const [open, setOpen] = useState(false);
  const [onHover, setOnHover] = useState(false);
  const [user, setUser] = useState<any>(null);
  const history = useHistory();

  React.useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    history.push("/login");
  };

  const getDashboardPath = () => {
    if (!user || !user.role) return "/";
    const role = user.role.toLowerCase();
    if (role === "admin") return "/admin";
    if (role === "teacher") return "/teacher";
    if (role === "student") return "/student";
    return "/";
  };

  const handleUserDialogOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOnHover(false);
  };

  const UserDialogTitle = "Profile";

  const UserDialogContent = user ? (
    <div className="d-flex">
      <div className="mr-3">
        <p>User Information</p>
        <div>
          <span style={{ color: "grey", fontSize: "14px" }}>Name:</span>
          &nbsp;
          {user.firstName} {user.lastName}
        </div>
        <div>
          <span style={{ color: "grey", fontSize: "14px" }}>Email:</span>
          &nbsp;
          {user.email}
        </div>
        <div>
          <span style={{ color: "grey", fontSize: "14px" }}>Status:</span>
          &nbsp;
          {user.isApproved ? "Approved" : "Pending Approval"}
        </div>
      </div>
      <div
        style={{
          borderLeft: "1px solid #d3d3d3",
          height: "120px",
          margin: "0 10px",
        }}
      ></div>
      <div className="pl-3">
        <p>User Role</p>
        <div>
          <span style={{ color: "grey", fontSize: "14px" }}>Role:</span>
          &nbsp;
          {user.role}
        </div>
      </div>
    </div>
  ) : (
    <div>Please log in</div>
  );

  const UserDialogButtons = (
    <>
      <Button onClick={handleClose} color="primary">
        Close
      </Button>
      <Button onClick={handleLogOut} color="error">
        Log Out
      </Button>
    </>
  );

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light"
      style={{ background: "linear-gradient(to bottom, #343a40, #6d7fec)" }}
    >
      <div className="container">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <LanguageSelect />
            </li>
          </ul>

          <ul className="navbar-nav ml-auto">
            {!authPage && user && (
              <li className="nav-item">
                <a className="nav-link" href="/">
                  <span className="custom-link">HOME</span>
                </a>
              </li>
            )}
            {!authPage && user && (
              <li className="nav-item">
                <a className="nav-link" href={getDashboardPath()}>
                  <span className="custom-link">DASHBOARD</span>
                </a>
              </li>
            )}
            <li className="nav-item">
              <a className="nav-link" href="about">
                <span className="custom-link">ABOUT US</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="help">
                <span className="custom-link">HELP</span>
              </a>
            </li>
            {!authPage && user && (
              <li
                className="nav-item"
                onMouseMove={() => setOnHover(true)}
                onMouseLeave={() => setOnHover(false)}
              >
                <a className="nav-link" href="#" onClick={handleUserDialogOpen}>
                  <FontAwesomeIcon
                    icon={faUser}
                    bounce={onHover}
                    size="2xl"
                    className="user-icon"
                  />
                </a>
              </li>
            )}
            {!authPage && !user && (
              <li className="nav-item">
                <a className="nav-link" href="/login">
                  <span className="custom-link">LOGIN</span>
                </a>
              </li>
            )}
            {!authPage && user && (
              <li className="nav-item">
                <a className="nav-link" href="#" onClick={handleLogOut}>
                  <span className="custom-link">LOGOUT</span>
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <CustomDialog
        open={open}
        handleClose={handleClose}
        title={UserDialogTitle}
        content={UserDialogContent}
        buttons={UserDialogButtons}
      />
    </nav>
  );
}
