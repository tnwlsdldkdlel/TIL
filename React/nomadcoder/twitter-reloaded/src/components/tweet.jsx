import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import "./tweet.css";
import { useState } from "react";
import DetailTweetDialog from "./detail-tweet-dialog";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditTweetDialog from "./edit-tweet-dialog";
import { deleteObject, ref } from "firebase/storage";
import { timeAgo } from "../common/time-ago";

export default function Tweet({ ...data }) {
  const [isOpen, setIsOpen] = useState("");
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

  const onClickDialog = (target) => {
    setIsOpen(target);
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

    const docRef = doc(db, "tweets", data.id);
    await updateDoc(docRef, {
      like: data.like + 1,
    });

    await addDoc(collection(db, "likes"), {
      userId: user.uid,
      tweetId: data.id,
      createdAt: Date.now(),
    });
  };

  return (
    <>
      <div className="tweet" onClick={() => onClickDialog("detail")}>
        <div className="column">
          <span className="name">
            <div>{data.username}</div>
            <div>{timeAgo(data.updatedAt)}</div>
          </span>
          <p className="payload">{data.tweet}</p>
        </div>
        <div className="right">
          {data.photo ? (
            <img className="photo" src={data.photo} />
          ) : (
            <div></div>
          )}
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
                <MenuItem key={"edit"} onClick={() => onClickMenuItem("edit")}>
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
          {data.like}
        </div>
      </div>
      <DetailTweetDialog
        isOpen={isOpen === "detail"}
        handleClose={handleClose}
        {...data}
      />
      <EditTweetDialog
        isOpen={isOpen === "edit"}
        handleClose={handleClose}
        {...data}
      />
    </>
  );
}
