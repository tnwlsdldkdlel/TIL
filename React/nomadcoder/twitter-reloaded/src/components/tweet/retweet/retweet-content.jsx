import "../tweet.css";
import { memo } from "react";
import { timeAgo } from "../../../common/time-ago";
import ImageSlider from "../../../components/common/image-slider";

function RetweetContent({ user, createdAt, tweet, images }) {
  return (
    <>
      <div
        className="tweet"
        style={{
          border: "1px solid white",
          borderRadius: "12px",
          cursor: "",
        }}
      >
        <div className="top">
          <div className="left">
            <div className="photo">
              {user != undefined && user.photo ? (
                <img src={user.photo} />
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
            <div>{user != undefined ? user.name : ""}</div>
            <div className="time">{timeAgo(createdAt)}</div>
          </div>
        </div>
        <div className="middle">
          <p className="payload">{tweet}</p>
          {images && images.length > 0 ? (
            images.length > 1 ? (
              <ImageSlider images={images}></ImageSlider>
            ) : (
              <div className="single-image">
                <img
                  src={
                    images[0].name ? URL.createObjectURL(images[0]) : images[0]
                  }
                />
              </div>
            )
          ) : null}
        </div>
      </div>
    </>
  );
}

export default memo(RetweetContent);
