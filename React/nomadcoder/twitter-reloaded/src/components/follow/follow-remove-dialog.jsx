import { Dialog, DialogTitle } from "@mui/material";
import "./follower.css";
import { memo } from "react";

function FollowRemoveDialog({
  isOpen,
  handleClose,
  photo,
  name,
  onClickRemoveFollow,
}) {
  return (
    <Dialog
      className="follow-remove-dialog"
      open={isOpen}
      onClose={handleClose}
      PaperProps={{
        sx: {
          backgroundColor: "black",
          border: "1px solid white",
          borderRadius: "20px",
          resize: "none",
          width: "fit-content",
          height: "fit-content",
          color: "white",
          maxWidth: "fit-content",
        },
      }}
      s
    >
      <DialogTitle className="dialog-title">
        <div className="close-btn" onClick={handleClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </div>
      </DialogTitle>
      <div className="content">
        {photo ? (
          <img className="photo" src={photo}></img>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </>
        )}
        <div style={{ fontWeight: "bolder" }}>팔로워를 삭제하시겠어요?</div>
        <div style={{ color: "#9e9c9c" }}>
          {name}님은 팔로워 리스트에서 삭제된 사실을 알 수 없습니다.
        </div>
      </div>
      <div className="btn">
        <button className="remove" onClick={onClickRemoveFollow}>
          삭제
        </button>
        <button className="cancel" onClick={handleClose}>
          취소
        </button>
      </div>
    </Dialog>
  );
}

export default memo(FollowRemoveDialog);
