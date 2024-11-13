import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";
import { forwardRef, useEffect, useState } from "react";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const JoinFailDialog = ({ isOpen, errorMesssage }) => {
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle></DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {errorMesssage}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>확인</Button>
      </DialogActions>
    </Dialog>
  );
};

export default JoinFailDialog;
