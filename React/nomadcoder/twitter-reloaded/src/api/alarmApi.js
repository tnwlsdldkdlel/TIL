import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, updateDoc, where } from "firebase/firestore";
import { auth, db } from "../firebase";
import { differenceInCalendarDays } from "date-fns";

export async function getAlarmList() {
    const today = new Date();
    const user = auth.currentUser;

    const alarmQuery = query(
        collection(db, "alarm"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
    );

    const todays = [];
    const yesterdays = [];
    const last7days = [];
    const last30days = [];
    const previous = [];

    const snapshot = await getDocs(alarmQuery);
    const result = snapshot.docs.map((doc) => {
        const alarmData = doc.data();
        const alarmId = doc.id;

        const alarmDate = new Date(alarmData.createdAt);
        const diffDays = differenceInCalendarDays(today, alarmDate);

        if (diffDays === 0) {
            todays.push({ ...alarmData, id: alarmId });
        } else if (diffDays === 1) {
            yesterdays.push({ ...alarmData, id: alarmId });
        } else if (diffDays <= 7) {
            last7days.push({ ...alarmData, id: alarmId });
        } else if (diffDays <= 30) {
            last30days.push({ ...alarmData, id: alarmId });
        } else {
            previous.push({ ...alarmData, id: alarmId });
        }
    });

    await Promise.all(result);

    const alarmData = {
        today: todays,
        yesterday: yesterdays,
        last7days: last7days,
        last30days: last30days,
        previous: previous,
    };

    return alarmData;
}

export async function likeTweetAlarm(loginedUser, data) {
    try {
        const content = `${loginedUser.displayName}님이 ${data.tweet.length > 10 ? data.tweet.substr(0, 10) + "..." : data.tweet} 글을 좋아합니다.`;
        await addDoc(collection(db, "alarm"), {
            userId: data.user.id, // 좋아요 당한 사람 uid
            targetId: loginedUser.uid, // 좋아요 한 사람 uid
            content: content,
            isChecked: false,
            createdAt: Date.now(),
            tweet: {
                id: data.id,
                images: data.images.length > 0 ? data.images[0] : ""
            },
            user: {
                photo: loginedUser.photoURL
            }
        });
    } catch (error) {
        console.log(error)
    }
}

export async function repostTweetAlarm(loginedUser, data, tweetId) {
    try {
        const content = `${loginedUser.displayName}님이 ${data.tweet.length > 10 ? data.tweet.substr(0, 10) + "..." : data.tweet} 글을 리포스팅했습니다.`;

        await addDoc(collection(db, "alarm"), {
            userId: data.user.id, // 좋아요 당한 사람 uid
            targetId: loginedUser.uid, // 좋아요 한 사람 uid
            content: content,
            isChecked: false,
            createdAt: Date.now(),
            tweet: {
                id: tweetId,
                images: data.images.length > 0 ? data.images[0] : ""
            },
            user: {
                photo: loginedUser.photoURL
            }
        });
    } catch (error) {
        console.log(error)
    }
}

export async function deleteLikeTweetAlarm(tweetId) {
    const alarmQuery = query(
        collection(db, "alarm"),
        where("tweet.id", "==", tweetId)
    );
    const alarmSnapshot = await getDocs(alarmQuery);
    alarmSnapshot.forEach(async (item) => {
        await deleteDoc(doc(db, "alarm", item.id));
    });
}

export async function tweetReplyAlarm(user, tweetId, data) {
    try {
        const content = `${user.displayName}님이 ${data.tweet.length > 10 ? data.tweet.substr(0, 10) + "..." : data.tweet}글에 댓글을 달았습니다.`;

        await addDoc(collection(db, "alarm"), {
            userId: data.user.id, // 댓글을 당한 사람 uid
            targetId: user.uid, // 댓글을 한 사람 uid
            content: content,
            tweet: {
                id: tweetId,
                images: data.images.length > 0 ? data.images[0] : ""
            },
            user: {
                photo: user.photoURL
            },
            isChecked: false,
            createdAt: Date.now(),
        });
    } catch (error) {
        console.log(error)
    }
}

export async function deleteLikeReplyAlarm(replyId) {
    const alarmQuery = query(
        collection(db, "alarm"),
        where("reply.id", "==", replyId)
    );
    const alarmSnapshot = await getDocs(alarmQuery);
    alarmSnapshot.forEach(async (item) => {
        await deleteDoc(doc(db, "alarm", item.id));
    });
}

export async function likeReplyAlarm(loginedUser, reply, tweet) {
    try {
        const content = `${loginedUser.displayName}님이 ${reply.reply > 10 ? reply.reply.substr(0, 10) + "..." : reply.reply} 댓글을 좋아합니다.`;
        await addDoc(collection(db, "alarm"), {
            userId: reply.user.id, // 좋아요 당한 사람 uid
            targetId: loginedUser.uid, // 좋아요 한 사람 uid
            content: content,
            isChecked: false,
            createdAt: Date.now(),
            tweet: {
                id: tweet.id,
                images: tweet.images.length > 0 ? tweet.images[0] : ""
            },
            user: {
                photo: loginedUser.photoURL
            }
        });
    } catch (error) {
        console.log(error)
    }
}

export function isCheckedAlarm(callback) {
    const user = auth.currentUser;

    const repliesQuery = query(
        collection(db, "alarm"),
        where("isChecked", "==", false),
        where("userId", "==", user.uid),
        orderBy("__name__", "desc")
    );

    onSnapshot(repliesQuery, (replySnapshot) => {
        const alarmCount = replySnapshot.docs.length;
        callback(alarmCount);
    });
}

export async function setChecked() {
    const alarmsCollection = collection(db, "alarm");
    const snapshot = await getDocs(alarmsCollection);

    snapshot.docs.forEach((item) => {
        const docRef = item.ref;
        updateDoc(docRef, { isChecked: true });
    });

    return true;
}

export async function deleteFollowAlarm(followId) {
    const alarmQuery = query(
        collection(db, "alarm"),
        where("followId", "==", followId)
    );
    const alarmSnapshot = await getDocs(alarmQuery);
    alarmSnapshot.forEach(async (item) => {
        await deleteDoc(doc(db, "alarm", item.id));
    });
}