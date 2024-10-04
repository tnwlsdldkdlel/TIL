import { Link, Outlet, useNavigate } from "react-router-dom";
import "./layout.css";
import { auth, db } from "../../firebase";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import AlarmDialog from "../tweet/alarm/alarm-dialog";
import TweetReplyDialog from "../tweet/reply/tweet-reply-dialog";

export default function Layout() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [alarm, setAlarm] = useState(0);
  const [alramOpen, setAlarmOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [tweet, setTweet] = useState();

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
    setChecked();
  };

  const setChecked = async () => {
    const alarmsCollection = collection(db, "alarm");
    const snapshot = await getDocs(alarmsCollection);

    snapshot.docs.forEach((item) => {
      const docRef = item.ref;
      updateDoc(docRef, { isChecked: true });
    });

    setAlarmOpen(true);
  };

  const handleClose = () => {
    setAlarmOpen(false);
    setDetailOpen(false);
  };

  const onClickDetail = async (e) => {
    const tweetId = e.target.parentNode.parentNode.className.replace(
      "alarm_",
      ""
    );

    handleClose();
    await getTweet(tweetId);
  };

  const getTweet = async (tweetId) => {
    const tweetQuery = query(
      collection(db, "tweets"),
      where("__name__", "==", tweetId)
    );

    const unsubscribeTweets = onSnapshot(tweetQuery, (snapshot) => {
      const tweetsData = snapshot.docs.map((doc) => {
        const tweetData = doc.data();
        const tweetId = doc.id;

        return {
          ...tweetData,
          id: tweetId,
          like: { isLiked: false, count: 0 },
          reply: { count: 0 },
          retweet: { count: 0 },
        };
      });

      setTweet(tweetsData[0]);

      getTweetLike(tweetsData[0].id);
      getTweetReply(tweetsData[0].id);

      if (tweetsData[0].retweetId) {
        getRetweet(tweet.retweetId);
      }

      setDetailOpen(true);
    });

    return () => {
      unsubscribeTweets();
    };
  };

  const getTweetLike = async (tweetId) => {
    const tweetLikeQuery = query(
      collection(db, "likes"),
      where("tweetId", "==", tweetId)
    );

    const unsubscribeTweets = onSnapshot(tweetLikeQuery, (snapshot) => {
      const likeCount = snapshot.docs.length;
      let likeId = 0;
      const isLiked = snapshot.docs.some((likeDoc) => {
        if (likeDoc.data().userId === user.uid) {
          likeId = likeDoc.id;
          return true;
        }
      });

      setTweet((prev) => {
        return {
          ...prev,
          like: { isLiked: isLiked, count: likeCount, id: likeId },
        };
      });
    });

    return () => {
      unsubscribeTweets();
    };
  };

  const getTweetReply = async (tweetId) => {
    const tweetReplyQuery = query(
      collection(db, "replies"),
      where("tweetId", "==", tweetId)
    );

    const unsubscribeTweets = onSnapshot(tweetReplyQuery, (snapshot) => {
      const replyCount = snapshot.docs.length;

      setTweet((prev) => {
        return {
          ...prev,
          reply: { count: replyCount },
        };
      });
    });

    return () => {
      unsubscribeTweets();
    };
  };

  const getRetweet = async (retweetId) => {
    const retweetQuery = query(
      collection(db, "tweets"),
      where("__name__", "==", retweetId)
    );

    const unsubscribeTweets = onSnapshot(retweetQuery, (retweetSnapshot) => {
      const retweetCount = retweetSnapshot.docs.length;

      // content 업데이트
      setTweet((prevTweets) => {
        return prevTweets.map((prevTweet) => {
          if (prevTweet.id === retweetId) {
            return {
              ...prevTweet,
              retweet: { count: retweetCount },
            };
          }
          return prevTweet;
        });
      });
    });

    return () => {
      unsubscribeTweets();
    };
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
    </div>
  );
}
