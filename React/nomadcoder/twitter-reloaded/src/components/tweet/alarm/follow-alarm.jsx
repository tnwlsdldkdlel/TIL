import { timeAgo } from "../../../common/time-ago";
import "./alarm.css";
import { memo, useEffect, useState } from "react";
import { checkIsFollowing } from "../../../api/followerApi";

function FollowAlarm({ onClickFollow, isUpdate, ...data }) {
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    check();
  }, [isUpdate]);

  const check = async () => {
    const result = await checkIsFollowing(data.targetId, data.userId);
    setIsFollowing(result);
  };

  return (
    <div className={`alarm_${data.targetId}`}>
      <div className="all">
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
      <div className="right2">
        {isFollowing ? (
          <div
            className="follow-btn"
            onClick={() =>
              onClickFollow(isFollowing, data.followId, data.targetId)
            }
          >
            팔로잉
          </div>
        ) : (
          <div
            className="mutual-follow-btn"
            onClick={() =>
              onClickFollow(isFollowing, data.followId, data.targetId)
            }
          >
            팔로우
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(FollowAlarm);
