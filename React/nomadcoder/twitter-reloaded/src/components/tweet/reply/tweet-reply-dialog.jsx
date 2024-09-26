import { Dialog, DialogTitle } from "@mui/material";
import TweetReply from "./tweet-reply";
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../../firebase";
import PostTweetReplyForm from "./post-tweet-reply-form";

export default function TweetReplyDialog({ isOpenReply, handleClose }) {
  const [reply, setReply] = useState([]);

  useEffect(() => {
    const replyQuery = query(
      collection(db, "reply"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(replyQuery, (snapshot) => {
      const repliesData = snapshot.docs.map((doc) => {
        const replyData = doc.data();
        const replyId = doc.id;

        return {
          ...replyData,
          id: replyId,
        };
      });

      // 부모 상태에 트윗 데이터 설정
      setReply(repliesData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <Dialog
        className="detail-dialog"
        open={isOpenReply}
        onClose={handleClose}
      >
        <DialogTitle className="reply-dialog-title">
          <div className="info">답글달기</div>
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
        <PostTweetReplyForm />
        <TweetReply {...reply} />
      </Dialog>
    </>
  );
}
