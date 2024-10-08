import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { timeAgo } from "../../../common/time-ago";
import "./alarm.css";
import { db } from "../../../firebase";

export default function FollowAlarm({ onClickDetail, ...data }) {
  const onClickMutualFollow = async () => {
    const followQuery = query(
      collection(db, "relation"),
      where("__name__", "==", data.relation.id)
    );
    const snapshot = await getDocs(followQuery);
    snapshot.docs.forEach((item) => {
      const docRef = item.ref;
      updateDoc(docRef, { isFollowing: true });
    });
  };

  const onClickFollow = async () => {
    const followQuery = query(
      collection(db, "relation"),
      where("__name__", "==", data.relation.id)
    );
    const snapshot = await getDocs(followQuery);
    snapshot.docs.forEach((item) => {
      const docRef = item.ref;
      updateDoc(docRef, { isFollowing: false });
    });
  };

  return (
    <div className={`alarm_${data.targetId}`} onClick={onClickDetail}>
      <div className="all">
        <img src={data.user.photo} width={50} height={50} />
        <div>{data.content}</div>
        <div className="time">{timeAgo(data.createdAt)}</div>
      </div>
      <div className="right2">
        {data.relation.isFollowing ? (
          <div className="follow-btn" onClick={onClickFollow}>
            팔로우
          </div>
        ) : (
          <div className="mutual-follow-btn" onClick={onClickMutualFollow}>
            맞팔로우
          </div>
        )}
      </div>
    </div>
  );
}
