import { useState } from "react";
import "./App.css";
import Viewer from "./components/Viewer";
import Controller from "./components/Controller";

function App() {
  const [count, setCount] = useState(0);

  // <section> : 컴포넌트들마다의 백그라운드와 이 내부 여백을 적용해주기 위함
  return (
    <div className="App">
      <h1>Simple Counter</h1>
      <section>
        {" "}
        <Viewer count={count}></Viewer>
      </section>
      <section>
        <Controller setCount={setCount} count={count}></Controller>
      </section>
    </div>
  );
}

export default App;
