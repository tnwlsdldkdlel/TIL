import { useEffect, useState } from "react";
import "./timeline.css";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../../../firebase";
import Tweet from "../tweet";
import ReTweet from "../re-tweet";

export default function Timeline() {
  const [tweets, setTweet] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    const tweetsQuery = query(
      collection(db, "tweets"),
      limit(20),
      orderBy("createdAt", "desc")
    );

    const unsubscribeTweets = onSnapshot(tweetsQuery, (snapshot) => {
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
        };
      });

      // 좋아요, 댓글, 리트윗 수 업데이트
      tweetsData.forEach((tweet) => {
        // 좋아요 쿼리
        const likesQuery = query(
          collection(db, "likes"),
          where("tweetId", "==", tweet.id)
        );

        onSnapshot(likesQuery, (likeSnapshot) => {
          const likeCount = likeSnapshot.docs.length;
          const isLiked = likeSnapshot.docs.some(
            (likeDoc) => likeDoc.data().userId === user.uid
          );

          // 상태 업데이트
          setTweet((prevTweets) => {
            return prevTweets.map((prevTweet) => {
              if (prevTweet.id === tweet.id) {
                return {
                  ...prevTweet,
                  like: { isLiked, count: likeCount },
                };
              }
              return prevTweet;
            });
          });
        });

        // 댓글 쿼리
        const repliesQuery = query(
          collection(db, "replies"),
          where("tweetId", "==", tweet.id)
        );

        onSnapshot(repliesQuery, (replySnapshot) => {
          const replyCount = replySnapshot.docs.length;

          // 상태 업데이트
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

        // 리트윗 쿼리
        const retweetQuery = query(
          collection(db, "tweets"),
          where("retweetId", "==", tweet.id)
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

      // 부모 상태에 트윗 데이터 설정
      setTweet(tweetsData);
    });

    return () => {
      unsubscribeTweets();
    };
  }, []);

  return (
    <div className="time-line scrollable">
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
    </div>
  );
}
