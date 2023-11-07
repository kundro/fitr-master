import React, { useState } from "react";
import { Button } from "reactstrap";
import CustomDialog from "../../main/dialog";

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
    <>
      <Button className="btn btn-info" onClick={handleDialogOpen}>
        Rating Score: 142
      </Button>
      <CustomDialog
        open={open}
        handleClose={handleClose}
        title={UserDialogTitle}
        content={UserDialogContent}
      />
    </>
  );
};

export default ScoreButton;
