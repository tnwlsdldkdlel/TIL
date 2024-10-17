import { Dialog, DialogTitle } from "@mui/material";
import { memo, useCallback, useState } from "react";
import RetweetForm from "./tweet-retweet-form";
import { auth, db } from "../../../firebase";
import { addDoc, collection } from "firebase/firestore";
import RetweetContent from "./retweet-content";

function ReTweetDialog({
  isOpenReTweet,
  handleClose,
  userData,
  tweet,
  id,
  createdAt,
  images,
}) {
  const [retweet, setRetweet] = useState();
  const user = auth.currentUser;

  const onChange = useCallback((e) => {
    setRetweet(e.target.value);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!user || retweet === "" || retweet.length > retweet.maxLength) return;

    try {
      await addDoc(collection(db, "tweets"), {
        tweet: retweet,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        userId: user.uid,
        retweetId: id,
      });

      // 알람
      if (userData.id !== user.uid) {
        const content = `${user.displayName}님이 ${
          tweet.length > 10 ? tweet.substr(0, 10) + "..." : tweet
        }글을 리포스팅했습니다.`;
        await addDoc(collection(db, "alarm"), {
          userId: userData.id, // 리포스팅 당한 사람 uid
          targetId: user.uid, // 리포스팅한 사람 uid
          content: content,
          tweetId: id,
          isChecked: false,
          createdAt: Date.now(),
        });
      }

      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog
      open={isOpenReTweet}
      onClose={handleClose}
      PaperProps={{
        sx: {
          backgroundColor: "black",
          border: "1px solid white",
          borderRadius: "20px",
          resize: "none",
          width: "730px",
          height: "fit-content",
          color: "white",
          maxWidth: "730px",
        },
      }}
    >
      <DialogTitle className="reply-dialog-title">
        <div className="info">리포스팅</div>
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
          <RetweetContent
            user={userData}
            createdAt={createdAt}
            tweet={tweet}
            images={images}
          />
        </div>
        <div className="btn">
          <input
            type="submit"
            className="submit-btn"
            onClick={onSubmit}
            value="리포스팅"
          ></input>
        </div>
      </div>
    </Dialog>
  );
}

export default memo(ReTweetDialog);
