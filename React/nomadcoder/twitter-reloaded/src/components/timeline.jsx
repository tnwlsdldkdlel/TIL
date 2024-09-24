import { useEffect, useState } from "react";
import "./timeline.css";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase";
import Tweet from "./tweet";

export default function Timeline() {
  const [tweets, setTweet] = useState([]);

  useEffect(() => {
    let unsubcribe = null;

    const fetchTweents = async () => {
      const tweetsQuery = query(
        collection(db, "tweets"),
        orderBy("createdAt", "desc"),
        limit(25)
      );
      // const spanshot = await getDocs(tweetsQuery);
      unsubcribe = await onSnapshot(tweetsQuery, (snapshot) => {
        const tweets = snapshot.docs.map((doc) => {
          const {
            tweet,
            createdAt,
            userId,
            username,
            photo,
            id = doc.id,
          } = doc.data();
          return {
            tweet,
            createdAt,
            userId,
            username,
            photo,
            id,
          };
        });
        setTweet(tweets);
      });
    };

    fetchTweents();

    return () => {
      unsubcribe && unsubcribe();
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
