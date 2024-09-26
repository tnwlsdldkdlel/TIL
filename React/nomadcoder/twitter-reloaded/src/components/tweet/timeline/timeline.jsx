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

        // 자식 컬렉션(예: likes) 스냅샷
        const likesQuery = query(
          collection(db, `likes`),
          where("tweetId", "==", tweetId)
        );

        onSnapshot(likesQuery, (likeSnapshot) => {
          const likeCount = likeSnapshot.docs.length;
          let likeId = 0;
          const isLiked = likeSnapshot.docs.some((likeDoc) => {
            if (likeDoc.data().userId === user.uid) {
              likeId = likeDoc.id;
              return true;
            }
            return false;
          });

          // 부모 상태 업데이트
          setTweet((prevTweets) => {
            return prevTweets.map((tweet) => {
              if (tweet.id === tweetId) {
                return {
                  ...tweet,
                  like: { isLiked, count: likeCount, id: likeId },
                };
              }
              return tweet;
            });
          });
        });

        return {
          ...tweetData,
          id: tweetId,
          like: { isLiked: false, count: 0 }, // 초기값 설정
        };
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
      {tweets.map((item) => (
        <Tweet key={item.id} {...item}></Tweet>
      ))}
    </div>
  );
}
