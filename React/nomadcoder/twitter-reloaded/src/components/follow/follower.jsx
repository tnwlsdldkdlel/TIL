import { useEffect, useState } from "react";
import "./follower.css";
import FollowList from "./follow-list";
import {
  collection,
  getDocs,
  query,
  where,
  startAt,
  endAt,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useLocation } from "react-router-dom";

export default function Follower() {
  const location = useLocation();
  const { stateTab, userId } = location.state || {};
  const [tab, setTab] = useState(stateTab || "follower");
  const [search, setSearch] = useState("");
  const [list, setList] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    getFollowList("follower");
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
    let uid = userId ? userId : user.uid;

    // 팔로워 : 나`를` 팔로우하는 사람들 => 내가 targetId
    if (target === "follower") {
      const followerQuery = query(
        collection(db, "follow"),
        where("targetId", "==", uid)
      );

      const followerSnapshot = await getDocs(followerQuery);
      let follwerList = [];
      for (const item of followerSnapshot.docs) {
        const followerData = item.data();
        const userId = followerData.userId;

        let userQuery = query(
          collection(db, "user"),
          where("id", "==", userId)
        );

        if (search) {
          userQuery = query(
            collection(db, "user"),
            where("id", "==", userId),
            orderBy("name"),
            startAt(search),
            endAt(search + "\uf8ff")
          );
        }

        const userSnapshot = await getDocs(userQuery);
        const userData = userSnapshot.docs[0]?.data();

        // 맞팔로우되어있는지 확인
        const followingQuery = query(
          collection(db, "follow"),
          where("userId", "==", uid),
          where("targetId", "==", userId)
        );

        const followingSnapshot = await getDocs(followingQuery);
        const isFollowing = followingSnapshot.docs.length == 0 ? false : true;

        if (userData) {
          followerData.id = item.id;
          followerData.isFollowing = isFollowing;
          followerData.user = {
            id: userId,
            photo: userData.photo,
            name: userData.name,
          };

          follwerList.push(followerData);
        }
      }

      setList(follwerList);
    } else {
      // 팔로잉 : 내`가` 팔로우하는 사람들 => 내가 userId
      const followerQuery = query(
        collection(db, "follow"),
        where("userId", "==", uid)
      );
      const followerSnapshot = await getDocs(followerQuery);
      let follwerList = [];
      for (const item of followerSnapshot.docs) {
        const followerData = item.data();
        const targetId = followerData.targetId;

        let userQuery = query(
          collection(db, "user"),
          where("id", "==", targetId)
        );

        if (search) {
          userQuery = query(
            collection(db, "user"),
            where("id", "==", targetId),
            orderBy("name"),
            startAt(search),
            endAt(search + "\uf8ff")
          );
        }

        const userSnapshot = await getDocs(userQuery);
        const userData = userSnapshot.docs[0]?.data();

        if (userData) {
          followerData.isFollowing = true;
          followerData.id = item.id;
          followerData.user = {
            id: targetId,
            photo: userData.photo,
            name: userData.name,
          };

          follwerList.push(followerData);
        }
      }

      setList(follwerList);
    }
  };

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
        {list.length == 0 ? (
          <div className="empty">사용자를 찾을 수 없습니다.</div>
        ) : (
          list.map((data) => {
            return <FollowList key={data.id} {...data} />;
          })
        )}
        {}
      </div>
    </div>
  );
}
