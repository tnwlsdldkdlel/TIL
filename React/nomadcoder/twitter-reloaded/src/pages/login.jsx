import { useState } from "react";
import "./create-account.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import GithubButton from "../components/auth/github-btn";
import { auth } from "../firebase";

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const onChangeInput = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const onSubmitButton = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, input.email, input.password);
      navigate("/");
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError(error.message);
      }
    }
  };

  return (
    <div className="create-account">
      <h1 className="title">어서오세요 👋</h1>
      <form>
        <input
          name="email"
          placeholder="이메일"
          type="email"
          value={input.email}
          onChange={onChangeInput}
          required
        />
        <input
          name="password"
          placeholder="비밀번호"
          type="password"
          value={input.password}
          onChange={onChangeInput}
          required
        />
        <input type="submit" value="로그인" onClick={onSubmitButton} />
      </form>
      {error !== "" ? <span className="error-text">{error}</span> : null}
      <span className="link-text">
        <Link to="/create-account">계정이 없으신가요? 🚶‍♀️‍➡️</Link>
      </span>
      <GithubButton></GithubButton>
    </div>
  );
}
