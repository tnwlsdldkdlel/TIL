export default function RetweetForm({ retweet, onChange }) {
  return (
    <>
      <form className="post-tweet-form" style={{ marginBottom: "5px" }}>
        <textarea
          rows={5}
          maxLength={180}
          className="text-area"
          placeholder="What's on your mind?"
          name="reply"
          value={retweet}
          onChange={onChange}
        ></textarea>
      </form>
    </>
  );
}
