import { useCallback, useEffect, useRef, useState } from "react";
import "./search.css";
import { deleteTweet, getTweetList } from "../api/tweetApi";
import ReTweet from "../components/tweet/re-tweet";
import Tweet from "../components/tweet/tweet";
import BackDrop from "../components/common/loading";
import UserSearch from "../components/search/user-search";
import { getUserList } from "../api/userApi";

export default function Search() {
  const [search, setSearch] = useState("");
  const [tweets, setTweets] = useState([]);
  const scrollableDivRef = useRef(null);
  const [paging, setPaging] = useState({
    lastVisible: null,
    hasMore: true,
    lastScrollTop: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchInitialTweets();

    const scrollableDiv = scrollableDivRef.current;
    if (scrollableDiv) {
      scrollableDiv.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollableDiv) {
        scrollableDiv.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const onChangeSearch = async (e) => {
    setSearch(e.target.value);
    await searchUser(e.target.value);
  };

  const onClickRemoveSearh = () => {
    setSearch("");
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

  const searchUser = async (target) => {
    const list = await getUserList(target);
    setUsers(list);
  };

  const fetchInitialTweets = async (isScrolled = false) => {
    setIsLoading(true);
    try {
      const { tweetsData, hasMore, lastVisible } = await getTweetList(
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
        setTweets((prev) => [...prev, ...tweetsData]);
      } else {
        setTweets(tweetsData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const clickDelete = useCallback(async (tweetId) => {
    await deleteTweet(tweetId);
    fetchInitialTweets();
  }, []);

  return (
    <div className="search">
      <div className="input">
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
      {search === "" ? (
        <div className="time-line scrollable" ref={scrollableDivRef}>
          {tweets.map((item, index) =>
            item.reTweet != undefined ? (
              <ReTweet
                key={item.id}
                isLast={index === tweets.length - 1}
                clickDelete={clickDelete}
                fetchInitialTweets={fetchInitialTweets}
                {...item}
              />
            ) : (
              <Tweet
                key={item.id}
                isLast={index === tweets.length - 1}
                clickDelete={clickDelete}
                fetchInitialTweets={fetchInitialTweets}
                {...item}
              />
            )
          )}
        </div>
      ) : (
        <div className="search-content">
          {users.length === 0 ? (
            <div className="empty">사용자를 찾을 수 없습니다.</div>
          ) : (
            users.map((data) => (
              <UserSearch
                key={data.id}
                photo={data.photo}
                id={data.id}
                name={data.name}
              ></UserSearch>
            ))
          )}
        </div>
      )}
      <BackDrop isLoading={isLoading}></BackDrop>
    </div>
  );
}
