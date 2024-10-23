import { memo, useState } from "react";
import "../tweet.css";

function PostTweetReplyForm({ onSubmit }) {
  const [input, setInput] = useState("");

  const onChange = (e) => {
    setInput(e.target.value);
  };

  const onClickSubmit = () => {
    onSubmit(input);
    setInput("");
  };

  return (
    <div className="post-tweet-form">
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
        onClick={onClickSubmit}
      ></input>
    </div>
  );
}

export default memo(PostTweetReplyForm);
