import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import Header from "../components/Header";
import Editor from "../components/Editor";
import { DiaryDispathchContext, DiaryStateContext } from "../App";
import { useContext, useEffect, useState } from "react";
import usePageTitle from "../hook/usePageTitle";

const Eidt = () => {
  const nav = useNavigate();
  const param = useParams();
  const { onUpdate, onDelete } = useContext(DiaryDispathchContext);
  const data = useContext(DiaryStateContext);
  const [curDiaryItem, setCurDiaryItem] = useState();
  usePageTitle(`${param.id}번 일기 수정`);

  useEffect(() => {
    const currnetDiaryItem = data.find(
      (item) => String(item.id) === String(param.id)
    );

    if (!currnetDiaryItem) {
      window.alert("존재하지 않은 일기입니다.");
      nav("/", { replace: true });
    }

    setCurDiaryItem(currnetDiaryItem);
  }, [param.id, data]);

  const onSubmit = (input) => {
    if (window.confirm("일기를 정말 수정할까요?")) {
      onUpdate(
        param.id,
        input.createDate.getTime(),
        input.emotionId,
        input.content
      );

      nav("/", { replace: true });
    }
  };

  const onClickDelete = () => {
    if (window.confirm("일기를 정말 삭제할까요? 다시 복구되지 않아요!")) {
      onDelete(param.id);
      nav("/", { replace: true });
    }
  };

  return (
    <div>
      <Header
        title={"일기 수정하기"}
        leftChild={<Button onClick={() => nav(-1)} text={"< 뒤로 가기"} />}
        rightChild={
          <Button text={"삭제하기"} type={"NEGATIVE"} onClick={onClickDelete} />
        }
      ></Header>
      <Editor onSubmit={onSubmit} initData={curDiaryItem} />
    </div>
  );
};

export default Eidt;
