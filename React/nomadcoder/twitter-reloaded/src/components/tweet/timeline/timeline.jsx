import { useCallback, useEffect, useRef, useState } from "react";
import "./timeline.css";
import Tweet from "../tweet";
import ReTweet from "../re-tweet";
import BackDrop from "../../common/loading";
import { deleteTweet, getTweetListForHome } from "../../../api/tweetApi";
import { throttle } from "lodash";

export default function Timeline() {
  const [tweets, setTweets] = useState([]);
  const scrollableDivRef = useRef(null);
  const [paging, setPaging] = useState({
    lastVisible: null,
    hasMore: true,
    lastScrollTop: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchInitialTweets = useCallback(
    async (isScrolled = false, scrollTop = 0) => {
      setIsLoading(true);
      try {
        const { data, hasMore, lastVisible } = await getTweetListForHome(
          isScrolled,
          paging.lastVisible,
          paging.hasMore
        );

        setPaging({
          lastScrollTop: scrollTop,
          hasMore: hasMore,
          lastVisible: lastVisible,
        });

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
    },
    [paging]
  );

  useEffect(() => {
    fetchInitialTweets(false);
  }, []);

  useEffect(() => {
    const scrollableDiv = scrollableDivRef.current;

    if (scrollableDiv) {
      scrollableDiv.addEventListener("scroll", handleScroll);
      scrollableDiv.scrollTop = paging.lastScrollTop;
    }

    return () => {
      if (scrollableDiv) {
        scrollableDiv.removeEventListener("scroll", handleScroll);
      }
    };
  }, [paging]);

  const handleScroll = useCallback(
    throttle(async () => {
      const scrollableDiv = scrollableDivRef.current;
      const scrollTop = scrollableDiv.scrollTop;

      if (scrollableDiv) {
        if (
          scrollTop > paging.lastScrollTop &&
          scrollTop - paging.lastScrollTop >= 7000
        ) {
          await fetchInitialTweets(true, scrollTop);
        }
      }
    }, 200), // 200ms마다 한 번 호출
    [paging]
  );

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
