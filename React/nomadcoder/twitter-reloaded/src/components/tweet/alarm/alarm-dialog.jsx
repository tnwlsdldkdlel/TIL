import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import {
  collection,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import Alarm from "./alarm";

export default function AlarmDialog({ isOpen, handleClose }) {
  const [alarms, setAlarms] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    const alarmQuery = query(
      collection(db, "alarm"),
      where("userId", "==", user.uid)
    );

    const unsubscribeAlarms = onSnapshot(alarmQuery, (snapshot) => {
      const alarmsData = snapshot.docs.map((doc) => {
        const alarmData = doc.data();
        const alarmId = doc.id;

        return { ...alarmData, id: alarmId };
      });

      setAlarms(alarmsData);

      alarmsData.forEach((alarm) => {
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
      });
    });

    return () => {
      unsubscribeAlarms();
    };
  }, []);

  return (
    <Fragment>
      <Dialog className="edit-dialog" open={isOpen} onClose={handleClose}>
        <DialogTitle className="dialog-title">
          Alarm
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
            return (
              <Alarm key={alarm.id} handleClose={handleClose} {...alarm} />
            );
          })}
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
