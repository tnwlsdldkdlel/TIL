import { addDoc, collection, limit, onSnapshot, orderBy, query, startAfter, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export async function addTweet(data) {
    const user = auth.currentUser;

    const doc = await addDoc(collection(db, "tweets"), {
        tweet: data.tweet,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        userId: user.uid,
        like: { isLiked: false, count: 0 },
        reply: { count: 0 },
        retweet: { count: 0 },
        user: { id: user.uid, name: user.displayName, photo: user.photoURL },
    });

    return doc;
}

export async function addTweetImage(doc, uploadImages) {
    await updateDoc(doc, { images: uploadImages });
}

export async function getTweetList(isScrolled, lastVisible, hasMore) {
    let tweetsQuery = null;
    if (!isScrolled) {
        tweetsQuery = query(
            collection(db, "tweets"),
            limit(20),
            orderBy("createdAt", "desc")
        );
    } else {
        tweetsQuery = query(
            collection(db, "tweets"),
            limit(20),
            orderBy("createdAt", "desc"),
            // startAfter(lastVisible)
        );
    }

    const result = new Promise((resolve, reject) => {
        try {
            onSnapshot(tweetsQuery, (snapshot) => {
                hasMore = snapshot.docs.length === 20;
                lastVisible = snapshot.docs[snapshot.docs.length - 1];

                const tweetsData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));

                resolve({ tweetsData, hasMore, lastVisible });
            });
        } catch (error) {
            reject(error);
        }

    })

    return result;

}