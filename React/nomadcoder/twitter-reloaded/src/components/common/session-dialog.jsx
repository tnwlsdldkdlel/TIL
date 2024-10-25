import { Dialog, DialogTitle } from "@mui/material";
import { memo, useEffect, useState } from "react";
import "../follow/follower.css";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

function SessionDialog({ isOpen }) {
  const navigate = useNavigate();
  const [dialogOpen, isDialogOpen] = useState(false);

  useEffect(() => {
    isDialogOpen(isOpen);
  }, [isOpen]);

  const handleClose = async () => {
    isDialogOpen(true);

    await auth.signOut();
    navigate("/login", { replace: true });
  };

  return (
    <Dialog
      className="follow-remove-dialog"
      open={dialogOpen}
      onClose={handleClose}
      PaperProps={{
        sx: {
          backgroundColor: "black",
          border: "1px solid white",
          borderRadius: "20px",
          resize: "none",
          width: "500px",
          height: "fit-content",
          color: "white",
          maxWidth: "500px",
        },
      }}
    >
      <DialogTitle></DialogTitle>
      <div className="content">
        <div>로그인 상태가 만료되었습니다. </div>
        <div>계속 사용하려면 다시 로그인해 주세요 😓</div>
      </div>
      <div className="btn" style={{ marginTop: "unset" }}>
        <button className="cancel" onClick={handleClose}>
          확인
        </button>
      </div>
    </Dialog>
  );
}

export default memo(SessionDialog);
