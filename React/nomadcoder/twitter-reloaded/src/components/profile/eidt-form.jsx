import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { useEffect } from "react";
import { getEditInfo, updatedUser } from "../../api/userApi";

function EditForm() {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [input, setInput] = useState({
    name: user.displayName,
    intro: "",
    prevIntro: "",
    password1: "",
    password2: "",
    prevPassword: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    getInfo();
  }, []);

  const getInfo = async () => {
    const result = await getEditInfo();
    setInput({ ...input, intro: result.intro, prevIntro: result.intro });
  };

  const onClickCancel = () => {
    navigate("/profile");
  };

  const onChangeInput = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const onClickUpdate = async (e) => {
    e.preventDefault();
    setError("");

    const { isError, message } = updatedUser(input);
    if (isError) {
      setError(message);
    } else {
      navigate("/profile");
    }
  };

  return (
    <form onSubmit={onClickUpdate}>
      <div className="edit-form">
        <div className="col">
          <p className="key">이름</p>
          <input
            className="value"
            type="text"
            value={input.name}
            name="name"
            onChange={onChangeInput}
            required
          ></input>
        </div>
        <div className="col">
          <p className="key">소개</p>
          <input
            className="value"
            type="text"
            value={input.intro}
            name="intro"
            onChange={onChangeInput}
          ></input>
        </div>
        <div className="col">
          <p className="key">현재 비밀번호</p>
          <input
            className="value"
            type="password"
            value={input.prevPassword}
            name="prevPassword"
            onChange={onChangeInput}
          ></input>
        </div>
        <div className="col">
          <p className="key">새 비밀번호</p>
          <input
            className="value"
            type="password"
            value={input.password1}
            name="password1"
            onChange={onChangeInput}
          ></input>
        </div>
        <div className="col">
          <p className="key">새 비밀번호 확인</p>
          <input
            className="value"
            type="password"
            value={input.password2}
            name="password2"
            onChange={onChangeInput}
          ></input>
        </div>
      </div>
      {error !== "" ? <div className="error-text">{error}</div> : null}
      <div className="btn">
        <button type="submit" className="edit-btn">
          수정
        </button>
        <button type="button" className="cancel-btn" onClick={onClickCancel}>
          취소
        </button>
      </div>
    </form>
  );
}

export default memo(EditForm);
