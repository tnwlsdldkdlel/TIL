import { memo, useCallback, useEffect, useState } from "react";
import "./follower.css";
import FollowList from "./follow-list";
import { auth } from "../../firebase";
import { useLocation } from "react-router-dom";
import {
  getFollower,
  getFollwing,
  setfollow,
  setUnfollow,
} from "../../api/followerApi";
import FollowListNotMe from "./follow-list-not-me";
import BackDrop from "../common/loading";

function Follower() {
  const location = useLocation();
  const { stateTab, userId } = location.state || {};
  const [tab, setTab] = useState(stateTab || "follower");
  const [search, setSearch] = useState("");
  const [list, setList] = useState([]);
  const [isOpen, setOpen] = useState(false);
  const user = auth.currentUser;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getFollowList(tab);
  }, []);

  const onClickTab = (e) => {
    setTab(e.target.id);
    setSearch("");
    getFollowList(e.target.id);
  };

  const onChangeSearch = (e) => {
    setSearch(e.target.value);
    getFollowList(tab, e.target.value);
  };

  const onClickRemoveSearh = () => {
    setSearch("");
    getFollowList(tab);
  };

  const getFollowList = async (target, search) => {
    setIsLoading(true);
    // 팔로워 : 나를 팔로우하는 사람들 => 내가 targetId
    let uid = userId ? userId : user.id;

    if (target === "follower") {
      const list = await getFollower(uid, search);
      setList(list);
    } else {
      // 팔로잉 : 내가 팔로우하는 사람들 => 내가 userId
      const list = await getFollwing(uid, search);
      setList(list);
    }

    setIsLoading(false);
  };

  const onFollow = async (target) => {
    await setfollow(target);
    await getFollowList(tab);
  };

  const handleClose = useCallback(async () => setOpen(false), []);

  const onClickRemoveFollow = useCallback(
    async (followId) => {
      await setUnfollow(followId);
      await handleClose();
      await getFollowList(tab);
    },
    [list]
  );

  const onClickMenu = useCallback(() => {
    setOpen(true);
  }, []);

  return (
    <div className="follower">
      <div className="tabs">
        <div
          className={tab === "follower" ? "active" : ""}
          onClick={onClickTab}
          id="follower"
        >
          팔로워
        </div>
        <div
          className={tab === "following" ? "active" : ""}
          onClick={onClickTab}
          id="following"
        >
          팔로잉
        </div>
      </div>
      <div className="search">
        <input
          type="text"
          placeholder="검색"
          value={search}
          onChange={onChangeSearch}
        />
        <span className="search-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        {search ? (
          <span className="remove-icon" onClick={onClickRemoveSearh}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        ) : (
          <></>
        )}
      </div>
      <div className="content">
        {list.length === 0 ? (
          <div className="empty">사용자를 찾을 수 없습니다.</div>
        ) : (
          list.map((data) =>
            (tab === "follower" && data.targetId === user.uid) ||
            (tab === "following" && data.userId === user.uid) ? (
              <FollowList
                key={data.id}
                isOpen={isOpen}
                onClickMenu={onClickMenu}
                onClickRemoveFollow={onClickRemoveFollow}
                onFollow={onFollow}
                {...data}
              />
            ) : (
              <FollowListNotMe key={data.id} {...data} />
            )
          )
        )}
      </div>
      <BackDrop isLoading={isLoading}></BackDrop>
    </div>
  );
}

export default memo(Follower);
