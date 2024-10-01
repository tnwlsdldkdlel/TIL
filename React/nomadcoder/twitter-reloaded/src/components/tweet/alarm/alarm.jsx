import { timeAgo } from "../../../common/time-ago";
import "./alarm.css";

export default function Alarm({ isLast, ...data }) {
  return (
    <div className="alarm">
      <div>{data.content}</div>
      <div className="time">{timeAgo(data.createdAt)}</div>
    </div>
  );
}
