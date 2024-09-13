import "./App.css";
import Editor from "./components/Editor";
import Exam from "./components/Exam";
import Header from "./components/Header";
import List from "./components/List";
import { useState, useReducer, useCallback } from "react";

const mockData = [];

function reducer(state, action) {
  switch (action.type) {
    case "CREATE":
      return [action.data, ...state];

    case "DELETE":
      return state.filter((todo) => todo.id != action.data);

    case "UPDATE":
      return state.map((todo) =>
        todo.id === action.data ? { ...todo, isDone: !todo.isDone } : todo
      );
  }
}

function App() {
  const [todos, dispatch] = useReducer(reducer, mockData);
  const [searchTodos, setSearchTodos] = useState([]);

  const addTodo = useCallback(
    (value) => {
      const todo = {
        id: todos.length + 1,
        todo: value,
        date: new Date().toLocaleDateString(),
        isDone: false,
      };

      dispatch({
        type: "CREATE",
        data: todo,
      });
    },
    [todos.length]
  );

  const checkTodo = useCallback((id) => {
    dispatch({ type: "UPDATE", data: id });
  }, []);

  const deleteTodo = useCallback((id) => {
    dispatch({
      type: "DELETE",
      data: id,
    });
  }, []);

  return (
    <div className="app">
      <Header></Header>
      <Editor addTodo={addTodo}></Editor>
      <List
        todos={todos}
        deleteTodo={deleteTodo}
        checkTodo={checkTodo}
        searchTodos={searchTodos}
      ></List>
    </div>
  );
}

export default App;
