import { Route, Routes } from "react-router-dom";
import { useReducer, createContext, useEffect } from "react";
import "./App.css";
import Home from "./pages/Home";
import New from "./pages/New";
import Diary from "./pages/Diary";
import Notfount from "./pages/Notfound";
import Edit from "./pages/Edit";

function reducer(state, action) {
  let nextState;

  switch (action.type) {
    case "INIT":
      return action.data;
    case "CREATE":
      nextState = [action.data, ...state];
      break;

    case "UPDATE":
      nextState = state.map((data) =>
        String(data.id) === String(action.data.id) ? action.data : data
      );
      break;

    case "DELETE":
      nextState = state.filter(
        (data) => String(data.id) !== String(action.data.id)
      );
      break;

    default:
      return state;
  }

  localStorage.setItem("diary", JSON.stringify(nextState));
  return nextState;
}

export const DiaryStateContext = createContext();
export const DiaryDispathchContext = createContext();

function App() {
  const [data, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    const sotredData = localStorage.getItem("diary");

    if (!sotredData) {
      return;
    }

    const parsedData = JSON.parse(sotredData);
    if (!Array.isArray(parsedData)) {
      return;
    }

    let maxId = 0;
    parsedData.forEach((item) => {
      if (Number(item.id) > maxId) {
        maxId = Number(item.id);
      }
    });

    dispatch({ type: "INIT", data: parsedData });
  }, []);

  // 새로운 일기 추가
  const onCreate = (createdData, emotionId, content) => {
    dispatch({
      type: "CREATE",
      data: {
        id: data.length + 1,
        createdData: createdData,
        emotionId: emotionId,
        content: content,
      },
    });
  };

  // 일기 수정
  const onUpdate = (id, createdData, emotionId, content) => {
    dispatch({
      type: "UPDATE",
      data: {
        id: id,
        createdData: createdData,
        emotionId: emotionId,
        content: content,
      },
    });
  };

  // 기존 일기 삭제
  const onDelete = (id) => {
    dispatch({ type: "DELETE", data: { id: id } });
  };

  return (
    <>
      <DiaryStateContext.Provider value={data}>
        <DiaryDispathchContext.Provider
          value={{ onCreate, onUpdate, onDelete }}
        >
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/new" element={<New />}></Route>
            <Route path="/diary/:id" element={<Diary />}></Route>
            <Route path="/edit/:id" element={<Edit />}></Route>
            <Route path="*" element={<Notfount />}></Route>
          </Routes>
        </DiaryDispathchContext.Provider>
      </DiaryStateContext.Provider>
    </>
  );
}

export default App;
