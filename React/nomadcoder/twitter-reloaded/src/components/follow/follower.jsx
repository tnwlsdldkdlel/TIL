import { useEffect, useState } from "react";
import "./follower.css";
import FollowList from "./follow-list";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../firebase";

export default function Follower() {
  const [tab, setTab] = useState("follower");
  const [search, setSearch] = useState("");
  const [list, setList] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    getFollowList();
  }, []);

  const onClickTab = (e) => {
    setTab(e.target.id);
  };

  const onChangeSearch = (e) => {
    setSearch(e.target.value);
    getFollowList();
  };

  const onClickRemoveSearh = () => {
    setSearch("");
  };

  const getFollowList = async () => {
    // 팔로워 : 나`를` 팔로우하는 사람들 => 내가 targetId
    if (tab === "follower") {
      const followerQuery = query(
        collection(db, "follow"),
        where("targetId", "==", user.uid)
      );

      const followerSnapshot = await getDocs(followerQuery);
      followerSnapshot.docs.map(async (item) => {
        const followerData = item.data();
        const userId = followerData.userId;

        const userQuery = query(
          collection(db, "user"),
          where("id", "==", userId)
        );
        const userSnapshot = await getDocs(userQuery);
        const userData = userSnapshot.docs[0].data();

        setList((prev) => {
          return {
            ...followerData,
            user: { id: userId, photo: userData.photo, name: userData.name },
          };
        });
      });
    }
  };

  console.log(list);

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
        <FollowList></FollowList>
      </div>
    </div>
  );
}
