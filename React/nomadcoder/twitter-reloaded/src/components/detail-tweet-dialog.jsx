import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import "./tweet.css";

export default function DetailTweetDialog({ isOpen, handleClose, ...data }) {
  console.log(isOpen);
  return (
    <>
      <Dialog className="detail-dialog" open={isOpen} onClose={handleClose}>
        <DialogTitle className="detail-dialog-title">
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
        <DetailTweetDialog className="scrollable">
          <img src={data.photo} />
          <p>{data.tweet}</p>
        </DetailTweetDialog>
      </Dialog>
    </>
  );
}
