import { memo, useState } from "react";
import "../tweet.css";
import { setReply } from "../../../api/replyApi";

function PostTweetReplyForm({ tweetId, userId, getData }) {
  const [input, setInput] = useState("");

  const onChange = (e) => {
    setInput(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (input === "") return;

    try {
      await setReply(input, tweetId, userId);

      getData();
      setInput("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className="post-tweet-form" onSubmit={onSubmit}>
      <textarea
        rows={5}
        maxLength={180}
        className="text-area"
        placeholder="댓글을 남겨주세요!"
        name="reply"
        value={input}
        onChange={onChange}
      ></textarea>
      <input
        className="submit-btn"
        type="submit"
        value="댓글 달기"
        onClick={onSubmit}
      ></input>
    </form>
  );
}

export default memo(PostTweetReplyForm);
