import { addDoc, collection, getDocs, query, updateDoc, where } from "firebase/firestore";
import { auth, db } from "../firebase";
import { getTweetOnlyOne } from "./tweetApi";

export async function addRetweet(id, retweet, userData) {
    const user = auth.currentUser;

    const reTweet = await getTweetOnlyOne(id);
    const doc = await addDoc(collection(db, "tweets"), {
        tweet: retweet,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        like: [],
        count: {
            reply: 0,
            reTweet: 0
        },
        reTweet: { ...reTweet, id: id },
        user: { id: user.uid, name: user.displayName, photo: user.photoURL },
    });

    // count 업데이트
    const tweetQuery = query(
        collection(db, `tweets`),
        where("__name__", "==", id)
    );
    const querySnapshot = await getDocs(tweetQuery);
    const docRef = querySnapshot.docs[0].ref;
    const tweetData = querySnapshot.docs[0].data();
    const countObj = tweetData.count;
    const udpateCount = { ...countObj, reTweet: countObj.reTweet + 1 };

    await updateDoc(docRef, {
        count: udpateCount
    });

    // 알람
    if (userData.id !== user.uid) {
        const content = `${user.displayName}님이 ${retweet.length > 10 ? retweet.substr(0, 10) + "..." : retweet
            }글을 리포스팅했습니다.`;
        await addDoc(collection(db, "alarm"), {
            userId: userData.id, // 리포스팅 당한 사람 uid
            targetId: user.uid, // 리포스팅한 사람 uid
            content: content,
            tweetId: id,
            isChecked: false,
            createdAt: Date.now(),
        });

        return doc;
    }
}

