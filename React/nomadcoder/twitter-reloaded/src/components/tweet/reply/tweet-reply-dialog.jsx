import { Dialog, DialogTitle } from "@mui/material";
import TweetReply from "./tweet-reply";
import { memo, useCallback, useEffect, useState } from "react";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase";
import PostTweetReplyForm from "./post-tweet-reply-form";
import Tweet from "../tweet";

function TweetReplyDialog({ isOpenReply, handleClose, ...data }) {
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    getData();
  }, [isOpenReply]);

  const getData = useCallback(async () => {
    if (!data.id) return;
    delete data.username;

    const repliesQuery = query(
      collection(db, "replies"),
      where("tweetId", "==", data.id),
      orderBy("createdAt", "desc")
    );

    // 실시간 댓글
    const snapshot = await getDocs(repliesQuery);
    const repliesData = snapshot.docs.map((doc) => {
      const replyData = doc.data();
      const replyId = doc.id;

      return {
        ...replyData,
        id: replyId,
        like: { isLiked: false, count: 0 },
        user: { id: replyData.userId, name: "", photo: "" },
      };
    });

    setReplies(repliesData);

    repliesData.forEach(async (reply) => {
      const likesQuery = query(
        collection(db, "likes"),
        where("replyId", "==", reply.id)
      );

      onSnapshot(likesQuery, (likeSnapshot) => {
        const likeCount = likeSnapshot.docs.length;
        let likeId = 0;

        const isLiked = likeSnapshot.docs.some((likeDoc) => {
          if (likeDoc.data().userId === reply.user.id) {
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

      const userQuery = query(
        collection(db, "user"),
        where("id", "==", reply.user.id)
      );

      const userSnapshot = await getDocs(userQuery);
      const user = userSnapshot.docs[0].data();

      setReplies((prevReplies) =>
        prevReplies.map((prevReply) => {
          if (prevReply.user.id === user.id) {
            return {
              ...prevReply,
              user: {
                id: user.id,
                name: user.name,
                photo: user.photo || "",
              },
            };
          }
          return prevReply;
        })
      );
    });
  }, [data.id]);

  return (
    <Dialog
      open={isOpenReply}
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
        <div className="info">내용</div>
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
        <div style={{ flex: 1, overflowY: "unset" }}>
          <Tweet className="tweet" isReply={true} {...data}></Tweet>
          <div className="title">
            <p>댓글</p>
          </div>

          {replies.length > 0 ? (
            replies.map((reply, index) => {
              return (
                <TweetReply
                  key={reply.id}
                  isLast={index === replies.length - 1}
                  userId={data.user.id}
                  tweetId={data.id}
                  like={reply.like}
                  id={reply.id}
                  content={reply.reply}
                  userData={reply.user}
                  createdAt={reply.createdAt}
                />
              );
            })
          ) : (
            <div className="empty">아직 댓글이 없습니다.</div>
          )}
        </div>
        <div className="reply-form">
          <PostTweetReplyForm
            tweetId={data.id}
            userId={data.user != undefined ? data.user.id : ""}
            tweet={
              data.tweet > 10 ? data.tweet.substr(0, 10) + "..." : data.tweet
            }
            getData={getData}
          />
        </div>
      </div>
    </Dialog>
  );
}

export default memo(TweetReplyDialog);
