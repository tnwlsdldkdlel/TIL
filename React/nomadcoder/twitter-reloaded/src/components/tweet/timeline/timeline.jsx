import { useEffect, useRef, useState } from "react";
import "./timeline.css";
import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { auth, db } from "../../../firebase";
import Tweet from "../tweet";
import ReTweet from "../re-tweet";
import BackDrop from "../../common/loading";

export default function Timeline() {
  const [tweets, setTweet] = useState([]);
  const user = auth.currentUser;
  const scrollableDivRef = useRef(null);
  const PAGE = 20;
  let lastVisible = null;
  let hasMore = true;
  let lastScrollTop = 0;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchInitialTweets(false);

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

  const handleScroll = () => {
    if (scrollableDivRef.current) {
      const scrollTop = scrollableDivRef.current.scrollTop;

      if (scrollTop - lastScrollTop >= 1900) {
        lastScrollTop = scrollTop;

        const unsubscribe = fetchInitialTweets(true);

        return () => {
          unsubscribe();
        };
      }
    }
  };

  const fetchInitialTweets = async (isScrolled) => {
    setIsLoading(true);

    let tweetsQuery = null;
    if (!isScrolled) {
      tweetsQuery = query(
        collection(db, "tweets"),
        limit(PAGE),
        orderBy("createdAt", "desc")
      );
    } else {
      tweetsQuery = query(
        collection(db, "tweets"),
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

        // 기본 트윗 데이터 설정
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

      // 부모 상태에 트윗 데이터 설정
      if (isScrolled) {
        setTweet((prev) => [...prev, ...tweetsData]);
      } else {
        setTweet(tweetsData);
      }

      // 실시간으로 트윗의 각종 데이터를 업데이트
      tweetsData.forEach(async (tweet) => {
        delete tweet.userId;

        // 이미지 업데이트
        const imagesQuery = query(
          collection(db, "images"),
          where("tweetId", "==", tweet.id),
          orderBy("__name__", "asc")
        );

        onSnapshot(imagesQuery, (snapshot) => {
          const imageArr = snapshot.docs.map((doc) => doc.data().url);

          setTweet((prevTweets) => {
            return prevTweets.map((prevTweet) => {
              if (prevTweet.id === tweet.id) {
                return {
                  ...prevTweet,
                  images: imageArr,
                };
              }
              return prevTweet;
            });
          });
        });

        // 사용자 정보 업데이트
        const userQuery = query(
          collection(db, "user"),
          where("id", "==", tweet.user.id)
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

        // 좋아요 업데이트
        const likesQuery = query(
          collection(db, "likes"),
          where("tweetId", "==", tweet.id)
        );

        onSnapshot(likesQuery, (likeSnapshot) => {
          const likeCount = likeSnapshot.docs.length;
          let likeId = 0;
          const isLiked = likeSnapshot.docs.some((likeDoc) => {
            if (likeDoc.data().userId === user.uid) {
              likeId = likeDoc.id;
              return true;
            }
          });

          setTweet((prevTweets) => {
            return prevTweets.map((prevTweet) => {
              if (prevTweet.id === tweet.id) {
                return {
                  ...prevTweet,
                  like: { isLiked: isLiked, count: likeCount, id: likeId },
                };
              }
              return prevTweet;
            });
          });
        });

        // 댓글 업데이트
        const repliesQuery = query(
          collection(db, "replies"),
          where("tweetId", "==", tweet.id)
        );

        onSnapshot(repliesQuery, (replySnapshot) => {
          const replyCount = replySnapshot.docs.length;

          setTweet((prevTweets) => {
            return prevTweets.map((prevTweet) => {
              if (prevTweet.id === tweet.id) {
                return {
                  ...prevTweet,
                  reply: { count: replyCount },
                };
              }
              return prevTweet;
            });
          });
        });

        // 리트윗 업데이트
        const retweetQuery = query(
          collection(db, "tweets"),
          where("retweetId", "==", tweet.id)
        );

        onSnapshot(retweetQuery, (retweetSnapshot) => {
          const retweetCount = retweetSnapshot.docs.length;

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
    } catch (error) {
      console.error("Error fetching initial tweets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="time-line scrollable" ref={scrollableDivRef}>
      {tweets.map((item, index) =>
        item.retweetId != undefined ? (
          <ReTweet
            key={item.id}
            isLast={index === tweets.length - 1}
            {...item}
          />
        ) : (
          <Tweet key={item.id} isLast={index === tweets.length - 1} {...item} />
        )
      )}
      <BackDrop isLoading={isLoading}></BackDrop>
    </div>
  );
}
