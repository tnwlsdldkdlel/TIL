import { memo } from "react";
import "./TodoItem.css";

const TodoItem = ({ data, deleteTodo, checkTodo }) => {
  const onClickRemove = () => {
    deleteTodo(data.id);
  };
  const onClickCheckBox = () => {
    checkTodo(data.id);
  };

  return (
    <div className="TodoItem">
      <input
        type="checkbox"
        checked={data.isDone}
        onChange={onClickCheckBox}
      ></input>
      <div className="content">{data.todo}</div>
      <div className="date">{data.date}</div>
      <button onClick={onClickRemove}>삭제</button>
    </div>
  );
};

export default memo(TodoItem);
