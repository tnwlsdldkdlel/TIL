import EmotionItem from "./EmotionItem";
import "./DiaryContent.css";

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

const DiaryContent = ({ diaryContent }) => {
  const emotion = emotionList.find(
    (item) => String(item.emotionId) === String(diaryContent.emotionId)
  );

  return (
    <div className="DiaryContent">
      <div className="emotion">
        <h3>오늘의 감정</h3>
        <div className="emotion_item">
          <EmotionItem
            emotionId={diaryContent.emotionId}
            {...emotion}
            isSelected={true}
          />
        </div>
      </div>
      <div className="content">
        <h3>오늘의 일기</h3>
        <div>{diaryContent.content}</div>
      </div>
    </div>
  );
};

export default DiaryContent;
