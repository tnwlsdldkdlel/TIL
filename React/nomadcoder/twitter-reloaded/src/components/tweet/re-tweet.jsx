import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { auth, db, storage } from "../../firebase";
import "./tweet.css";
import { memo, useCallback, useEffect, useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditTweetDialog from "./edit/edit-tweet-dialog";
import { deleteObject, ref } from "firebase/storage";
import { timeAgo } from "../../common/time-ago";
import TweetReplyDialog from "./reply/tweet-reply-dialog";
import ReTweetDialog from "./retweet/tweet-retweet-dialog";
import Tweet from "./tweet";
import { useNavigate } from "react-router-dom";

function ReTweet({ isReply, isLast, isRetweet, ...data }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenReply, setIsOpenReply] = useState(false);
  const [isOpenReTweet, setIsOpenReTweet] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const user = auth.currentUser;
  const [retweet, setRetweet] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const repliesQuery = query(
      collection(db, "tweets"),
      where("__name__", "==", data.retweetId)
    );

    const unsubscribeReplies = onSnapshot(repliesQuery, (snapshot) => {
      const retweetsData = snapshot.docs.map((doc) => {
        const retweetData = doc.data();
        const retweetId = doc.id;

        // 유저정보
        const userQuery = query(
          collection(db, "user"),
          where("id", "==", retweetData.userId)
        );

        onSnapshot(userQuery, (userSnapshot) => {
          userSnapshot.docs.forEach((doc) => {
            const userInfo = doc.data();

            setRetweet((prevRetweet) => {
              if (prevRetweet.id === retweetId) {
                return {
                  ...prevRetweet,
                  user: {
                    id: userInfo.id,
                    name: userInfo.name,
                    photo: userInfo.photo,
                  },
                };
              }
              return retweet;
            });
          });
        });

        // 자식 컬렉션(예: likes) 스냅샷
        const likesQuery = query(
          collection(db, `likes`),
          where("tweetId", "==", retweetId)
        );

        onSnapshot(likesQuery, (likeSnapshot) => {
          const likeCount = likeSnapshot.docs.length;
          let likeId = 0;
          const isLiked = likeSnapshot.docs.some((likeDoc) => {
            if (likeDoc.data().userId === user.uid) {
              likeId = likeDoc.id;
              return true;
            }
            return false;
          });

          // 부모 상태 업데이트
          setRetweet((prevRetweet) => {
            if (prevRetweet.id === retweetId) {
              return {
                ...prevRetweet,
                like: { isLiked, count: likeCount, id: likeId },
              };
            }
            return retweet;
          });
        });

        // 댓글 쿼리
        const repliesQuery = query(
          collection(db, "replies"),
          where("tweetId", "==", retweetId)
        );

        onSnapshot(repliesQuery, (replySnapshot) => {
          const replyCount = replySnapshot.docs.length;

          setRetweet((prevTweet) => {
            if (prevTweet.id === retweetId) {
              return {
                ...prevTweet,
                reply: { count: replyCount },
              };
            }
            return prevTweet;
          });
        });

        const retweetQuery = query(
          collection(db, "tweets"),
          where("retweetId", "==", retweetId)
        );

        onSnapshot(retweetQuery, (retweetSnapshot) => {
          const retweetCount = retweetSnapshot.docs.length;

          // content 업데이트
          setRetweet((prevTweet) => {
            if (prevTweet.id === retweetId) {
              return {
                ...prevTweet,
                retweet: { count: retweetCount },
              };
            }

            return prevTweet;
          });
        });

        return {
          ...retweetData,
          id: retweetId,
          like: { isLiked: false, count: 0 },
          retweet: { count: 0 },
          user: { id: retweetData.userId, name: "", photo: "" },
        };
      });

      // 부모 상태에 트윗 데이터 설정
      setRetweet(retweetsData[0]);
    });

    return () => {
      unsubscribeReplies();
    };
  }, []);

  const onDelete = async () => {
    const ok = confirm("정말 글을 삭제하실건가요?");
    if (!ok) {
      setIsOpen(false);
      onClickCloseMenu();
      return;
    }

    try {
      const replyQuery = query(
        collection(db, `replies`),
        where("tweetId", "==", data.id)
      );

      const likeQuery = query(
        collection(db, `likes`),
        where("tweetId", "==", data.id)
      );
      // tweets
      await deleteDoc(doc(db, "tweets", data.id));

      // photo
      if (data.photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${data.id}`);
        await deleteObject(photoRef);
      }

      // reply
      const replySnapshot = await getDocs(replyQuery);
      replySnapshot.forEach(async (item) => {
        await deleteDoc(doc(db, "replies", item.id));
      });

      // like
      const likeSnapshot = await getDocs(likeQuery);
      likeSnapshot.forEach(async (item) => {
        await deleteDoc(doc(db, "likes", item.id));
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setIsOpenReply(false);
    setIsOpenReTweet(false);
  }, []);

  const onClickMenu = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const onClickCloseMenu = (e) => {
    if (e) {
      e.stopPropagation();
    }
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

  const onClickRelpyDialog = (e) => {
    e.stopPropagation();
    setIsOpenReply(true);
  };

  const onClickReTweetDialog = () => {
    setIsOpenReTweet(true);
  };

  const onClickUser = (e) => {
    e.stopPropagation();
    navigate(`/profile`, { state: { userId: data.user.id } });
  };

  return (
    <>
      <div
        className="tweet"
        style={{
          border: isLast ? "none" : isRetweet ? "1px solid white" : "",
          borderRadius: isRetweet ? "12px" : "",
          cursor: isReply ? "" : "pointer",
        }}
      >
        <div className="top">
          <div className="left" onClick={onClickUser}>
            <div className="photo">
              {data.user.photo ? (
                <img src={data.user.photo} />
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
            </div>
            <div>{data.user.name}</div>
            <div className="time">{timeAgo(data.createdAt)}</div>
          </div>
          {isRetweet ? (
            <></>
          ) : (
            <div className="right">
              {data.user.name === user.displayName ? (
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
                    elevation={0}
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
                    aria-hidden={!isOpen ? false : true}
                  >
                    <MenuItem
                      key={"edit"}
                      onClick={() => onClickMenuItem("edit")}
                      disableRipple
                    >
                      Edit
                    </MenuItem>
                    <MenuItem
                      key={"remove"}
                      onClick={onDelete}
                      sx={{
                        borderBottom: "0px !important",
                      }}
                      disableRipple
                    >
                      Remove
                    </MenuItem>
                  </Menu>
                </div>
              ) : (
                <></>
              )}
            </div>
          )}
        </div>
        <div className="middle">
          <p className="payload" onClick={onClickRelpyDialog}>
            {data.tweet}
          </p>
          {data.photo ? (
            <img
              className="photo"
              src={data.photo}
              onClick={onClickRelpyDialog}
            />
          ) : (
            <div onClick={onClickRelpyDialog}></div>
          )}
          <div className="re-tweet">
            <Tweet isLast={true} isRetweet={true} {...retweet} />
          </div>
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
          <div className="reply-btn">
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
          {data.reply.count}
          <div className="re-tweet-btn" onClick={onClickReTweetDialog}>
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
                d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
              />
            </svg>
          </div>
          {data.retweet.count}
        </div>
      </div>
      <EditTweetDialog isOpen={isOpen} handleClose={handleClose} {...data} />
      <EditTweetDialog
        isOpen={isOpen}
        handleClose={handleClose}
        images={data.images}
        id={data.id}
        tweet={data.tweet}
      />
      <TweetReplyDialog
        isOpenReply={isOpenReply}
        handleClose={handleClose}
        {...data}
      />
      <ReTweetDialog
        isOpenReTweet={isOpenReTweet}
        handleClose={handleClose}
        userData={data.user}
        tweet={data.tweet}
        id={data.id}
        createdAt={data.createdAt}
        images={data.images}
      />
    </>
  );
}

export default memo(ReTweet);
