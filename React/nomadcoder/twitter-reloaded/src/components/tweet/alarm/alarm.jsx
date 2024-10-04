import { timeAgo } from "../../../common/time-ago";
import "./alarm.css";

export default function Alarm({ onClickDetail, ...data }) {
  return (
    <div className={`alarm_${data.tweetId}`} onClick={onClickDetail}>
      <div className="left">
        <div>{data.content}</div>
        <div className="time">{timeAgo(data.createdAt)}</div>
      </div>
      <div className="right">
        <img src={data.photo} width={50} height={50} />
      </div>
    </div>
  );
}
