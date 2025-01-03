import { useState } from "react";
import "./create-account.css";
import { browserLocalPersistence, setPersistence } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import GithubButton from "../components/auth/github-btn";
import { auth } from "../firebase";
import { userLogin } from "../api/authApi";
import GoogleBtn from "../components/auth/google-btn";
import { FirebaseErrorMessage } from "../common/firebase-error";

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
      // 세션 local로 저장
      await setPersistence(auth, browserLocalPersistence);
      await userLogin(input.email, input.password);

      navigate("/");
    } catch (error) {
      console.log(error);
      if (error instanceof FirebaseError) {
        setError(FirebaseErrorMessage(error));
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
      <div className="login-btn">
        <GithubButton></GithubButton>
        <GoogleBtn></GoogleBtn>
      </div>
    </div>
  );
}
