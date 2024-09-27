import { Dialog, DialogTitle } from "@mui/material";
import TweetReply from "./tweet-reply";
import PostTweetReplyForm from "./post-tweet-reply-form";
import Tweet from "../tweet";

export default function ReTweetDialog({ isOpenReTweet, handleClose, ...data }) {
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
      <div className="reply-dialog-content scrollable">
        {/* <div style={{ flex: 1, overflowY: "auto" }}>
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
        </div> */}
      </div>
    </Dialog>
  );
}
