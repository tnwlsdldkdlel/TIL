import "./App.css";
import Editor from "./components/Editor";
import Exam from "./components/Exam";
import Header from "./components/Header";
import List from "./components/List";
import { useState, useReducer } from "react";

function App() {
  //   const [todos, setTodos] = useState([]);
  const [todos, dispatch] = useReducer();
  const [searchTodos, setSearchTodos] = useState([]);

  const addTodo = (value) => {
    const todo = {
      id: todos.length + 1,
      todo: value,
      date: new Date().toLocaleDateString(),
      isDone: false,
    };

    setTodos([todo, ...todos]);
  };
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id != id));
  };
  const checkTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isDone: !todo.isDone } : todo
      )
    );
  };

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
