import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Header from "../components/Header";
import Editor from "../components/Editor";
import { DiaryDispathchContext } from "../App";
import { DiaryStateContextContext } from "../App";
import { useContext } from "react";

const Eidt = () => {
  const nav = useNavigate();
  const data = useContext(DiaryStateContextContext);
  const { onUpdate } = useContext(DiaryDispathchContext);

  console.log(data);

  const onSubmit = (input) => {
    onUpdate(id, createdData, emotionId, content);
  };

  return (
    <div>
      <Header
        title={"일기 수정하기"}
        leftChild={<Button onClick={() => nav("-1")} text={"< 뒤로 가기"} />}
        rightChild={<Button text={"삭제하기"} type={"NEGATIVE"} />}
      ></Header>
      <Editor onSubmit={onSubmit} />
    </div>
  );
};

export default Eidt;
