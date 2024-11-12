import { useNavigate } from "react-router-dom";
import "../../styles/auth.css";
import { useState } from "react";
import JoinFailDialog from "../../components/dialog/JoinFailDialog";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase";
import { FirebaseError } from "firebase/app";
import { FirebaseErrorMessage } from "../../utils/firebaseErrorMessage";

const Join = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    email: "",
    nickname: "",
    password1: "",
    password2: "",
  });
  const [errorMesssage, setErrorMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const clickLogin = () => {
    navigate("/login");
  };

  const onChangeInput = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const validation = () => {
    setIsError(false);
    setErrorMessage("");

    // 1. 메일
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(input.email)) {
      setIsError(true);
      setErrorMessage("유효한 이메일로 입력해주세요.");
      return false;
    }

    // 2. 닉네임
    const nicknameRegex = /^[a-zA-Z0-9가-힣_-]{2,}$/;
    if (!nicknameRegex.test(input.nickname)) {
      setIsError(true);
      setErrorMessage("닉네임은 영문 2글자이상, 특수문자(-,_) 가능합니다.");
      return false;
    }

    // 3. 비밀번호
    if (
      input.password1 != input.password2 ||
      input.password1.length < 7 ||
      input.password2.length < 7
    ) {
      setIsError(true);
      setErrorMessage("비밀번호는 8글자이상 가능합니다.");

      return false;
    }

    return true;
  };

  const clickJoin = async () => {
    try {
      if (validation()) {
        const credentials = await createUserWithEmailAndPassword(
          auth,
          input.email,
          input.password1
        );

        await updateProfile(credentials.user, { displayName: input.nickname });
        navigate("/");
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        setIsError(true);
        setErrorMessage(FirebaseErrorMessage(error));
      }
    }
  };

  return (
    <div className="login">
      <h2>회원가입</h2>
      <div className="values">
        <input
          placeholder="이메일 계정"
          value={input.email}
          name="email"
          onChange={onChangeInput}
        ></input>
        <input
          placeholder="닉네임 (2글자이상, 특수문자(-,_))"
          name="nickname"
          value={input.nickname}
          onChange={onChangeInput}
        ></input>
        <input
          type="password"
          placeholder="비밀번호 (8글자이상)"
          value={input.password1}
          name="password1"
          onChange={onChangeInput}
        ></input>
        <input
          type="password"
          placeholder="비밀번호 확인"
          value={input.password2}
          name="password2"
          onChange={onChangeInput}
        ></input>
      </div>
      <div className="join clickable" onClick={clickLogin}>
        계정이 있으신가요?
      </div>
      <button type="button" className="login-btn clickable" onClick={clickJoin}>
        회원가입
      </button>
      <JoinFailDialog
        isOpen={isError}
        errorMesssage={errorMesssage}
      ></JoinFailDialog>
    </div>
  );
};

export default Join;
