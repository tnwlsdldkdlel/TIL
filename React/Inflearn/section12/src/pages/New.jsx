import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Header from "../components/Header";
import { DiaryDispathchContext } from "../App";
import { useContext } from "react";
import Editor from "../components/Editor";
import usePageTitle from "../hook/usePageTitle";

const New = () => {
  const nav = useNavigate();
  const { onCreate } = useContext(DiaryDispathchContext);
  usePageTitle("새 일기 쓰기");

  const onSubmit = (input) => {
    onCreate(
      new Date(input.createDate).getTime(),
      input.emotionId,
      input.content
    );

    nav("/", { replace: true });
  };

  return (
    <div>
      <Header
        title={"새 일기 쓰기"}
        leftChild={<Button text={"< 뒤로 가기"} onClick={() => nav(-1)} />}
      />
      <Editor onSubmit={onSubmit} />
    </div>
  );
};

export default New;
