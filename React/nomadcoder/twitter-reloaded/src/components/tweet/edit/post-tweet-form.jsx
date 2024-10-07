import { useState } from "react";
import "./post-tweet-form.css";
import { auth, db, storage } from "../../../firebase";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function PostTweetForm() {
  const [isLoading, setLoading] = useState(false);
  const [input, setInput] = useState({});

  const onChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;

    if (name === "file") {
      value = e.target.files[0];
    }

    setInput({ ...input, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (
      !user ||
      isLoading ||
      input.tweet === "" ||
      input.tweet.length > input.tweet.maxLength
    )
      return;

    try {
      setLoading(true);
      const doc = await addDoc(collection(db, "tweets"), {
        tweet: input.tweet,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        userId: user.uid,
      });

      if (input.file) {
        const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);
        const result = await uploadBytes(locationRef, input.file);
        const url = await getDownloadURL(result.ref);
        updateDoc(doc, { photo: url });
      }

      setInput({ tweet: "", file: null });
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
        placeholder="무슨 일이 일어나고 있나요?"
        name="tweet"
        value={input.tweet}
        onChange={onChange}
      ></textarea>
      <label className="file-btn" htmlFor="file">
        {input.file ? "사집업로드 완료 ✅" : "사진 업로드"}
      </label>
      <input
        className="file-input"
        type="file"
        id="file"
        accept="image/*"
        name="file"
        onChange={onChange}
      ></input>
      <input
        className="submit-btn"
        type="submit"
        value={isLoading ? "포스팅 중..." : "포스팅"}
        onClick={onSubmit}
      ></input>
    </form>
  );
}
