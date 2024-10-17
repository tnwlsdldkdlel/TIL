import { memo } from "react";

function RetweetForm({ retweet, onChange }) {
  return (
    <>
      <form className="post-tweet-form" style={{ marginBottom: "5px" }}>
        <textarea
          rows={5}
          maxLength={180}
          className="text-area"
          placeholder="무슨 일이 일어나고 있나요?"
          name="reply"
          value={retweet}
          onChange={onChange}
        ></textarea>
      </form>
    </>
  );
}

export default memo(RetweetForm);
