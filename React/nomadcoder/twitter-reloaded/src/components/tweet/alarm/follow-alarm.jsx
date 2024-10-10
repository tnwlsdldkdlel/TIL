import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { timeAgo } from "../../../common/time-ago";
import "./alarm.css";
import { auth, db } from "../../../firebase";

export default function FollowAlarm({ ...data }) {
  const user = auth.currentUser;

  const onClickFollow = async () => {
    // 팔로우한 경우 팔로우를 취소
    if (data.follow.isFollowing) {
      const alramQuery = query(
        collection(db, "alarm"),
        where("followId", "==", data.follow.followingId)
      );
      const alarmSnapshot = await getDocs(alramQuery);
      alarmSnapshot.forEach(async (item) => {
        await deleteDoc(doc(db, "alarm", item.id));
      });

      await deleteDoc(doc(db, "follow", data.follow.followingId));
      const docRef = doc(db, "follow", data.follow.id);

      await updateDoc(docRef, {
        updatedAt: Date.now(),
      });
    } else {
      const docRef = doc(db, "follow", data.follow.id);
      await updateDoc(docRef, {
        updatedAt: Date.now(),
      });

      const followDoc = await addDoc(collection(db, "follow"), {
        userId: user.uid, // 팔로우 건 사람
        targetId: data.targetId, // 팔로우 당한 사람
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      const content = `${user.displayName}님이 팔로우하기 시작했습니다.`;
      await addDoc(collection(db, "alarm"), {
        userId: data.targetId, // 팔로우 당한 사람 uid
        targetId: user.uid, // 팔로우한 사람
        followId: followDoc.id,
        content: content,
        isChecked: false,
        createdAt: Date.now(),
      });
    }
  };

  return (
    <div className={`alarm_${data.targetId}`}>
      <div className="all">
        {data.user && data.user.photo ? (
          <img src={data.user.photo} />
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </>
        )}
        <div>{data.content}</div>
        <div className="time">{timeAgo(data.createdAt)}</div>
      </div>
      <div className="right2">
        {data.follow && data.follow.isFollowing ? (
          <div className="follow-btn" onClick={onClickFollow}>
            팔로우
          </div>
        ) : (
          <div className="mutual-follow-btn" onClick={onClickFollow}>
            맞팔로우
          </div>
        )}
      </div>
    </div>
  );
}
