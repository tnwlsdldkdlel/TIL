import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Alarm from "./alarm";
import FollowAlarm from "./follow-alarm";

export default function AlarmDialog({ isOpen, handleClose, onClickDetail }) {
  const [alarms, setAlarms] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    const alarmQuery = query(
      collection(db, "alarm"),
      where("userId", "==", user.uid),
      orderBy("__name__", "desc")
    );

    const unsubscribeAlarms = onSnapshot(alarmQuery, (snapshot) => {
      const alarmsData = snapshot.docs.map((doc) => {
        const alarmData = doc.data();
        const alarmId = doc.id;

        return { ...alarmData, id: alarmId };
      });

      setAlarms(alarmsData);

      alarmsData.forEach((alarm) => {
        if (alarm.tweetId) {
          const tweetQuery = query(
            collection(db, "tweets"),
            where("__name__", "==", alarm.tweetId),
            limit(1)
          );

          onSnapshot(tweetQuery, (snapshot) => {
            const tweetId = snapshot.docs[0].id;
            if (tweetId === alarm.tweetId) {
              const photo = snapshot.docs[0].data().photo;

              setAlarms((prev) => {
                return prev.map((item) => {
                  if (item.id === alarm.id) {
                    return {
                      ...item,
                      photo: photo,
                    };
                  }

                  return item;
                });
              });
            }
          });
        }

        // 팔로우정보
        const followQuery = query(
          collection(db, "follow"),
          where("__name__", "==", alarm.followId)
        );

        onSnapshot(followQuery, async (snapshot) => {
          if (snapshot.docs.length > 0) {
            const followId = snapshot.docs[0].id;
            const followData = snapshot.docs[0].data();
            let isFollowing = false;

            // 나도 팔로우 했는지 확인
            const followCollection = query(
              collection(db, "follow"),
              where("userId", "==", user.uid),
              where("targetId", "==", alarm.targetId)
            );

            const followSnap = await getDocs(followCollection);
            let followingId = "";

            if (followSnap.docs.length !== 0) {
              isFollowing = true;
              followingId = followSnap.docs[0].id;
            }

            if (followData.targetId === user.uid) {
              setAlarms((prev) => {
                return prev.map((item) => {
                  if (item.id === alarm.id) {
                    return {
                      ...item,
                      follow: {
                        id: followId,
                        followingId: followingId,
                        isFollowing: isFollowing,
                      },
                    };
                  }

                  return item;
                });
              });
            }
          }
        });

        const userQuery = query(
          collection(db, "user"),
          where("id", "==", alarm.targetId)
        );

        onSnapshot(userQuery, (snapshot) => {
          const userData = snapshot.docs[0].data();

          if (userData.id === alarm.targetId) {
            const photo = userData.photo;

            setAlarms((prev) => {
              return prev.map((item) => {
                if (item.id === alarm.id) {
                  return {
                    ...item,
                    user: { photo: photo },
                  };
                }

                return item;
              });
            });
          }
        });
      });
    });

    return () => {
      unsubscribeAlarms();
    };
  }, [user.uid]);

  return (
    <Fragment>
      <Dialog className="edit-dialog" open={isOpen} onClose={handleClose}>
        <DialogTitle className="dialog-title">
          알림
          <div className="close-btn" onClick={handleClose}>
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
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </div>
        </DialogTitle>
        <DialogContent className="scrollable">
          {alarms.map((alarm) => {
            return alarm.tweetId ? (
              <Alarm key={alarm.id} onClickDetail={onClickDetail} {...alarm} />
            ) : (
              <FollowAlarm key={alarm.id} {...alarm}></FollowAlarm>
            );
          })}
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
