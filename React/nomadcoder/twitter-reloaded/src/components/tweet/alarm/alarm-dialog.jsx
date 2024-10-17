import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { differenceInCalendarDays } from "date-fns";
import { Fragment, useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Alarm from "./alarm";
import FollowAlarm from "./follow-alarm";

export default function AlarmDialog({ isOpen, handleClose, onClickDetail }) {
  const [alarms, setAlarms] = useState({
    today: [],
    yesterday: [],
    last7days: [],
    last30days: [],
    previous: [],
  });
  const user = auth.currentUser;

  useEffect(() => {
    getAlarm();
  }, [isOpen]);

  const getAlarm = async () => {
    const today = new Date();

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
    snapshot.docs.forEach((doc) => {
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

    const alarmData = {
      today: todays,
      yesterday: yesterdays,
      last7days: last7days,
      last30days: last30days,
      previous: previous,
    };

    setAlarms(alarmData);

    for (const day in alarmData) {
      alarmData[day].map(async (alarm) => {
        if (alarm.tweetId) {
          const tweetQuery = query(
            collection(db, "tweets"),
            where("__name__", "==", alarm.tweetId),
            limit(1)
          );

          const snapshot = await getDocs(tweetQuery);
          const tweetId = snapshot.docs[0].id;

          if (tweetId === alarm.tweetId) {
            setAlarms((prev) => ({
              ...prev,
              [day]: prev[day].map((item) => {
                if (item.id === alarm.id) {
                  return {
                    ...item,
                    images: "",
                  };
                }
                return item;
              }),
            }));

            const imagesQuery = query(
              collection(db, "images"),
              where("tweetId", "==", alarm.tweetId),
              orderBy("__name__", "asc"),
              limit(1)
            );

            const imagesSnapshot = await getDocs(imagesQuery);
            if (imagesSnapshot.docs[0]) {
              const tweetId = imagesSnapshot.docs[0].data().tweetId;

              if (tweetId === alarm.tweetId) {
                setAlarms((prev) => ({
                  ...prev,
                  [day]: prev[day].map((item) => {
                    if (item.id === alarm.id) {
                      return {
                        ...item,
                        images: imagesSnapshot.docs[0].data().url,
                      };
                    }
                    return item;
                  }),
                }));
              }
            }
          }
        }

        // 팔로우 정보 업데이트
        if (alarm.followId) {
          const followQuery = query(
            collection(db, "follow"),
            where("__name__", "==", alarm.followId)
          );

          const followSnapshot = await getDocs(followQuery);
          if (followSnapshot.docs.length > 0) {
            const followId = followSnapshot.docs[0].id;
            const followData = followSnapshot.docs[0].data();
            let isFollowing = false;

            // 나도 팔로우했는지 확인
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
              setAlarms((prev) => ({
                ...prev,
                [day]: prev[day].map((item) => {
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
                }),
              }));
            }
          }
        }

        // 사용자 정보 업데이트
        if (alarm.targetId) {
          const userQuery = query(
            collection(db, "user"),
            where("id", "==", alarm.targetId)
          );

          const userSnapshot = await getDocs(userQuery);
          const userData = userSnapshot.docs[0].data();

          if (userData.id === alarm.targetId) {
            const photo = userData.photo;

            setAlarms((prev) => ({
              ...prev,
              [day]: prev[day].map((item) => {
                if (item.id === alarm.id) {
                  return {
                    ...item,
                    user: { photo: photo },
                  };
                }
                return item;
              }),
            }));
          }
        }
      });
    }
  };

  return (
    <Fragment>
      <Dialog
        className="edit-dialog"
        open={isOpen}
        onClose={handleClose}
        PaperProps={{
          sx: {
            backgroundColor: "black",
            border: "1px solid white",
            borderRadius: "20px",
            resize: "none",
            width: "730px",
            height: "fit-content",
            color: "white",
            maxWidth: "730px",
          },
        }}
      >
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
          {alarms ? (
            <>
              {alarms.today.length > 0 && (
                <div>
                  <h3>오늘</h3>
                  {alarms.today.map((alarm) =>
                    alarm.tweetId ? (
                      <Alarm
                        key={alarm.id}
                        onClickDetail={onClickDetail}
                        {...alarm}
                      />
                    ) : (
                      <FollowAlarm key={alarm.id} {...alarm} />
                    )
                  )}
                </div>
              )}

              {alarms.yesterday.length > 0 && alarms.today.length > 0 ? (
                <div className="line"></div>
              ) : null}

              {alarms.yesterday.length > 0 && (
                <div>
                  <h3>어제</h3>
                  {alarms.yesterday.map((alarm) =>
                    alarm.tweetId ? (
                      <Alarm
                        key={alarm.id}
                        onClickDetail={onClickDetail}
                        {...alarm}
                      />
                    ) : (
                      <FollowAlarm key={alarm.id} {...alarm} />
                    )
                  )}
                </div>
              )}

              {alarms.yesterday.length > 0 && alarms.last7days.length > 0 ? (
                <div className="line"></div>
              ) : null}

              {alarms.last7days.length > 0 && (
                <div>
                  <h3>최근 7일</h3>
                  {alarms.last7days.map((alarm) =>
                    alarm.tweetId ? (
                      <Alarm
                        key={alarm.id}
                        onClickDetail={onClickDetail}
                        {...alarm}
                      />
                    ) : (
                      <FollowAlarm key={alarm.id} {...alarm} />
                    )
                  )}
                </div>
              )}

              {alarms.last7days.length > 0 && alarms.last30days.length > 0 ? (
                <div className="line"></div>
              ) : null}

              {alarms.last30days.length > 0 && (
                <div>
                  <h3>최근 30일</h3>
                  {alarms.last30days.map((alarm) =>
                    alarm.tweetId ? (
                      <Alarm
                        key={alarm.id}
                        onClickDetail={onClickDetail}
                        {...alarm}
                      />
                    ) : (
                      <FollowAlarm key={alarm.id} {...alarm} />
                    )
                  )}
                </div>
              )}

              {alarms.last30days.length > 0 && alarms.previous.length > 0 ? (
                <div className="line"></div>
              ) : null}

              {alarms.previous.length > 0 && (
                <div>
                  <h3>이전 활동</h3>
                  {alarms.previous.map((alarm) =>
                    alarm.tweetId ? (
                      <Alarm
                        key={alarm.id}
                        onClickDetail={onClickDetail}
                        {...alarm}
                      />
                    ) : (
                      <FollowAlarm key={alarm.id} {...alarm} />
                    )
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="empty">아직 알림이 없습니다.</div>
          )}
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
