import Header from "../components/Header";
import Button from "../components/Button";
import DiaryList from "../components/DiaryList";
import { useContext, useState } from "react";
import { DiaryStateContext } from "../App";
import usePageTitle from "../hook/usePageTitle";

const getMonthlyData = (pivoDate, data) => {
  const beginTime = new Date(
    pivoDate.getFullYear(),
    pivoDate.getMonth(),
    1,
    0,
    0,
    0
  ).getTime();
  const endTime = new Date(
    pivoDate.getFullYear(),
    pivoDate.getMonth() + 1,
    0,
    23,
    59,
    59
  ).getTime();

  return data.filter(
    (item) => item.createdData >= beginTime && item.createdData <= endTime
  );
};

const Home = () => {
  const [pivoDate, setPivoDate] = useState(new Date());
  const data = useContext(DiaryStateContext);
  const monthlyDate = getMonthlyData(pivoDate, data);
  usePageTitle(`감정 일기장`);

  const onClickMinus = () => {
    setPivoDate(new Date(pivoDate.getFullYear(), pivoDate.getMonth() - 1));
  };

  const onClickPlus = () => {
    setPivoDate(new Date(pivoDate.getFullYear(), pivoDate.getMonth() + 1));
  };

  return (
    <div>
      <Header
        title={`${pivoDate.getFullYear()}년 ${pivoDate.getMonth() + 1}월`}
        leftChild={<Button text={"<"} onClick={onClickMinus} />}
        rightChild={<Button text={">"} onClick={onClickPlus} />}
      />
      <DiaryList data={monthlyDate} />
    </div>
  );
};

export default Home;
