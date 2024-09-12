import { useRef, useState } from "react";
import "./Editor.css";

const Editor = ({ addTodo }) => {
  const [todo, setTodo] = useState("");
  const todoRef = useRef("");

  const onChangeTodo = (e) => {
    setTodo(e.target.value);
  };

  const onClickButton = () => {
    if (todo === "") {
      todoRef.current.focus();
      return;
    } else {
      addTodo(todo);
      setTodo("");
    }
  };
  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      onClickButton();
    }
  };

  return (
    <div className="Editor">
      <input
        ref={todoRef}
        placeholder="새로운 Todo"
        onChange={onChangeTodo}
        onKeyDown={onKeyDown}
        value={todo}
      ></input>
      <button onClick={onClickButton}>추가</button>
    </div>
  );
};

export default Editor;
