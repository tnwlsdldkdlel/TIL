import { Dialog, DialogTitle } from "@mui/material";
import Tweet from "../tweet";
import { useState } from "react";
import RetweetForm from "./tweet-retweet-form";
import { auth, db } from "../../../firebase";
import { addDoc, collection } from "firebase/firestore";

export default function ReTweetDialog({ isOpenReTweet, handleClose, ...data }) {
  const [retweet, setRetweet] = useState();
  const [isLoading, setIsLoading] = useState();
  const user = auth.currentUser;

  const onChange = (e) => {
    setRetweet(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (
      !user ||
      isLoading ||
      retweet === "" ||
      retweet.length > retweet.maxLength
    )
      return;

    try {
      setIsLoading(true);
      await addDoc(collection(db, "tweets"), {
        tweet: retweet,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
        retweetId: data.id,
      });

      handleClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpenReTweet} onClose={handleClose}>
      <DialogTitle className="reply-dialog-title">
        <div className="info">Re Tweet</div>
        <div className="close-btn" onClick={handleClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </DialogTitle>
      <div className="retweet-dialog-content scrollable">
        <div className="content">
          <RetweetForm retweet={retweet} onChange={onChange} />
          <Tweet isRetweet={true} isReply={true} {...data} />
        </div>
        <div className="btn">
          <input
            type="submit"
            className="submit-btn"
            onClick={onSubmit}
            value={isLoading ? "Posting..." : "Re Tweet"}
          ></input>
        </div>
      </div>
    </Dialog>
  );
}
