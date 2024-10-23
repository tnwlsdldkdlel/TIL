import { Dialog, DialogTitle } from "@mui/material";
import TweetReply from "./tweet-reply";
import { memo, useCallback, useEffect, useState } from "react";
import PostTweetReplyForm from "./post-tweet-reply-form";
import Tweet from "../tweet";
import { addReply, getReplyList } from "../../../api/replyApi";

function TweetReplyDialog({ isOpenReply, handleClose, ...data }) {
  const [replies, setReplies] = useState([]);
  const [tweet, setTweet] = useState(data);

  useEffect(() => {
    getData();
  }, []);

  const getData = useCallback(async () => {
    if (tweet.id) {
      const list = await getReplyList(tweet.id);
      setReplies(list);
    }
  }, [tweet.id]);

  const onSubmit = useCallback(
    async (input) => {
      if (input === "") return;

      try {
        const udpateCount = await addReply(input, tweet.id, tweet.user);
        await getData();
        setTweet((prevTweet) => ({
          ...prevTweet,
          count: udpateCount,
        }));
      } catch (error) {
        console.log(error);
      }
    },
    [tweet, getData]
  );

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
          <Tweet className="tweet" isReply={true} {...tweet}></Tweet>
          <div className="title">
            <p>댓글</p>
          </div>
          {replies.length > 0 ? (
            replies.map((reply, index) => {
              return (
                <TweetReply
                  key={reply.id}
                  isLast={index === replies.length - 1}
                  {...reply}
                />
              );
            })
          ) : (
            <div className="empty">아직 댓글이 없습니다.</div>
          )}
        </div>
        <div className="reply-form">
          <PostTweetReplyForm onSubmit={onSubmit} />
        </div>
      </div>
    </Dialog>
  );
}

export default memo(TweetReplyDialog);
