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
  const history = useHistory();

  const handleLogOut = () => {
    history.push("/login");
  };

  const handleUserDialogOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOnHover(false);
  };

  const UserDialogTitle = "Profile";

  const UserDialogContent = (
    <div className="d-flex">
      <div className="mr-3">
        <p>User Information</p>
        <div>
          <span style={{ color: "grey", fontSize: "14px" }}>Name:</span>
          &nbsp;
          {"Test Subtest"}
        </div>
        <div>
          <span style={{ color: "grey", fontSize: "14px" }}>Email:</span>
          &nbsp;
          {"Test@test.te"}
        </div>
        <div>
          <span style={{ color: "grey", fontSize: "14px" }}>Phone Number:</span>
          &nbsp;
          {"+1002223344"}
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
        <p>User Group</p>
        <div>
          <span style={{ color: "grey", fontSize: "14px" }}>Group Name:</span>
          &nbsp;
          {"Student"}
        </div>
      </div>
    </div>
  );

  const UserDialogButtons = (
    <>
      <Button onClick={handleClose} color="warning">
        Reset Password
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
            {!authPage && (
              <li className="nav-item">
                <a className="nav-link" href="/">
                  <span className="custom-link">HOME</span>
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
            {!authPage && (
              <li
                className="nav-item"
                onMouseMove={() => setOnHover(true)}
                onMouseLeave={() => setOnHover(false)}
              >
                <a
                  className="nav-link"
                  href="help/"
                  onClick={handleUserDialogOpen}
                >
                  <FontAwesomeIcon
                    icon={faUser}
                    bounce={onHover}
                    size="2xl"
                    className="user-icon"
                  />
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
