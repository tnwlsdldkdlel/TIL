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
import { JoinFull, JoinLeft } from "@mui/icons-material";

export default function Timeline() {
  const [tweets, setTweet] = useState([]);

  useEffect(() => {
    let unsubcribe = null;

    const fetchTweents = async () => {
      const tweetsQuery = query(
        collection(db, "tweets"),
        JoinLeft(db, "likes"),
        orderBy("createdAt", "desc"),
        limit(25)
      );

      unsubcribe = await onSnapshot(tweetsQuery, (snapshot) => {
        const tweets = snapshot.docs.map((doc) => {
          const {
            tweet,
            createdAt,
            updatedAt,
            userId,
            username,
            photo,
            id = doc.id,
            like,
          } = doc.data();
          return {
            tweet,
            createdAt,
            updatedAt,
            userId,
            username,
            photo,
            id,
            like,
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
