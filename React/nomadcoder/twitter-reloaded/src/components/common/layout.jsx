import { Link, Outlet, useNavigate } from "react-router-dom";
import "./layout.css";
import { auth, db } from "../../firebase";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import AlarmDialog from "../tweet/alarm/alarm-dialog";
import EditTweetDialog from "../tweet/edit/edit-tweet-dialog";
import TweetReplyDialog from "../tweet/reply/tweet-reply-dialog";

export default function Layout() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [alarm, setAlarm] = useState(0);
  const [alramOpen, setAlarmOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const onLogout = async () => {
    const ok = confirm("Are you sure you want to log out?");

    if (ok) {
      await auth.signOut();
      navigate("/login", { replace: true });
    }
  };

  useEffect(() => {
    const repliesQuery = query(
      collection(db, "alarm"),
      where("isChecked", "==", false),
      where("userId", "==", user.uid)
    );

    onSnapshot(repliesQuery, (replySnapshot) => {
      const alarmCount = replySnapshot.docs.length;
      // 알람 업데이트
      setAlarm(alarmCount);
    });
  }, []);

  const onClickAlarm = () => {
    setAlarmOpen(true);
  };

  const handleClose = () => {
    setAlarmOpen(false);
  };

  const onClickDetail = () => {
    handleClose();

    setDetailOpen(true);
  };

  const getTweet = async () => {
    const repliesQuery = query(
      collection(db, "tweet"),
      where("__name__", "==", data.id)
    );
  };

  return (
    <div className="layout">
      <div className="menu">
        <Link to="/">
          <div className="menu-item">
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
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </div>
        </Link>
        <Link to="/profile">
          <div className="menu-item">
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
          </div>
        </Link>
        <div className="menu-item" onClick={onClickAlarm}>
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
              d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
            />
            <circle cx="18" cy="18" r="5.5" fill="red" color="red" />
            <text
              x="18"
              y="18"
              textAnchor="middle"
              fill="white"
              fontSize="8"
              dy=".35em"
              fontWeight="50"
            >
              {alarm}
            </text>
          </svg>
        </div>
        <div className="menu-item log-out" onClick={onLogout}>
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
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
            />
          </svg>
        </div>
      </div>
      <Outlet />
      <AlarmDialog
        isOpen={alramOpen}
        handleClose={handleClose}
        onClickDetail={onClickDetail}
      />
      <TweetReplyDialog
        isOpenReply={detailOpen}
        handleClose={handleClose}
        {...data}
      />
    </div>
  );
}
