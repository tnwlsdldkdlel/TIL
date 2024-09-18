import { getEmotionImage } from "../utils/get-emotion-image";
import "./EmotionItem.css";

const EmotionItem = ({ emotionId, emotionName, isSelected, onClick }) => {
  return (
    <div
      className={`EmotionItem ${
        isSelected ? `EmotionItem_on_${emotionId}` : ``
      }`}
      onClick={onClick}
    >
      <img className="emotion_img" src={getEmotionImage(emotionId)}></img>
      <div className="emotion_name">{emotionName}</div>
    </div>
  );
};

export default EmotionItem;
