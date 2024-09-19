import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { DiaryStateContext } from "../App";
import { useContext, useEffect, useState } from "react";
import Button from "../components/Button";
import DiaryContent from "../components/DiaryContent";
import usePageTitle from "../hook/usePageTitle";

const getStringDate = (targetDate) => {
  // 날짜 => yyyy-mm-dd
  var date = new Date(targetDate);
  const year = date.getFullYear();
  const month =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  return year + "-" + month + "-" + day;
};

const Diary = () => {
  const params = useParams();
  const data = useContext(DiaryStateContext);
  const [curDiaryItem, setCurDiaryItem] = useState({});
  const nav = useNavigate();
  usePageTitle(`${params.id}번 일기`);

  useEffect(() => {
    const currnetDiaryItem = data.find(
      (item) => String(item.id) === String(params.id)
    );

    setCurDiaryItem({
      ...currnetDiaryItem,
      createDate: getStringDate(currnetDiaryItem.createdData),
    });
  }, [params.id]);

  console.log(curDiaryItem);

  return (
    <div>
      <Header
        title={`${curDiaryItem.createDate} 기록`}
        leftChild={
          <Button
            text={"< 뒤로가기"}
            onClick={() => nav("/", { replace: true })}
          />
        }
        rightChild={
          <Button text={"수정하기"} onClick={() => nav(`/edit/${params.id}`)} />
        }
      ></Header>
      <DiaryContent diaryContent={curDiaryItem} />
    </div>
  );
};

export default Diary;
