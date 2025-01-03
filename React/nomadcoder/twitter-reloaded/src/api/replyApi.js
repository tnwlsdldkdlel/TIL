import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
import { auth, db } from "../firebase";
import { deleteLikeReplyAlarm, likeReplyAlarm, tweetReplyAlarm } from "./alarmApi";
import { getTweetOnlyOne } from "./tweetApi";

export async function addReply(input, tweetId, userId) {
    const loginedUser = auth.currentUser;
    const loginedUserUid = loginedUser.uid;

    try {
        await addDoc(collection(db, "replies"), {
            reply: input,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            user: {
                id: loginedUserUid,
                name: loginedUser.displayName,
                photo: loginedUser.photoURL
            },
            tweet: {
                id: tweetId,
            },
            like: [],
        });

        const tweetQuery = query(
            collection(db, `tweets`),
            where("__name__", "==", tweetId)
        );
        const querySnapshot = await getDocs(tweetQuery);
        const docRef = querySnapshot.docs[0].ref;
        const tweetData = querySnapshot.docs[0].data();
        const countObj = tweetData.count;
        const udpateCount = { ...countObj, reply: countObj.reply + 1 };

        await updateDoc(docRef, {
            count: udpateCount
        });

        // 알람 추가 (본인 글 제외)
        if (tweetData !== loginedUserUid) {
            await tweetReplyAlarm(loginedUser, tweetId, tweetData);
        }

        return udpateCount;
    } catch (error) {
        console.log(error)
    }
}

export async function replyLike(replyId) {
    const loginedUser = auth.currentUser;
    const loginedUserUid = loginedUser.uid;

    const replyQuery = query(
        collection(db, `replies`),
        where("__name__", "==", replyId)
    );
    const querySnapshot = await getDocs(replyQuery);
    const docRef = querySnapshot.docs[0].ref;
    const replyData = querySnapshot.docs[0].data();
    const likedUser = replyData.like || [];

    // 이미 내가 좋아요를 눌렀을 경우
    if (likedUser.includes(loginedUserUid)) {
        const updateLikedUser = likedUser.filter((prev) => prev !== loginedUserUid);

        await updateDoc(docRef, {
            like: updateLikedUser
        });

        // 알림 삭제
        await deleteLikeReplyAlarm(querySnapshot.docs[0].id);
        return updateLikedUser;
    } else {
        const updateLikedUser = [...likedUser, loginedUserUid];

        await updateDoc(docRef, {
            like: updateLikedUser
        });

        const tweetInfo = await getTweetOnlyOne(replyData.tweet.id);

        // 알람 추가 (본인 글 제외)
        if (replyData.user.id !== loginedUserUid) {
            await likeReplyAlarm(loginedUser, replyData, tweetInfo);
        }

        return updateLikedUser;
    }
}

export async function getReplyList(tweetId) {
    const repliesQuery = query(
        collection(db, "replies"),
        where("tweet.id", "==", tweetId),
        orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(repliesQuery);
    const replyData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));

    return replyData;
}

export async function deleteReply(replyId) {
    await deleteDoc(doc(db, "replies", replyId));
}