import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./layout.css";
import { auth } from "../../firebase";
import { useCallback, useEffect, useState } from "react";
import AlarmDialog from "../tweet/alarm/alarm-dialog";
import TweetReplyDialog from "../tweet/reply/tweet-reply-dialog";
import { isCheckedAlarm, setChecked } from "../../api/alarmApi";
import { getTweetOnlyOne } from "../../api/tweetApi";
import { authSessionCheck } from "../../api/authApi";
import SessionDialog from "./session-dialog";

export default function Layout() {
  const navigate = useNavigate();
  const [alarm, setAlarm] = useState(0);
  const [alramOpen, setAlarmOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [tweet, setTweet] = useState();
  const [sessionExpired, isSessionExpired] = useState(false);
  const location = useLocation();

  useEffect(() => {
    getAlarmCount();
  }, []);

  const getAlarmCount = () => {
    isCheckedAlarm((count) => {
      setAlarm(count);
    });
  };

  const onLogout = async () => {
    if (confirm("로그아웃 하시겠어요?")) {
      await auth.signOut();
      navigate("/login", { replace: true });
    }
  };

  const onClickAlarm = async () => {
    const result = await setChecked();
    setAlarmOpen(result);
  };

  const handleClose = useCallback(() => {
    setAlarmOpen(false);
    setDetailOpen(false);
  }, []);

  const onClickDetail = useCallback(async (e) => {
    const tweetId = e.target.parentNode.parentNode.className.replace(
      "alarm_",
      ""
    );

    handleClose();
    const result = await getTweetOnlyOne(tweetId);
    setTweet(result);
  }, []);

  const onClickMenu = (path) => {
    navigate(path);
  };

  const handleSessionInvalid = async () => {
    isSessionExpired(true);
  };

  return (
    <div className="layout">
      <div className="menu">
        <div
          className={`menu-item ${location.pathname === "/" ? "active" : ""}`}
          onClick={() =>
            authSessionCheck(onClickMenu, handleSessionInvalid)("/")
          }
        >
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
        <div
          className={`menu-item ${
            location.pathname === "/search" ? "active" : ""
          }`}
          onClick={() =>
            authSessionCheck(onClickMenu, handleSessionInvalid)("/search")
          }
        >
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
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>
        <div
          className={`menu-item ${
            location.pathname.indexOf("/profile") > -1 ? "active" : ""
          }`}
          onClick={() =>
            authSessionCheck(onClickMenu, handleSessionInvalid)("profile")
          }
        >
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

        <div
          className={`menu-item ${
            location.pathname === "/post" ? "active" : ""
          }`}
          onClick={() =>
            authSessionCheck(onClickMenu, handleSessionInvalid)("post")
          }
        >
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
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
        </div>

        <div
          className="menu-item"
          onClick={() => authSessionCheck(onClickAlarm, handleSessionInvalid)()}
        >
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
              d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
            />
            {alarm > 0 ? (
              <>
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
              </>
            ) : (
              <></>
            )}
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
        {...tweet}
      />
      <SessionDialog isOpen={sessionExpired}></SessionDialog>
    </div>
  );
}
