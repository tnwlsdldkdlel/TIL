import { useNavigate } from "react-router-dom";
import "../../styles/auth.css";
import { useState } from "react";
import JoinFailDialog from "../../components/dialog/JoinFailDialog";
import { FirebaseErrorMessage } from "../../utils/firebaseErrorMessage";
import { useDispatch } from "react-redux";
import { loginUser } from "../../features/auth/authSlice";
import MainLogo from "../../layouts/MainLogo";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMesssage, setErrorMesssage] = useState("");

  const clickJoin = () => {
    navigate("/join");
  };

  const changeInput = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const clickLogin = async () => {
    setIsError(false);
    setIsLoading(true);

    try {
      await dispatch(loginUser(input)).unwrap();
      navigate("/");
    } catch (error) {
      setIsError(true);
      setErrorMesssage(FirebaseErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const keyDown = (e) => {
    if (e.key === "Enter") {
      clickLogin();
    }
  };

  return (
    <div className="login">
      <MainLogo />
      <h2>로그인</h2>
      <div className="values">
        <input
          placeholder="이메일 계정"
          value={input.email}
          name="email"
          onChange={changeInput}
          onKeyDown={(e) => keyDown(e)}
        ></input>
        <input
          type="password"
          placeholder="비밀번호"
          value={input.password}
          name="password"
          onChange={changeInput}
          onKeyDown={(e) => keyDown(e)}
        ></input>
      </div>
      <div className="join clickable" onClick={clickJoin}>
        계정이 없으신가요?
      </div>
      <button
        className={`login-btn clickable ${isLoading ? "loading" : ""}`}
        onClick={clickLogin}
        disabled={isLoading}
      >
        {isLoading ? "로그인중..." : "로그인"}
      </button>
      <JoinFailDialog
        isOpen={isError}
        errorMesssage={errorMesssage}
      ></JoinFailDialog>
    </div>
  );
};

export default Login;
