import { useEffect, useState } from "react";
import "./timeline.css";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase";
import Tweet from "./tweet";

export default function Timeline() {
  const [tweets, setTweet] = useState([]);

  const fetchTweents = async () => {
    const tweetsQuery = query(
      collection(db, "tweets"),
      orderBy("createdAt", "desc")
    );
    // const spanshot = await getDocs(tweetsQuery);
    await onSnapshot(tweetsQuery, (snapshot) => {
      snapshot.docs.map((doc) => setTweet((prev) => [...prev, doc.data()]));
    });
  };

  useEffect(() => {
    fetchTweents();
  }, []);

  return (
    <div>
      {tweets.map((item) => (
        <Tweet key={item.id} {...item}></Tweet>
      ))}
    </div>
  );
}
