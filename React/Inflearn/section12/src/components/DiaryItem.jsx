import "./DiaryItem.css";
import { getEmotionImage } from "../utils/get-emotion-image";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

const DiaryItem = ({ content, id, createdData, emotionId }) => {
  const nav = useNavigate();

  return (
    <div className="DiaryItem" onClick={() => nav(`/diary/${id}`)}>
      <div
        onClick={() => nav(`/diary/${id}`)}
        className={`img_section img_section_${emotionId}`}
      >
        <img src={getEmotionImage(emotionId)}></img>
      </div>
      <div onClick={() => nav(`/diary/${id}`)} className="info_section">
        <div className="created_date">
          {new Date(createdData).toLocaleDateString()}
        </div>
        <div className="centent">{content}</div>
      </div>
      <div className="button_section">
        <Button text={"수정하기"} onClick={() => nav(`/edit/${id}`)} />
      </div>
    </div>
  );
};

export default DiaryItem;
