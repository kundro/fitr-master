import React, { useState } from "react";
import { Button } from "reactstrap";
import CustomDialog from "../../main/dialog";
import { Typography } from "@mui/material";

const ScoreButton = () => {
  const [open, setOpen] = useState(false);

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const UserDialogTitle = "Rating Score";

  const UserDialogContent = (
    <div className="d-flex">
      <div className="mr-3">
        <p>Completed tasks</p>
      </div>
    </div>
  );

  return (
    <div className="help-button-container">
      <Button className="btn btn-info" onClick={handleDialogOpen}>
        Rating Score&nbsp;<Typography color={"yellow"}>{"142"}</Typography>
      </Button>
      <CustomDialog
        open={open}
        handleClose={handleClose}
        title={UserDialogTitle}
        content={UserDialogContent}
      />
    </div>
  );
};

export default ScoreButton;
