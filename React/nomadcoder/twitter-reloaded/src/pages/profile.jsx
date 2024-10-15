import "./profile.css";
import { auth, db } from "../firebase";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Tweet from "../components/tweet/tweet";
import ReTweet from "../components/tweet/re-tweet";
import { useLocation, useNavigate } from "react-router-dom";

export default function Profile() {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state || {};
  const [info, setInfo] = useState({});
  const [tweet, setTweet] = useState([]);
  const [tweetCount, setTweetCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followerCount, setFollwerCount] = useState(0);
  const [isFollow, setIsFollow] = useState(false);

  useEffect(() => {
    let uid = "";
    if (userId && userId !== user.uid) {
      uid = userId;
    } else {
      uid = user.uid;
    }

    const tweetsQuery = query(
      collection(db, "tweets"),
      where("userId", "==", uid),
      orderBy("__name__", "desc")
    );

    const unsubscribe = onSnapshot(tweetsQuery, (snapshot) => {
      setTweetCount(snapshot.docs.length);

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
          image: [],
        };
      });

      tweetsData.forEach((item) => {
        delete tweet.userId;

        const imagesQuery = query(
          collection(db, "images"),
          where("tweetId", "==", item.id),
          orderBy("__name__", "asc")
        );

        onSnapshot(imagesQuery, (snapshot) => {
          const imageArr = [];

          snapshot.docs.forEach((doc) => {
            imageArr.push(doc.data().url);
          });

          setTweet((prevTweets) => {
            return prevTweets.map((prevTweet) => {
              if (prevTweet.id === item.id) {
                return {
                  ...prevTweet,
                  images: imageArr,
                };
              }
              return prevTweet;
            });
          });
        });

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
            if (likeDoc.data().userId === uid) {
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

      // 팔로워 : 나`를` 팔로우하는 사람들 => 내가 targetId
      // 팔로잉 : 내`가` 팔로우한 사람들 => 내가 userId
      const followerQuery = query(
        collection(db, "follow"),
        where("targetId", "==", uid)
      );

      onSnapshot(followerQuery, (snapshot) => {
        setFollwerCount(snapshot.docs.length);
      });

      const followingQuery = query(
        collection(db, "follow"),
        where("userId", "==", uid)
      );

      onSnapshot(followingQuery, (snapshot) => {
        setFollowingCount(snapshot.docs.length);
      });

      // `내가` 상대방을 팔로우했는지
      if (uid === userId) {
        const followQuery = query(
          collection(db, "follow"),
          where("userId", "==", user.uid),
          where("targetId", "==", uid)
        );

        onSnapshot(followQuery, (snapshot) => {
          setIsFollow(snapshot.docs.length > 0);
        });
      }

      setTweet(tweetsData);
    });

    return () => {
      unsubscribe();
    };
  }, [userId]);

  useEffect(() => {
    let uid = "";

    if (userId && userId !== user.uid) {
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
  }, [userId]);

  const onClickProfile = () => {
    navigate(`/profile/edit`);
  };

  const onClickFollow = async () => {
    const doc = await addDoc(collection(db, "follow"), {
      userId: user.uid, // 팔로우 건 사람
      targetId: userId, // 팔로우 당한 사람
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    const content = `${user.displayName}님이 팔로우하기 시작했습니다.`;
    await addDoc(collection(db, "alarm"), {
      userId: userId, // 팔로우 당한 사람 uid
      targetId: user.uid, // 팔로우한 사람
      followId: doc.id,
      content: content,
      isChecked: false,
      createdAt: Date.now(),
    });
  };

  console.log(tweet);

  return (
    <div className="profile">
      <div className="top">
        <label className="avatar-upload">
          {info.photo ? (
            <img src={info.photo} />
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
            <div className="value">{tweetCount}</div>
            <div className="key">게시물</div>
          </div>
          <div
            className="follower-count"
            onClick={() =>
              navigate("follower", {
                state: {
                  userId: userId && userId !== user.uid ? userId : user.uid,
                },
              })
            }
          >
            <div className="value">{followerCount}</div>
            <div className="key">팔로워</div>
          </div>
          <div
            className="following-count"
            onClick={() =>
              navigate("follower", {
                state: {
                  stateTab: "following",
                  userId: userId && userId !== user.uid ? userId : user.uid,
                },
              })
            }
          >
            <div className="value">{followingCount}</div>
            <div className="key">팔로잉</div>
          </div>
        </div>
      </div>
      <div className="down">
        <span className="name">{info.name}</span>
        {info.intro ? <span className="intro">{info.intro}</span> : <></>}
      </div>
      {!userId || userId === user.uid ? (
        <button className="edit-btn" onClick={onClickProfile}>
          프로필편집
        </button>
      ) : isFollow ? (
        <button className="following-btn" onClick={onClickFollow}>
          팔로잉
        </button>
      ) : (
        <button className="follow-btn" onClick={onClickFollow}>
          팔로우
        </button>
      )}
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
