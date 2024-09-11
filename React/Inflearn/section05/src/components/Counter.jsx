import { useState } from "react";

const Counter = () => {
  const [count, setCount] = useState(0);
  const onClickButton = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={onClickButton}>+</button>
    </div>
  );
};

export default Counter;
