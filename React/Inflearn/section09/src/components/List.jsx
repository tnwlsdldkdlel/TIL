import { useEffect, useState } from "react";
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

  return (
    <div className="List">
      <h4>Todo List 🌱</h4>
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
