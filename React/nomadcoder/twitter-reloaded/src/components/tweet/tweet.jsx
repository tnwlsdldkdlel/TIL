import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { auth, db, storage } from "../../firebase";
import "./tweet.css";
import { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditTweetDialog from "./edit/edit-tweet-dialog";
import { deleteObject, ref } from "firebase/storage";
import { timeAgo } from "../../common/time-ago";
import TweetReplyDialog from "./reply/tweet-reply-dialog";

export default function Tweet({ ...data }) {
  const [isOpen, setIsOpen] = useState("");
  const [isOpenReply, setIsOpenReply] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const user = auth.currentUser;

  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this tweet?");
    if (!ok) {
      setIsOpen("");
      onClickCloseMenu();
      return;
    }

    try {
      await deleteDoc(doc(db, "tweets", data.id));

      if (data.photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${data.id}`);
        await deleteObject(photoRef);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setIsOpen("");
    onClickCloseMenu();
  };

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

  const onClickLike = async (e) => {
    e.stopPropagation();

    if (data.like.isLiked) {
      await deleteDoc(doc(db, `likes`, data.like.id));
    } else {
      await addDoc(collection(db, `likes`), {
        userId: user.uid,
        tweetId: data.id,
        createdAt: Date.now(),
      });
    }
  };

  const onClickRelpyDialog = () => {
    setIsOpenReply(true);
  };

  return (
    <>
      <div className="tweet">
        <div className="top">
          <div className="left">
            <div>{data.username}</div>
            <div className="time">{timeAgo(data.updatedAt)}</div>
          </div>
          <div className="right">
            {data.username === user.displayName ? (
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
          <p className="payload">{data.tweet}</p>
          {data.photo ? (
            <img className="photo" src={data.photo} />
          ) : (
            <div></div>
          )}
        </div>
        <div className="bottom">
          {data.like.isLiked ? (
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
          {data.like.count}
          <div className="reply-btn" onClick={onClickRelpyDialog}>
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
                d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
              />
            </svg>
          </div>
          123
        </div>
      </div>
      <EditTweetDialog
        isOpen={isOpen === "edit"}
        handleClose={handleClose}
        {...data}
      />
      <TweetReplyDialog isOpenReply={isOpenReply} handleClose={handleClose} />
    </>
  );
}
