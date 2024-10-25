import { useCallback, useEffect, useRef, useState } from "react";
import "./timeline.css";
import Tweet from "../tweet";
import ReTweet from "../re-tweet";
import BackDrop from "../../common/loading";
import { deleteTweet, getTweetListForHome } from "../../../api/tweetApi";

export default function Timeline() {
  const [tweets, setTweets] = useState([]);
  const scrollableDivRef = useRef(null);
  const [paging, setPaging] = useState({
    lastVisible: null,
    hasMore: true,
    lastScrollTop: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

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

  const fetchInitialTweets = useCallback(async (isScrolled = false) => {
    setIsLoading(true);
    try {
      const { data, hasMore, lastVisible } = await getTweetListForHome(
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
        setTweets((prev) => [...prev, ...data]);
      } else {
        setTweets(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clickDelete = useCallback(
    async (tweetId) => {
      await deleteTweet(tweetId);
      fetchInitialTweets();
    },
    [fetchInitialTweets]
  );

  return (
    <div className="time-line scrollable" ref={scrollableDivRef}>
      {tweets.length > 0 ? (
        tweets.map((item, index) =>
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
        )
      ) : (
        <div className="empty">팔로잉을 하여 소식을 확인하세요! 🙋‍♀️</div>
      )}
      <BackDrop isLoading={isLoading}></BackDrop>
    </div>
  );
}
