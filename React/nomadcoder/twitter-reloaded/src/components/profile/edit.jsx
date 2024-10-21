import { memo, useState } from "react";
import { auth } from "../../firebase";
import "../../pages/profile.css";
import EditForm from "./eidt-form";
import { setProfileImg } from "../../storage/userStorage";
import { updateProfile } from "firebase/auth";

function ProfileEdit() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);

  const onAvatarChange = async (e) => {
    const url = await setProfileImg(e.target);
    setAvatar(url);
    await updateProfile(user, { photoURL: url });
  };

  return (
    <div className="edit">
      <div className="photo">
        <div className="avatar-upload">
          {avatar ? (
            <img src={avatar} />
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
        <label className="profile-label" htmlFor="file">
          사진 수정
        </label>
        <input
          id="file"
          className="avatar-input"
          type="file"
          accept="image/*"
          onChange={onAvatarChange}
        />
      </div>
      <div className="line"></div>
      <EditForm></EditForm>
    </div>
  );
}

export default memo(ProfileEdit);
