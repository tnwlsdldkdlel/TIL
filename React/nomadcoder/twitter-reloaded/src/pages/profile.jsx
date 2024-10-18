import "./profile.css";
import { auth, db } from "../firebase";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import Tweet from "../components/tweet/tweet";
import ReTweet from "../components/tweet/re-tweet";
import { useLocation, useNavigate } from "react-router-dom";
import BackDrop from "../components/common/loading";
import { debounce } from "lodash";

function Profile() {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state || {};
  const [info, setInfo] = useState({});
  const [tweet, setTweet] = useState([]);
  const [count, setCount] = useState({
    tweet: 0,
    following: 0,
    follower: 0,
  });
  const [isFollow, setIsFollow] = useState(false);
  const scrollableDivRef = useRef(null);
  const PAGE = 20;
  let lastVisible = null;
  let hasMore = true;
  let lastScrollTop = 0;
  const [isLoading, setIsLoading] = useState(false);

  let uid = "";
  if (userId && userId !== user.uid) {
    uid = userId;
  } else {
    uid = user.uid;
  }

  useEffect(() => {
    fetchInitialTweets(false);
    getUserInfo();

    const scrollableDiv = scrollableDivRef.current;
    if (scrollableDiv) {
      scrollableDiv.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollableDiv) {
        scrollableDiv.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    getTweetCount();
  }, [user.uid]);

  const getUserInfo = useCallback(async () => {
    const infoQuery = query(collection(db, "user"), where("id", "==", uid));
    const snapshot = await getDocs(infoQuery);

    snapshot.docs.map((doc) => {
      const infoData = doc.data();

      setInfo({
        ...info,
        intro: infoData.intro,
        name: infoData.name,
        photo: infoData.photo,
      });
    });
  }, []);

  const getTweetCount = async () => {
    const tweetsQuery = query(
      collection(db, "tweets"),
      where("userId", "==", uid)
    );

    const snapshot = await getDocs(tweetsQuery);
    setCount({ ...count, tweet: snapshot.docs.length });
  };

  const fetchInitialTweets = async (isScrolled) => {
    setIsLoading(true);

    let tweetsQuery = null;
    if (!isScrolled) {
      tweetsQuery = query(
        collection(db, "tweets"),
        where("userId", "==", uid),
        limit(PAGE),
        orderBy("createdAt", "desc")
      );
    } else {
      tweetsQuery = query(
        collection(db, "tweets"),
        where("userId", "==", uid),
        limit(PAGE),
        orderBy("createdAt", "desc"),
        startAfter(lastVisible)
      );
    }
    try {
      const snapshot = await getDocs(tweetsQuery);

      // 뒤에 마지막으로 문서가 있는지 확인한다.
      hasMore = snapshot.docs.length === PAGE;

      // 마지막 문서가 뭔지
      lastVisible = snapshot.docs[snapshot.docs.length - 1];

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

      // 실시간 업데이트 로직
      tweetsData.forEach((item) => {
        delete item.userId;

        const imagesQuery = query(
          collection(db, "images"),
          where("tweetId", "==", item.id),
          orderBy("__name__", "asc")
        );

        onSnapshot(imagesQuery, (snapshot) => {
          const imageArr = snapshot.docs.map((doc) => doc.data().url);

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

          setTweet((prevTweets) => {
            return prevTweets.map((prevTweet) => {
              if (prevTweet.id === item.id) {
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

      // 팔로워, 팔로잉 실시간 구독
      const followerQuery = query(
        collection(db, "follow"),
        where("targetId", "==", uid)
      );

      onSnapshot(followerQuery, (snapshot) => {
        setCount({ ...count, follower: snapshot.docs.length });
      });

      const followingQuery = query(
        collection(db, "follow"),
        where("userId", "==", uid)
      );

      onSnapshot(followingQuery, (snapshot) => {
        setCount({ ...count, following: snapshot.docs.length });
      });

      // `내가` 상대방을 팔로우했는지 확인
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

      if (isScrolled) {
        setTweet((prev) => [...prev, ...tweetsData]);
      } else {
        setTweet(tweetsData);
      }
    } catch (error) {
      console.error("Error fetching initial tweets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = debounce(() => {
    if (scrollableDivRef.current) {
      const scrollTop = scrollableDivRef.current.scrollTop;

      if (scrollTop - lastScrollTop >= 1900) {
        lastScrollTop = scrollTop;
        fetchInitialTweets(true);
      }
    }
  }, 300); // 300ms 동안 연속 호출 방지

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
            <div className="value">{count.tweet}</div>
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
            <div className="value">{count.follower}</div>
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
            <div className="value">{count.following}</div>
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
      <div className="my-tweets scrollable" ref={scrollableDivRef}>
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
      <BackDrop isLoading={isLoading}></BackDrop>
    </div>
  );
}

export default memo(Profile);
