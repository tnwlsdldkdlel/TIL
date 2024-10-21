import "./profile.css";
import { auth } from "../firebase";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import Tweet from "../components/tweet/tweet";
import ReTweet from "../components/tweet/re-tweet";
import { useLocation, useNavigate } from "react-router-dom";
import BackDrop from "../components/common/loading";
import { getMyTweetList } from "../api/tweetApi";
import { getUserInfo } from "../api/userApi";
import FollowRemoveDialog from "../components/follow/follow-remove-dialog";
import { getFollwInfo, setfollow, setUnfollow } from "../api/followerApi";

function Profile() {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state ? location.state.userId : user.uid;
  const [info, setInfo] = useState({
    intro: "",
    name: "",
    photo: "",
    count: { tweet: 0, follower: 0, following: 0 },
  });
  const [follow, setFollow] = useState({
    isFollow: false,
    id: "",
  });
  const [tweet, setTweet] = useState([]);
  const scrollableDivRef = useRef(null);
  const [paging, setPaging] = useState({
    lastVisible: null,
    hasMore: true,
    lastScrollTop: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchInitialTweets(false);
    getInfo();
    getFollow();

    const scrollableDiv = scrollableDivRef.current;
    if (scrollableDiv) {
      scrollableDiv.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollableDiv) {
        scrollableDiv.removeEventListener("scroll", handleScroll);
      }
    };
  }, [userId]);

  const getInfo = useCallback(async () => {
    const result = await getUserInfo(userId);
    setInfo(result);
  }, [userId]);

  const fetchInitialTweets = async (isScrolled) => {
    setIsLoading(true);
    try {
      const { tweetsData, hasMore, lastVisible } = await getMyTweetList(
        isScrolled,
        paging.lastVisible,
        paging.hasMore
      );

      setPaging((prev) => ({
        ...prev,
        hasMore: hasMore,
        lastVisible: lastVisible,
      }));

      if (isScrolled) {
        setTweet((prev) => [...prev, ...tweetsData]);
      } else {
        setTweet(tweetsData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = () => {
    if (scrollableDivRef.current) {
      const scrollTop = scrollableDivRef.current.scrollTop;

      if (scrollTop - paging.lastScrollTop >= 1900) {
        setPaging({ ...paging, lastScrollTop: scrollTop });

        const unsubscribe = fetchInitialTweets(true);

        return () => {
          unsubscribe();
        };
      }
    }
  };

  const getFollow = async () => {
    if (userId) {
      const result = await getFollwInfo(userId);
      setFollow(result);
    }
  };

  const onClickProfile = () => {
    navigate(`/profile/edit`);
  };

  const onClickFollow = async () => {
    if (userId) {
      const followId = await setfollow(userId);
      const newFollow = {
        isFollow: true,
        id: followId,
      };
      setFollow(newFollow);
      await getInfo();
    }
  };

  const onClickUnfollow = async () => {
    setIsOpen(true);
  };

  const handleClose = useCallback(async () => setIsOpen(false), []);

  const onClickRemoveFollow = useCallback(async () => {
    await setUnfollow(follow.id);
    setFollow({ isFollow: false, id: "" });
    await getFollow();
    await getInfo();
    await handleClose();
  }, [follow]);

  return (
    <div className="profile">
      <div className="top">
        <label className="avatar-upload">
          {info.photo ? (
            <img src={info.photo} />
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
        </label>
        <div className="count">
          <div className="tweet-count">
            <div className="value">{info.count.tweet}</div>
            <div className="key">게시물</div>
          </div>
          <div
            className="follower-count"
            onClick={() =>
              navigate("follower", {
                state: {
                  userId: userId && userId !== user.uid ? userId : user.uid,
                },
              })
            }
          >
            <div className="value">{info.count.follower}</div>
            <div className="key">팔로워</div>
          </div>
          <div
            className="following-count"
            onClick={() =>
              navigate("follower", {
                state: {
                  stateTab: "following",
                  userId: userId && userId !== user.uid ? userId : user.uid,
                },
              })
            }
          >
            <div className="value">{info.count.following}</div>
            <div className="key">팔로잉</div>
          </div>
        </div>
      </div>
      <div className="down">
        <span className="name">{info.name}</span>
        {info.intro ? <span className="intro">{info.intro}</span> : <></>}
      </div>
      {!userId || userId === user.uid ? (
        <button className="edit-btn" onClick={onClickProfile}>
          프로필편집
        </button>
      ) : follow.isFollow ? (
        <button className="following-btn" onClick={onClickUnfollow}>
          팔로잉
        </button>
      ) : (
        <button className="follow-btn" onClick={onClickFollow}>
          팔로우
        </button>
      )}
      <div className="my-tweets scrollable" ref={scrollableDivRef}>
        {tweet.map((item, index) =>
          item.retweetId != undefined ? (
            <ReTweet
              key={item.id}
              isLast={index === tweet.length - 1}
              {...item}
            />
          ) : (
            <Tweet
              key={item.id}
              isLast={index === tweet.length - 1}
              {...item}
            />
          )
        )}
      </div>
      <BackDrop isLoading={isLoading}></BackDrop>
      <FollowRemoveDialog
        isOpen={isOpen}
        handleClose={handleClose}
        followId={follow.id}
        onClickRemoveFollow={onClickRemoveFollow}
        photo={info.photo}
        name={info.name}
      />
    </div>
  );
}

export default memo(Profile);
