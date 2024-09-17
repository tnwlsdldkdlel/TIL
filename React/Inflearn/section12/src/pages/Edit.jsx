import { useParams } from "react-router-dom";
import "./Edit.css";
import EmotionItem from "../components/EmotionItem";
import { useState } from "react";

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

const Edit = () => {
  const emotionId = 2;

  return (
    <div className="Edit">
      <section className="date_sction">
        <h4>오늘의 날짜</h4>
        <input type="date" />
      </section>
      <section className="emotion_sction">
        <h4>오늘의 감정</h4>
        <div className="emotion_list">
          {emotionList.map((item) => (
            <EmotionItem
              key={item.emotionId}
              emotionId={item.emotionId}
              {...item}
              isSelected={item.emotionId === emotionId}
              // onClickEmotion={onClickEmotion(item.emotionId)}
            />
          ))}
        </div>
      </section>
      <section className="content_sction">오늘의 일기</section>
      <section className="button_sction">번호</section>
    </div>
  );
};

export default Edit;
