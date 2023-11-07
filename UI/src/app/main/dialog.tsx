import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { IconButton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function CustomDialog({
  open,
  handleClose,
  title,
  content,
  buttons,
}: {
  open: boolean;
  handleClose: any;
  title: any;
  content: any;
  buttons?: any;
}) {
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{ textAlign: "center", width: "500px" }}>
          {title}
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
            <FontAwesomeIcon size="xs" icon={faXmark} color="grey" />
          </IconButton>
        </DialogTitle>
        <DialogContent>{content}</DialogContent>
        {buttons}
      </Dialog>
    </div>
  );
}
