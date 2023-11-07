import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { IconButton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function CustomDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: any;
}) {
  const [onHover, setOnHover] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setOnHover(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{ textAlign: "center" }}>
          Profile
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            style={{
              position: "absolute",
              right: 12,
              top: 0,
              background: "none",
            }}
          >
            <FontAwesomeIcon
              size="xs"
              icon={faXmark}
              beat={onHover ? true : false}
              onMouseEnter={() => setOnHover(true)}
              onMouseLeave={() => setOnHover(false)}
              color="grey"
            />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <p>User Information</p>
          <div>
            <span style={{ color: "grey", fontSize: "14px" }}>Name:</span>&nbsp;
            {"Test"}
          </div>
          <div>
            <span style={{ color: "grey", fontSize: "14px" }}>Email:</span>
            &nbsp;
            {"Test@t.t"}
          </div>
          <div>
            <span style={{ color: "grey", fontSize: "14px" }}>
              Phone Number:
            </span>
            &nbsp;
            {"+1002223344"}
          </div>
        </DialogContent>
        <Button onClick={handleClose} color="error">
          Log Out
        </Button>
      </Dialog>
    </div>
  );
}
