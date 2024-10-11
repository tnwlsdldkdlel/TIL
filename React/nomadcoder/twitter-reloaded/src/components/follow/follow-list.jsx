import "./follower.css";
import { IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import FollowRemoveDialog from "./follow-remove-dialog";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";

export default function FollowList({ ...data }) {
  const [isOpen, setOpen] = useState(false);
  const navigate = useNavigate();
  const user = auth.currentUser;

  const onClickMenu = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onClickProfile = () => {
    navigate(`/profile`, { state: { userId: data.user.id } });
  };

  const onClickFollow = async () => {
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
  };

  return (
    <div className="follow-list">
      <div className="follow-item">
        <div className="left" onClick={onClickProfile}>
          {data.user.photo ? (
            <img className="photo" src={data.user.photo}></img>
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
          <div className="name">{data.user.name}</div>
        </div>
        <div className="right">
          {data.isFollowing ? (
            <div className="menu">
              <IconButton
                className="btn"
                aria-label="more"
                id="long-button"
                aria-controls={open ? "long-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="true"
                onClick={onClickMenu}
              >
                <MoreVertIcon />
              </IconButton>
            </div>
          ) : (
            <div className="follow-btn" onClick={onClickFollow}>
              팔로우
            </div>
          )}
        </div>
      </div>
      <FollowRemoveDialog
        isOpen={isOpen}
        handleClose={handleClose}
        followId={data.id}
        {...data.user}
      />
    </div>
  );
}
