import { memo } from "react";
import "./post-tweet-form.css";

function PostTweetForm({ onSubmit, onChange, tweet }) {
  return (
    <form className="post-tweet-form" onSubmit={onSubmit}>
      <textarea
        rows={10}
        maxLength={300}
        className="text-area"
        placeholder="무슨 일이 일어나고 있나요?"
        name="tweet"
        value={tweet}
        onChange={onChange}
      ></textarea>
      <label className="file-btn" htmlFor="file">
        사진 업로드
      </label>
      <input
        className="file-input"
        type="file"
        id="file"
        accept="image/*"
        name="file"
        multiple
        onChange={onChange}
      ></input>
      <input
        className="submit-btn"
        type="submit"
        value="포스팅"
        onClick={onSubmit}
      ></input>
    </form>
  );
}

export default memo(PostTweetForm);
