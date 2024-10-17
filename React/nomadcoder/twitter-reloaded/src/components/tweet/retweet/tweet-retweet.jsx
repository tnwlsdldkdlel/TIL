import { memo, useState } from "react";
import { timeAgo } from "../../../common/time-ago";
import { auth, db } from "../../../firebase";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

function TweetReply({ isLast, ...reply }) {
  const user = auth.currentUser;
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const [isOpen, setIsOpen] = useState("");

  const onClickMenu = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const onClickCloseMenu = () => {
    setAnchorEl(null);
  };

  const onClickMenuItem = (target) => {
    setIsOpen(target);
  };

  const onDelete = async () => {
    try {
      const likeQuery = query(
        collection(db, `likes`),
        where("replyId", "==", reply.id)
      );

      // reply
      await deleteDoc(doc(db, "replies", reply.id));

      // like
      const likeSnapshot = await getDocs(likeQuery);
      likeSnapshot.forEach(async (item) => {
        await deleteDoc(doc(db, "likes", item.id));
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onClickLike = async (e) => {
    e.stopPropagation();

    if (reply.like.isLiked) {
      await deleteDoc(doc(db, `likes`, reply.like.id));

      const alarmQuery = query(
        collection(db, "alarm"),
        where("replyId", "==", reply.id)
      );
      const alarmSnapshot = await getDocs(alarmQuery);
      alarmSnapshot.forEach(async (item) => {
        await deleteDoc(doc(db, "alarm", item.id));
      });
    } else {
      await addDoc(collection(db, `likes`), {
        userId: user.uid,
        replyId: reply.id,
        createdAt: Date.now(),
      });

      // 알람
      if (user.uid !== reply.userId) {
        const content = `${user.displayName}님이 ${
          reply.reply.length > 10
            ? reply.reply.substr(0, 10) + "..."
            : reply.reply
        }댓글을 좋아합니다.`;
        await addDoc(collection(db, "alarm"), {
          userId: reply.userId, // 조아요 당한 사람 uid
          targetId: user.uid, // 댓글을 조아요한 사람 uid
          content: content,
          replyId: reply.id,
          isChecked: false,
          createdAt: Date.now(),
        });
      }
    }
  };

  return (
    <>
      <div className="tweet" style={{ borderBottom: isLast ? "none" : "" }}>
        <div className="top">
          <div className="left">
            <div>{reply.username}</div>
            <div className="time">{timeAgo(reply.createdAt)}</div>
          </div>
          <div className="right">
            {reply.username === user.displayName ? (
              <div className="menu" onClick={onClickMenu}>
                <IconButton
                  className="btn"
                  aria-label="more"
                  id="long-button"
                  aria-controls={open ? "long-menu" : undefined}
                  aria-expanded={open ? "true" : undefined}
                  aria-haspopup="true"
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id="basic-menu"
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                  open={isMenuOpen}
                  onClose={onClickCloseMenu}
                  anchorEl={anchorEl}
                  sx={{
                    "& .MuiPaper-root": {
                      backgroundColor: "black",
                      color: "white",
                      border: "1px solid white",
                    },
                    "& .MuiButtonBase-root": {
                      borderBottom: "1px solid white",
                    },
                  }}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  aria-hidden={!isOpen ? "false" : "true"}
                >
                  <MenuItem
                    key={"edit"}
                    onClick={() => onClickMenuItem("edit")}
                  >
                    Edit
                  </MenuItem>
                  <MenuItem
                    key={"remove"}
                    onClick={onDelete}
                    sx={{
                      borderBottom: "0px !important",
                    }}
                  >
                    Remove
                  </MenuItem>
                </Menu>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="middle">
          <p className="payload">{reply.reply}</p>
        </div>
        <div className="bottom">
          {reply.like.isLiked ? (
            <div className="like-btn" onClick={onClickLike}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6 active"
              >
                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
              </svg>
            </div>
          ) : (
            <div className="like-btn" onClick={onClickLike}>
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
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            </div>
          )}
          {reply.like.count}
        </div>
      </div>
    </>
  );
}

export default memo(TweetReply);
