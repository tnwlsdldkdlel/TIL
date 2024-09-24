import { deleteDoc, doc } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import "./tweet.css";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";
import DetailTweetDialog from "./detail-tweet-dialog";
import { Dialog, DialogTitle } from "@mui/material";

export default function Tweet({ ...data }) {
  const [isOpen, setIsOpen] = useState(false);
  const user = auth.currentUser;

  //   const onDelete = async () => {
  //     const ok = confirm("Are you sure you want to delete this tweet?");
  //     if (!ok || user?.uid !== data.userId) return;

  //     try {
  //       await deleteDoc(doc(db, "tweets", data.id));

  //       if (data.photo) {
  //         const photoRef = ref(storage, `tweets/${user.uid}/${data.id}`);
  //         await deleteObject(photoRef);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  const handleClose = () => {
    setIsOpen(false);
  };

  const onClickDialog = () => {
    setIsOpen(true);
  };

  return (
    <>
      <div className="tweet" onClick={onClickDialog}>
        <div className="column">
          <span className="name">
            {data.username}
            <div className="edit-btn">
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
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </div>
            <div className="delete-btn">
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
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </div>
          </span>
          <p className="payload">{data.tweet}</p>
        </div>
        {data.photo ? <img className="photo" src={data.photo} /> : null}
      </div>
      <Dialog className="detail-dialog" open={isOpen} onClose={handleClose}>
        <DialogTitle className="detail-dialog-title">
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
        <DetailTweetDialog className="scrollable">
          <img src={data.photo} />
          <p>{data.tweet}</p>
        </DetailTweetDialog>
      </Dialog>
    </>
  );
}
