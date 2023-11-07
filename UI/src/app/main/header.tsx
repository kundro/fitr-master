import React, { useState } from "react";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./main.scss";
import CustomDialog from "./dialog";

export default function Header() {
  const [open, setOpen] = useState(false);

  const handleUserDialogOpen = () => {
    setOpen(true);
  };

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
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <a className="nav-link" href="/">
                <span className="custom-link">HOME</span>
              </a>
            </li>
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
            <li className="nav-item">
              <a className="nav-link" href="#" onClick={handleUserDialogOpen}>
                <FontAwesomeIcon
                  icon={faUser}
                  bounce
                  size="2xl"
                  className="user-icon"
                />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <CustomDialog open={open} setOpen={setOpen} />
    </nav>
  );
}
