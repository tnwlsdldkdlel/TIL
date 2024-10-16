import { useState } from "react";
import { auth, db } from "../../../firebase";
import "../tweet.css";
import { addDoc, collection } from "firebase/firestore";

export default function PostTweetReplyForm({
  tweetId,
  userId,
  tweet,
  getData,
}) {
  const [input, setInput] = useState("");
  const user = auth.currentUser;

  const onChange = (e) => {
    setInput(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!user || input === "") return;

    try {
      const doc = await addDoc(collection(db, "replies"), {
        reply: input,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        userId: user.uid,
        tweetId: tweetId,
      });

      if (userId !== user.uid) {
        const content = `${user.displayName}님이 ${tweet}글에 댓글을 달았습니다.`;
        await addDoc(collection(db, "alarm"), {
          userId: userId, // 댓글을 당한 사람 uid
          targetId: user.uid, // 댓글을 한 사람 uid
          content: content,
          tweetId: tweetId,
          replyId: doc.id,
          isChecked: false,
          createdAt: Date.now(),
        });
      }

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
