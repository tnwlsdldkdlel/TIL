import "./DiaryItem.css";
import { getEmotionImage } from "../utils/get-emotion-image";
import Button from "./Button";

const DiaryItem = () => {
  const emotionId = 1;

  return (
    <div className="DiaryItem">
      <div className={`img_section img_section_${emotionId}`}>
        <img src={getEmotionImage(emotionId)}></img>
      </div>
      <div className="info_section">
        <div className="created_date">{new Date().toLocaleDateString()}</div>
        <div className="centent">내용</div>
      </div>
      <div className="button_section">
        <Button text={"수정하기"} />
      </div>
    </div>
  );
};

export default DiaryItem;
