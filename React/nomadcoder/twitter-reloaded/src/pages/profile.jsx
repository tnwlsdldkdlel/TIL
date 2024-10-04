import "./profile.css";
import { auth, db, storage } from "../firebase";
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import Tweet from "../components/tweet/tweet";
import ReTweet from "../components/tweet/re-tweet";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [tweet, setTweet] = useState([]);

  useEffect(() => {
    if (!user) return;

    const tweetsQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(tweetsQuery, (snapshot) => {
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

      tweetsData.forEach((item) => {
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

  const onClickProfile = () => {
    navigate("/profile/edit");
  };

  return (
    <div className="profile">
      <label className="avatar-upload">
        {avatar ? (
          <img src={avatar} />
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
      <span className="name">{user?.displayName ?? "Anonymous"}</span>
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
