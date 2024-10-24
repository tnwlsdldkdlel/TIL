import { addDoc, collection, deleteDoc, doc, endAt, getDocs, orderBy, query, startAt, where } from "firebase/firestore";
import { auth, db } from "../firebase";
import { deleteFollowAlarm } from "./alarmApi";

export async function getFollower(uid, search) {
    const followerQuery = query(
        collection(db, "follow"),
        where("targetId", "==", uid)
    );
    const followerSnapshot = await getDocs(followerQuery);
    let followerList = [];

    for (const item of followerSnapshot.docs) {
        const followerData = item.data();
        const userId = followerData.userId;

        let userQuery = query(
            collection(db, "user"),
            where("id", "==", userId)
        );

        if (search) {
            userQuery = query(
                collection(db, "user"),
                where("id", "==", userId),
                orderBy("name"),
                startAt(search),
                endAt(search + "\uf8ff")
            );
        }

        const userSnapshot = await getDocs(userQuery);
        const userData = userSnapshot.docs[0]?.data();

        // 맞팔로우 여부 확인
        const followingQuery = query(
            collection(db, "follow"),
            where("userId", "==", uid),
            where("targetId", "==", userId)
        );

        const followingSnapshot = await getDocs(followingQuery);
        const isFollowing = followingSnapshot.docs.length !== 0;

        if (userData) {
            followerData.id = item.id;
            followerData.isFollowing = isFollowing;
            followerData.user = {
                id: userId,
                photo: userData.photo,
                name: userData.name,
            };

            followerList.push(followerData);
        }
    }

    return followerList;
}

export async function getFollwing(uid, search) {
    const followerQuery = query(
        collection(db, "follow"),
        where("userId", "==", uid)
    );

    const followerSnapshot = await getDocs(followerQuery);
    let followerList = [];

    for (const item of followerSnapshot.docs) {
        const followerData = item.data();
        const targetId = followerData.targetId;

        let userQuery = query(
            collection(db, "user"),
            where("id", "==", targetId)
        );

        if (search) {
            userQuery = query(
                collection(db, "user"),
                where("id", "==", targetId),
                orderBy("name"),
                startAt(search),
                endAt(search + "\uf8ff")
            );
        }

        const userSnapshot = await getDocs(userQuery);
        const userData = userSnapshot.docs[0]?.data();

        if (userData) {
            followerData.isFollowing = true;
            followerData.id = item.id;
            followerData.user = {
                id: targetId,
                photo: userData.photo,
                name: userData.name,
            };

            followerList.push(followerData);
        }
    }

    return followerList;

}

export async function getFollwInfo(userId) {
    const loginedUser = auth.currentUser;
    const loginedUserUid = loginedUser.uid;

    const isfollowQuery = query(
        collection(db, "follow"),
        where("userId", "==", loginedUserUid),
        where("targetId", "==", userId)
    );
    const isFollowingSnapshot = await getDocs(isfollowQuery);
    const isFollow = isFollowingSnapshot.docs.length > 0 ? true : false;
    const id = isFollow ? isFollowingSnapshot.docs[0].id : "";

    return { isFollow: isFollow, id: id }
}

export async function setUnfollow(followId) {
    await deleteDoc(doc(db, "follow", followId));
}

export async function setfollow(userId) {
    const loginedUser = auth.currentUser;
    const loginedUserUid = loginedUser.uid;

    const doc = await addDoc(collection(db, "follow"), {
        userId: loginedUserUid, // 팔로우 건 사람
        targetId: userId, // 팔로우 당한 사람
        createdAt: Date.now(),
        updatedAt: Date.now(),
    });

    const content = `${loginedUser.displayName}님이 팔로우하기 시작했습니다.`;
    await addDoc(collection(db, "alarm"), {
        userId: userId, //   당한 사람 uid
        targetId: loginedUserUid, // 팔로우한 사람
        followId: doc.id,
        content: content,
        isChecked: false,
        createdAt: Date.now(),
    });

    return doc.id;
}

export async function deleteRemoveFollow(followId) {
    const followQuery = query(
        collection(db, "follow"),
        where("__name__", "==", followId)
    );

    const followSnapshot = await getDocs(followQuery);
    if (followSnapshot.docs.length > 0) {
        const followData = followSnapshot.docs[0].data();

        // 상대방의 팔로우 목록에서 나를 지운다. targetId : 상대방 userId : 나
        const targetFollowQuery = query(
            collection(db, "follow"),
            where("userId", "==", followData.targetId),
            where("targetId", "==", followData.userId),
        );
        const targetFollowSnapshot = await getDocs(targetFollowQuery);
        await deleteDoc(doc(db, "follow", targetFollowSnapshot.docs[0].id));

        // 나도 상대방을 팔로우 목록에서 지운다.
        await deleteDoc(doc(db, "follow", followId));

        // 알람도 삭제.
        await deleteFollowAlarm(followId);
        await deleteFollowAlarm(targetFollowSnapshot.docs[0].id);
    }
}

export async function checkIsFollowing(targetId, userId) {
    // 맞팔로우 여부 확인
    const followingQuery = query(
        collection(db, "follow"),
        where("userId", "==", userId),
        where("targetId", "==", targetId)
    );

    const followingSnapshot = await getDocs(followingQuery);
    const isFollowing = followingSnapshot.docs.length !== 0;

    return isFollowing;
}
