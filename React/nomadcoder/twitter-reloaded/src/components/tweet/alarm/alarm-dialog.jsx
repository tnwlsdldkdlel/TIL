import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Fragment, memo, useEffect, useState } from "react";
import Alarm from "./alarm";
import FollowAlarm from "./follow-alarm";
import { getAlarmList } from "../../../api/alarmApi";

function AlarmDialog({ isOpen, handleClose, onClickDetail }) {
  const [alarms, setAlarms] = useState({
    today: [],
    yesterday: [],
    last7days: [],
    last30days: [],
    previous: [],
  });

  useEffect(() => {
    getAlarm();
  }, [isOpen]);

  const getAlarm = async () => {
    const list = await getAlarmList();
    setAlarms(list);
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
                    alarm.tweet ? (
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
                    alarm.tweet ? (
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
                    alarm.tweet ? (
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
                    alarm.tweet ? (
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
                    alarm.tweet ? (
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

export default memo(AlarmDialog);
