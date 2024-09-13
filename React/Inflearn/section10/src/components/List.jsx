import { useEffect, useState, useMemo } from "react";
import "./List.css";
import TodoItem from "./TodoItem";

const List = ({ todos, deleteTodo, checkTodo }) => {
  const [search, setSearch] = useState("");
  const [searchTodos, setSearchTodos] = useState(todos);

  useEffect(() => {
    setSearchTodos(
      todos.filter((todo) =>
        todo.todo.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [todos, search]);

  const onChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  const { totalCount, doneCount, notDoneCount } = useMemo(() => {
    console.log("호출!");
    const totalCount = todos.length;
    const doneCount = todos.filter((todo) => todo.isDone).length;
    const notDoneCount = totalCount - doneCount;

    return {
      totalCount,
      doneCount,
      notDoneCount,
    };
  }, [todos]);

  return (
    <div className="List">
      <h4>Todo List 🌱</h4>
      <div>total : {totalCount}</div>
      <div>done : {doneCount}</div>
      <div>not Done : {notDoneCount}</div>
      <input
        placeholder="검색어를 입력하세요"
        value={search}
        onChange={onChangeSearch}
      ></input>
      <div className="todos-wrapper">
        {searchTodos.map((data, indx) => (
          <TodoItem
            key={indx}
            data={data}
            deleteTodo={deleteTodo}
            checkTodo={checkTodo}
          ></TodoItem>
        ))}
      </div>
    </div>
  );
};

export default List;
