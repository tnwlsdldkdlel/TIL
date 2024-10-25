import { addDoc, collection, endAt, getDocs, orderBy, query, startAt, updateDoc, where } from "firebase/firestore";
import { auth, db } from "../firebase";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, updateProfile } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { FirebaseErrorMessage } from "../common/firebase-error";

export async function getUserInfo(userId) {
    // tweet count
    const tweetsQuery = query(
        collection(db, "tweets"),
        where("userId", "==", userId)
    );

    // follower count
    const followerQuery = query(
        collection(db, "follow"),
        where("targetId", "==", userId)
    );

    // following count
    const followingQuery = query(
        collection(db, "follow"),
        where("userId", "==", userId)
    );

    const [tweetSnapshot, followerSnapshot, followingSnapshot] = await Promise.all([
        getDocs(tweetsQuery),
        getDocs(followerQuery),
        getDocs(followingQuery),
    ]);

    const tweet = tweetSnapshot.docs.length;
    const follower = followerSnapshot.docs.length;
    const following = followingSnapshot.docs.length;

    // 회원정보
    const infoQuery = query(collection(db, "user"), where("id", "==", userId));
    const userSnapshot = await getDocs(infoQuery);
    const result = userSnapshot.docs.map((doc) => {
        const infoData = doc.data();
        return {
            intro: infoData.intro,
            name: infoData.name,
            photo: infoData.photo,
            count: { tweet: tweet, follower: follower, following: following },
        }
    });

    return result[0];
}

export async function getEditInfo() {
    const loginedUser = auth.currentUser;
    const loginedUserUid = loginedUser.uid;

    const infoQuery = query(
        collection(db, "user"),
        where("id", "==", loginedUserUid)
    );
    const infoData = (await getDocs(infoQuery)).docs[0].data();
    return {
        intro: infoData.intro || "",
        prevIntro: infoData.intro || "",
    }
}

export async function updatedUser(input) {
    const loginedUser = auth.currentUser;
    const loginedUserUid = loginedUser.uid;

    try {
        if (
            (!input.password1 && !input.password2 && !input.prevPassword) ||
            (input.password1 && input.password2 && input.prevPassword)
        ) {
            if (input.name !== loginedUser.displayName) {
                await updateProfile(loginedUser, { displayName: input.name });
            }

            if (input.password1 && (input.password1 === input.password2)) {
                try {
                    const credential = EmailAuthProvider.credential(
                        loginedUser.email,
                        input.prevPassword
                    );
                    await reauthenticateWithCredential(loginedUser, credential);
                    await updatePassword(loginedUser, input.password1);
                } catch (error) {
                    console.log(error)
                }

            }

            const userQuery = query(
                collection(db, "user"),
                where("id", "==", loginedUserUid)
            );

            const querySnapshot = await getDocs(userQuery);
            if (!querySnapshot.empty) {
                const docRef = querySnapshot.docs[0].ref;

                await updateDoc(docRef, {
                    intro: input.intro,
                    name: input.name,
                    updatedAt: Date.now(),
                });
            }

            return { isError: false, message: "" }
        } else {
            return { isError: true, message: "비밀번호를 확인해주세요." }
        }
    } catch (error) {
        if (error instanceof FirebaseError) {
            return { isError: true, message: FirebaseErrorMessage(error) }
        }
    }
}

export async function setProfileUrl(url) {
    const loginedUser = auth.currentUser;
    const loginedUserUid = loginedUser.uid;

    const userQuery = query(
        collection(db, "user"),
        where("id", "==", loginedUserUid)
    );
    const querySnapshot = await getDocs(userQuery);
    const docRef = querySnapshot.docs[0].ref;
    await updateDoc(docRef, {
        photo: url,
        updatedAt: Date.now(),
    });
}

export async function login(result) {
    const userQuery = query(
        collection(db, "user"),
        where("id", "==", result.user.uid)
    );
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
        await addDoc(collection(db, "user"), {
            createdAt: Date.now(),
            updatedAt: Date.now(),
            id: result.user.uid,
            name: result.user.displayName,
            photo: result.user.photoURL,
        });
    }
}

export async function getUserList(search) {
    const userQuery = query(
        collection(db, "user"),
        orderBy("name"),
        startAt(search),
        endAt(search + "\uf8ff")
    );
    const userSnapshot = await getDocs(userQuery);
    const result = userSnapshot.docs.map((item) => {
        return item.data();
    })

    return result;
}