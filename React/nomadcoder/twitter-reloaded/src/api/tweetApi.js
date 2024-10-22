import { addDoc, collection, deleteDoc, doc, getDocs, limit, orderBy, query, startAfter, updateDoc, where } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { deleteObject, ref } from "firebase/storage";
import { deleteLikeTweetAlarm, likeTweetAlarm } from "./alarmApi";

export async function addTweet(data) {
    const user = auth.currentUser;

    const doc = await addDoc(collection(db, "tweets"), {
        tweet: data.tweet,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        like: [],
        user: { id: user.uid, name: user.displayName, photo: user.photoURL },
    });

    return doc;
}

export async function addTweetImage(doc, uploadImages) {
    await updateDoc(doc, { images: uploadImages });
}

export async function getTweetList(isScrolled, lastVisible) {
    try {
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
                startAfter(lastVisible)
            );
        }

        const snapshot = await getDocs(tweetsQuery);
        const hasMore = snapshot.docs.length === 20;
        const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];

        const tweetsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return { tweetsData, hasMore, lastVisible: lastVisibleDoc };
    } catch (error) {
        console.error("Error fetching tweets: ", error);
        throw error;
    }
}

export async function deleteTweet(tweetId) {
    try {
        const tweetQuery = query(
            collection(db, `tweets`),
            where("__name__", "==", tweetId)
        );
        const querySnapshot = await getDocs(tweetQuery);
        const tweetData = querySnapshot.docs[0].data();

        // images storage
        if (tweetData.images.length > 0) {
            tweetData.images.forEach(async (image) => {
                // storage 삭제
                const path = decodeURIComponent(image.split("/o/")[1].split("?")[0]);
                const photoRef = ref(storage, path);
                await deleteObject(photoRef);
            });
        }

        // tweets
        await deleteDoc(doc(db, "tweets", tweetId));

        // alarm
        const alarmQuery = query(
            collection(db, "alarm"),
            where("tweetId", "==", tweetId)
        );
        // alarm
        const alarmSnapshot = await getDocs(alarmQuery);
        alarmSnapshot.forEach(async (item) => {
            await deleteDoc(doc(db, "alarm", item.id));
        });
    } catch (error) {
        console.log(error);
    }
}

export async function likeTweet(data) {
    const loginedUser = auth.currentUser;
    const loginedUserUid = loginedUser.uid;

    try {
        const tweetQuery = query(
            collection(db, `tweets`),
            where("__name__", "==", data.id)
        );

        const querySnapshot = await getDocs(tweetQuery);
        const docRef = querySnapshot.docs[0].ref;
        const tweetData = querySnapshot.docs[0].data();
        const likedUser = tweetData.like || [];

        // 이미 내가 좋아요를 눌렀을 경우
        if (likedUser.includes(loginedUserUid)) {
            const updateLikedUser = likedUser.filter((prev) => prev !== loginedUserUid);

            await updateDoc(docRef, {
                like: updateLikedUser
            });

            // 알림 삭제
            await deleteLikeTweetAlarm(data.id);
            return updateLikedUser;
        } else {
            const updateLikedUser = [...likedUser, loginedUserUid];

            await updateDoc(docRef, {
                like: updateLikedUser
            });

            // 알람 추가 (본인 글 제외)
            if (data.user.id !== loginedUserUid) {
                await likeTweetAlarm(loginedUser, data);
            }

            return updateLikedUser;
        }
    } catch (error) {
        console.error("Error in likeTweet:", error);
        throw error;
    }
}

export async function getMyTweetList(isScrolled, lastVisible, userId) {
    try {
        let tweetsQuery = null;

        if (!isScrolled) {
            tweetsQuery = query(
                collection(db, "tweets"),
                where("user.id", "==", userId),
                limit(20),
                orderBy("createdAt", "desc")
            );
        } else {
            tweetsQuery = query(
                collection(db, "tweets"),
                where("user.id", "==", userId),
                limit(20),
                orderBy("createdAt", "desc"),
                startAfter(lastVisible)
            );
        }

        const snapshot = await getDocs(tweetsQuery);
        const hasMore = snapshot.docs.length === 20;
        const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];

        const tweetsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return { tweetsData, hasMore, lastVisible: lastVisibleDoc };
    } catch (error) {
        console.error("Error fetching tweets: ", error);
        throw error;
    }
}

export async function getTweetOnlyOne(tweetId) {
    const replyQuery = query(
        collection(db, `tweets`),
        where("__name__", "==", tweetId)
    );
    const querySnapshot = await getDocs(replyQuery);
    return querySnapshot.docs[0].data();
}