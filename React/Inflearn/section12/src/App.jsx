import { Route, Routes } from "react-router-dom";
import { useReducer, createContext } from "react";
import "./App.css";
import Home from "./pages/Home";
import New from "./pages/New";
import Diary from "./pages/Diary";
import Notfount from "./pages/Notfound";
import Edit from "./pages/Edit";

const mockData = [
  {
    id: 1,
    createdData: new Date().getTime(),
    emotionId: 1,
    content: "1번 일기 내용",
  },
  {
    id: 2,
    createdData: new Date().getTime() - 1000,
    emotionId: 2,
    content: "2번 일기 내용",
  },
];

function reducer(state, action) {
  switch (action.type) {
    case "CREATE":
      return [action.data, ...state];

    case "UPDATE":
      return state.map((data) =>
        String(data.id) === String(action.data.id) ? action.data : data
      );

    case "DELETE":
      return state.filter((data) => String(data.id) !== String(action.data.id));

    default:
      return state;
  }
}

export const DiaryStateContext = createContext();
export const DiaryDispathchContext = createContext();

function App() {
  const [data, dispatch] = useReducer(reducer, mockData);

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
