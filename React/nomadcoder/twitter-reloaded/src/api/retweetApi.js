import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

export async function addRetweet(data) {
    const doc = await addDoc(collection(db, "tweets"), {
        tweet: data.tweet,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        like: [],
        reply: { count: 0 },
        retweet: { count: 0 },
        user: { id: user.uid, name: user.displayName, photo: user.photoURL },
    });

    return doc;
}