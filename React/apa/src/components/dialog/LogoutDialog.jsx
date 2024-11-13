import { Dialog, Slide } from "@mui/material";
import { forwardRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/dialog.css";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const LogoutDialog = ({ isOpen, handleClose }) => {
  const [open, setOpen] = useState(isOpen);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const clickLogout = async () => {
    setIsLoading(true);
    try {
      await dispatch(logoutUser()).unwrap();
      handleClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      sx={{
        "& .MuiPaper-root": {
          boxShadow: "none",
          border: "3px solid #62a9f3",
          background: "white",
          color: "#62a9f3",
          borderRadius: "20px",
          resize: "none",
          alignItems: "center",
        },
      }}
    >
      <div className="dialog-content">로그아웃 하시겠습니까?</div>
      <div className="dialog-btn">
        <button className="confirm clickable" onClick={clickLogout}>
          확인
        </button>
        <button className="cancle clickable" onClick={handleClose}>
          취소
        </button>
      </div>
    </Dialog>
  );
};

export default LogoutDialog;
