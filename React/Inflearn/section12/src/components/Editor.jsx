/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import "./Editor.css";
import EmotionItem from "./EmotionItem";
import { useEffect, useState } from "react";
import Button from "./Button";

const emotionList = [
  {
    emotionId: 1,
    emotionName: "완전 좋음",
  },
  {
    emotionId: 2,
    emotionName: "좋음",
  },
  {
    emotionId: 3,
    emotionName: "그럭저럭",
  },
  {
    emotionId: 4,
    emotionName: "나쁨",
  },
  {
    emotionId: 5,
    emotionName: "끔찍함",
  },
];

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

const Editor = ({ onSubmit, initData }) => {
  const nav = useNavigate();
  const [input, setInput] = useState({
    createDate: getStringDate(new Date()),
    emotionId: 3,
    content: "",
  });

  useEffect(() => {
    if (initData) {
      setInput({
        ...initData,
        createDate: new Date(Number(initData.createdData)),
      });
    }
  }, [initData]);

  const onChangeInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    if (name === "createDate") {
      value = new Date(value);
    }

    setInput({ ...input, [name]: value });
  };

  const onClickSubmit = () => {
    onSubmit(input);
  };

  return (
    <div className="Edit">
      <section className="date_sction">
        <h4>오늘의 날짜</h4>
        <input
          type="date"
          name="createDate"
          value={getStringDate(input.createDate)}
          onChange={onChangeInput}
        />
      </section>
      <section className="emotion_sction">
        <h4>오늘의 감정</h4>
        <div className="emotion_list">
          {emotionList.map((item) => (
            <EmotionItem
              key={item.emotionId}
              emotionId={item.emotionId}
              {...item}
              isSelected={item.emotionId === input.emotionId}
              onClick={() =>
                onChangeInput({
                  target: {
                    name: "emotionId",
                    value: item.emotionId,
                  },
                })
              }
            />
          ))}
        </div>
      </section>
      <section className="content_sction">
        <h4>오늘의 일기</h4>
        <textarea
          placeholder="오늘은 어땠나요?"
          name="content"
          value={input.content}
          onChange={onChangeInput}
        ></textarea>
      </section>
      <section className="button_sction">
        <Button text={"취소하기"} type={""} onClick={() => nav(-1)} />
        <Button text={"작성 완료"} type={"POSITIVE"} onClick={onClickSubmit} />
      </section>
    </div>
  );
};

export default Editor;
