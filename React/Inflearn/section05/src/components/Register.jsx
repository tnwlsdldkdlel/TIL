import { useState, useRef } from "react";

const Register = () => {
  const [input, setInput] = useState({
    name: "",
    brith: "",
    country: "",
    bio: "",
  });
  const countRef = useRef(0);
  const inputRef = useRef();

  const onChnage = (e) => {
    countRef.current++;
    console.log(countRef.current);
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const onSubmit = (e) => {
    if (input.name === "") {
      // 이름을 입력하는 DOM 요소 포커스
      inputRef.current.focus();
    }
  };

  return (
    <div>
      <button
        onClick={() => {
          refObj.current++;
          console.log(refObj.current);
        }}
      >
        ref +1
      </button>
      <div>
        <input
          ref={inputRef}
          value={input.name}
          name="name"
          onChange={onChnage}
          placeholder="이름"
        ></input>
      </div>
      <div>
        <input
          value={input.brith}
          name="brith"
          onChange={onChnage}
          type="date"
        ></input>
      </div>
      <div>
        <select value={input.country} name="country" onChange={onChnage}>
          <option></option>
          <option value={"kr"}>한국</option>
          <option value={"us"}>미국</option>
          <option value={"uk"}>영국</option>
        </select>
      </div>
      <div>
        <textarea value={input.bio} name="bio" onChange={onChnage}></textarea>
      </div>
      <button onClick={onSubmit}>제출</button>
    </div>
  );
};

export default Register;
