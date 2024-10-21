import "./follower.css";
import { memo } from "react";
import { useNavigate } from "react-router-dom";

function FollowListNotMe({ ...data }) {
  const navigate = useNavigate();

  const onClickProfile = () => {
    navigate(`/profile`, { state: { userId: data.user.id } });
  };

  return (
    <div className="follow-list">
      <div className="follow-item">
        <div className="left" onClick={onClickProfile}>
          {data.user.photo ? (
            <img className="photo" src={data.user.photo}></img>
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
          <div className="name">{data.user.name}</div>
        </div>
      </div>
    </div>
  );
}

export default memo(FollowListNotMe);
