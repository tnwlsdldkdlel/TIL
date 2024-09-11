import { useState } from "react";

function useInput1() {
  const [input, setInput] = useState("");
  const onChange = (e) => {
    setInput(e.target.value);
  };

  return [input, onChange];
}

export default useInput1;
