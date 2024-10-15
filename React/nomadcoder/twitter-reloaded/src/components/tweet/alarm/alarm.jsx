import { timeAgo } from "../../../common/time-ago";
import "./alarm.css";

export default function Alarm({ onClickDetail, ...data }) {
  return (
    <div className={`alarm_${data.tweetId}`} onClick={onClickDetail}>
      <div className="left">
        {data.user && data.user.photo ? (
          <img src={data.user.photo} />
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </>
        )}

        <div style={{ width: "60%" }}>{data.content}</div>
        <div className="time">{timeAgo(data.createdAt)}</div>
      </div>
      <div className="right">
        {data.images ? (
          <img src={data.images} width={50} height={50} />
        ) : (
          <div className="no_img"></div>
        )}
      </div>
    </div>
  );
}
