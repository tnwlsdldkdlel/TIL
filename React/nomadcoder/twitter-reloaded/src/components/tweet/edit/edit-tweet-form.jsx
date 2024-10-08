import { useState } from "react";
import "../edit/post-tweet-form.css";
import { auth, db, storage } from "../../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

export default function EditTweetForm({ handleClose, ...data }) {
  const [isLoading, setLoading] = useState(false);
  const [input, setInput] = useState(data);

  const onChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;

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
      const docRef = doc(db, "tweets", data.id);
      const photoRef = ref(storage, `tweets/${user.uid}/${data.id}`);

      if (input.photo) {
        if (data.photo) {
          await deleteObject(photoRef);
        }

        const result = await uploadBytes(photoRef, input.photo);
        const url = await getDownloadURL(result.ref);
        await updateDoc(docRef, {
          tweet: input.tweet,
          photo: url,
          updatedAt: Date.now(),
        });
      } else {
        await updateDoc(docRef, {
          tweet: input.tweet,
          updatedAt: Date.now(),
        });
      }

      handleClose();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="post-tweet-form" onSubmit={onSubmit}>
      <img
        src={
          input.photo === undefined || typeof input.photo === "string"
            ? input.photo
            : window.URL.createObjectURL(input.photo)
        }
      />
      <textarea
        rows={5}
        maxLength={180}
        className="text-area"
        placeholder="무슨 일이 일어나고 있나요?"
        name="tweet"
        value={input.tweet}
        onChange={onChange}
      ></textarea>
      <label className="file-btn" htmlFor="photo">
        사진 수정하기
      </label>
      <input
        className="file-input"
        type="file"
        id="photo"
        accept="image/*"
        name="photo"
        onChange={onChange}
      ></input>
      <input
        className="submit-btn"
        type="submit"
        value="수정하기"
        onClick={onSubmit}
      ></input>
    </form>
  );
}
