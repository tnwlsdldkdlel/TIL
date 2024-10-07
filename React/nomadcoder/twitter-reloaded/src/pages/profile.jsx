import "./profile.css";
import { auth, db } from "../firebase";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import Tweet from "../components/tweet/tweet";
import ReTweet from "../components/tweet/re-tweet";
import { useNavigate, useParams } from "react-router-dom";

export default function Profile() {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const { userId } = useParams();
  const [info, setInfo] = useState({});
  const [tweet, setTweet] = useState([]);
  const [count, setCount] = useState({
    tweet: 0,
    follower: 0,
    following: 0,
  });

  useEffect(() => {
    const tweetsQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(tweetsQuery, (snapshot) => {
      setCount({ ...count, tweet: snapshot.docs.length });

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
        };
      });

      tweetsData.forEach((item) => {
        delete tweet.userId;

        const userQuery = query(
          collection(db, "user"),
          where("id", "==", item.user.id)
        );

        onSnapshot(userQuery, (snapshot) => {
          snapshot.docs.forEach((doc) => {
            const userInfo = doc.data();

            setTweet((prevTweets) => {
              return prevTweets.map((prevTweet) => {
                if (prevTweet.user.id === userInfo.id) {
                  return {
                    ...prevTweet,
                    user: {
                      id: userInfo.id,
                      name: userInfo.name,
                      photo: userInfo.photo,
                    },
                  };
                }
                return prevTweet;
              });
            });
          });
        });

        const likeQuery = query(
          collection(db, "likes"),
          where("tweetId", "==", item.id)
        );

        onSnapshot(likeQuery, (snapshot) => {
          let likeId = 0;
          const likeCount = snapshot.docs.length;
          const isLiked = snapshot.docs.some((likeDoc) => {
            if (likeDoc.data().userId === user.uid) {
              likeId = likeDoc.id;
              return true;
            }
          });

          setTweet((prev) => {
            return prev.map((prevItem) => {
              if (prevItem.id === item.id) {
                return {
                  ...prevItem,
                  like: { isLiked: isLiked, id: likeId, count: likeCount },
                };
              } else {
                return prevItem;
              }
            });
          });
        });

        const replyQuery = query(
          collection(db, "replies"),
          where("tweetId", "==", item.id)
        );

        onSnapshot(replyQuery, (snapshot) => {
          const replyCount = snapshot.docs.length;

          setTweet((prev) => {
            return prev.map((prevItem) => {
              if (prevItem.id === item.id) {
                return {
                  ...prevItem,
                  reply: { count: replyCount },
                };
              } else {
                return prevItem;
              }
            });
          });
        });

        const retweetQuery = query(
          collection(db, "tweets"),
          where("retweetId", "==", item.id)
        );

        onSnapshot(retweetQuery, (retweetSnapshot) => {
          const retweetCount = retweetSnapshot.docs.length;

          // content 업데이트
          setTweet((prevTweets) => {
            return prevTweets.map((prevTweet) => {
              if (prevTweet.id === tweet.id) {
                return {
                  ...prevTweet,
                  retweet: { count: retweetCount },
                };
              }
              return prevTweet;
            });
          });
        });
      });

      setTweet(tweetsData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    let uid = "";

    if (userId) {
      uid = userId;
    } else {
      uid = user.uid;
    }

    const infoQuery = query(collection(db, "user"), where("id", "==", uid));
    const unsubscribe = onSnapshot(infoQuery, (snapshot) => {
      snapshot.docs.map((doc) => {
        const infoData = doc.data();

        setInfo({
          ...info,
          intro: infoData.intro,
          name: infoData.name,
          photo: infoData.photo,
        });
      });
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  const onClickProfile = () => {
    navigate("/profile/edit");
  };

  return (
    <div className="profile">
      <div className="top">
        <label className="avatar-upload">
          {info.avatar ? (
            <img src={info.avatar} />
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
        </label>
        <div className="count">
          <div className="tweet-count">
            <div className="value">{count.tweet}</div>
            <div className="key">게시물</div>
          </div>
          <div className="follower-count">
            <div className="value">120</div>
            <div className="key">팔로워</div>
          </div>
          <div className="following-count">
            <div className="value">97</div>
            <div className="key">팔로잉</div>
          </div>
        </div>
      </div>
      <div className="down">
        <span className="name">{info.name}</span>
        {info.intro ? <span className="intro">{info.intro}</span> : <></>}
      </div>
      <button className="edit-btn" onClick={onClickProfile}>
        프로필편집
      </button>
      <div className="my-tweets scrollable">
        {tweet.map((item, index) =>
          item.retweetId != undefined ? (
            <ReTweet
              key={item.id}
              isLast={index === tweet.length - 1}
              {...item}
            />
          ) : (
            <Tweet
              key={item.id}
              isLast={index === tweet.length - 1}
              {...item}
            />
          )
        )}
      </div>
    </div>
  );
}
