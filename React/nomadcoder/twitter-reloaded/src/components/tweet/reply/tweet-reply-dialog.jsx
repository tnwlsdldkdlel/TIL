import { Dialog, DialogTitle } from "@mui/material";
import TweetReply from "./tweet-reply";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import PostTweetReplyForm from "./post-tweet-reply-form";
import Tweet from "../tweet";

export default function TweetReplyDialog({
  isOpenReply,
  handleClose,
  ...data
}) {
  const [replies, setReplies] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (!data.id) return;

    const repliesQuery = query(
      collection(db, "replies"),
      where("tweetId", "==", data.id)
    );

    // 실시간 댓글
    const unsubscribeReplies = onSnapshot(repliesQuery, (snapshot) => {
      const repliesData = snapshot.docs.map((doc) => {
        const replyData = doc.data();
        const replyId = doc.id;

        return {
          ...replyData,
          id: replyId,
          like: { isLiked: false, count: 0 }, // 초기값 설정
        };
      });

      setReplies(repliesData);

      repliesData.forEach((reply) => {
        const likesQuery = query(
          collection(db, "likes"),
          where("replyId", "==", reply.id)
        );

        // 조아요 업데이트
        onSnapshot(likesQuery, (likeSnapshot) => {
          const likeCount = likeSnapshot.docs.length;
          let likeId = 0;

          const isLiked = likeSnapshot.docs.some((likeDoc) => {
            if (likeDoc.data().userId === user.uid) {
              likeId = likeDoc.id;
              return true;
            }
            return false;
          });

          setReplies((prevReplies) =>
            prevReplies.map((prevReply) => {
              if (prevReply.id === reply.id) {
                return {
                  ...prevReply,
                  like: { isLiked, count: likeCount, id: likeId },
                };
              }
              return prevReply;
            })
          );
        });
      });
    });

    return () => {
      unsubscribeReplies();
    };
  }, [data.id]);

  return (
    <Dialog open={isOpenReply} onClose={handleClose}>
      <DialogTitle className="reply-dialog-title">
        <div className="info">Content</div>
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
      <div className="reply-dialog-content scrollable">
        <div style={{ flex: 1, overflowY: "auto" }}>
          <Tweet className="tweet" isReply={true} {...data}></Tweet>
          <div className="title">
            <p>Reply</p>
          </div>
          {replies.map((reply, index) => {
            return (
              <TweetReply
                key={reply.id}
                isLast={index === replies.length - 1}
                {...reply}
              />
            );
          })}
        </div>
        <div className="reply-form">
          <PostTweetReplyForm tweetId={data.id} />
        </div>
      </div>
    </Dialog>
  );
}
