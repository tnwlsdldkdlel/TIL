import { useState } from "react";
import { auth, db } from "../../../firebase";
import "../tweet.css";
import { addDoc, collection } from "firebase/firestore";

export default function PostTweetReplyForm({ tweetId }) {
  const [isLoading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const user = auth.currentUser;

  const onChange = (e) => {
    setInput(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!user || isLoading || input === "") return;

    try {
      setLoading(true);
      await addDoc(collection(db, "replies"), {
        reply: input,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
        tweetId: tweetId,
      });

      setInput("");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="post-tweet-form" onSubmit={onSubmit}>
      <textarea
        rows={5}
        maxLength={180}
        className="text-area"
        placeholder="What's on your mind?"
        name="reply"
        value={input}
        onChange={onChange}
      ></textarea>
      <input
        className="submit-btn"
        type="submit"
        value={isLoading ? "Posting..." : "Post Reply"}
        onClick={onSubmit}
      ></input>
    </form>
  );
}
