import { useCallback, useEffect, useRef, useState } from "react";
import "./timeline.css";
import Tweet from "../tweet";
import ReTweet from "../re-tweet";
import BackDrop from "../../common/loading";
import { deleteTweet, getTweetList } from "../../../api/tweetApi";

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
      <BackDrop isLoading={isLoading}></BackDrop>
    </div>
  );
}
