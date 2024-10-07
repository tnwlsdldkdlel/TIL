import { useState } from "react";
import "./create-account.css";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { FirebaseErrorMessage } from "../common/firebase-error";
import { FirebaseError } from "firebase/app";

export default function CreateAccount() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [input, setInput] = useState({
    name: "",
    email: "",
    password1: "",
    password2: "",
  });

  const onChangeInput = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const onSubmitButton = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (input.password1 !== input.password2) {
        setError("🙅‍♀️ 비밀번호가를 다시 확인해주세요.");
        return false;
      }

      const credentials = await createUserWithEmailAndPassword(
        auth,
        input.email,
        input.password1
      );

      await updateProfile(credentials.user, { displayName: input.name });
      await addDoc(collection(db, "user"), {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        id: credentials.user.uid,
        name: input.name,
        photo: credentials.user.photoURL,
      });

      navigate("/");
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError(FirebaseErrorMessage(error));
      }
    }
  };

  return (
    <div className="create-account">
      <div className="title">어서오세요 👋</div>
      <form onSubmit={onSubmitButton}>
        <input
          name="name"
          placeholder="이름"
          type="text"
          value={input.name}
          onChange={onChangeInput}
          required
        />
        <input
          name="email"
          placeholder="이메일"
          type="email"
          value={input.email}
          onChange={onChangeInput}
          required
        />
        <input
          name="password1"
          placeholder="비밀번호"
          type="password"
          value={input.password1}
          onChange={onChangeInput}
          required
        />
        <input
          name="password2"
          placeholder="비밀번호 확인"
          type="password"
          value={input.password2}
          onChange={onChangeInput}
          required
        />
        {error !== "" ? <span className="error-text">{error}</span> : null}
        <input type="submit" value="회원가입" />
      </form>
      <span className="link-text">
        <Link to="/login">이미 계정이 있으신가요? 🚶‍♀️‍➡️</Link>
      </span>
    </div>
  );
}
