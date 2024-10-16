import { Link, Outlet, useNavigate } from "react-router-dom";
import "./layout.css";
import { auth, db } from "../../firebase";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
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
      where("userId", "==", user.uid),
      orderBy("__name__", "desc")
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

    const snapshot = await getDocs(tweetQuery);
    const tweetsData = snapshot.docs.map((doc) => {
      const tweetData = doc.data();
      const tweetId = doc.id;

      return {
        ...tweetData,
        id: tweetId,
        like: { isLiked: false, count: 0 },
        reply: { count: 0 },
        retweet: { count: 0 },
        user: { id: tweetData.userId, name: "", photo: "" },
        images: "", // 첫 사진만 가져오도록 한다.
      };
    });

    setTweet(tweetsData[0]);

    getTweetLike(tweetsData[0].id);
    getTweetReply(tweetsData[0].id);
    getImages(tweetsData[0].id);

    if (tweetsData[0].retweetId) {
      getRetweet(tweet.retweetId);
    }

    setDetailOpen(true);
  };

  const getImages = async (tweetId) => {
    const imagesQuery = query(
      collection(db, "images"),
      where("tweetId", "==", tweetId),
      orderBy("__name__", "asc")
    );

    const snapshot = await getDocs(imagesQuery);
    if (snapshot.docs.length > 0) {
      const imageArr = snapshot.docs.map((doc) => doc.data().url);

      setTweet((prev) => {
        return {
          ...prev,
          images: imageArr,
        };
      });
    }
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
      where("tweetId", "==", tweetId),
      orderBy("__name__", "desc")
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
        <Link to="/post">
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
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
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
    </div>
  );
}
