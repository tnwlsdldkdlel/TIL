import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import "./tweet.css";
import EditTweetForm from "./edit-tweet-form";
import { Fragment } from "react";

export default function EditTweetDialog({ isOpen, handleClose, ...data }) {
  return (
    <Fragment>
      <Dialog className="edit-dialog" open={isOpen} onClose={handleClose}>
        <DialogTitle className="dialog-title">
          Edit
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
        <DialogContent className="scrollable">
          <EditTweetForm {...data} handleClose={handleClose}></EditTweetForm>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
