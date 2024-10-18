import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import {
  signInWithEmailAndPassword,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { useEffect } from "react";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { FirebaseError } from "firebase/app";

function EditForm() {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [input, setInput] = useState({
    name: user.displayName,
    intro: "",
    prevIntro: "",
    password1: "",
    password2: "",
    prevPassword: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const infoQuery = query(
      collection(db, "user"),
      where("id", "==", user.uid)
    );

    const unsubscribe = onSnapshot(infoQuery, (snapshot) => {
      snapshot.docs.map((doc) => {
        const infoData = doc.data();
        setInput({
          ...input,
          intro: infoData.intro || "",
          prevIntro: infoData.intro || "",
        });
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const onClickCancel = () => {
    navigate("/profile");
  };

  const onChangeInput = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const onClickUpdate = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (
        (!input.password1 && !input.password2 && !input.prevPassword) ||
        (input.password1 && input.password2 && input.prevPassword)
      ) {
        if (input.name !== user.displayName) {
          await updateProfile(user, { displayName: input.name });
        }

        if (input.password1 && input.password1 === input.password2) {
          await signInWithEmailAndPassword(
            auth,
            user.email,
            input.prevPassword
          );
          await updatePassword(user, input.password1);
        }

        const userQuery = query(
          collection(db, "user"),
          where("id", "==", user.uid)
        );

        const querySnapshot = await getDocs(userQuery);
        if (!querySnapshot.empty) {
          const docRef = querySnapshot.docs[0].ref;

          await updateDoc(docRef, {
            intro: input.intro,
            name: input.name,
            updatedAt: Date.now(),
          });
        }

        navigate("/profile");
      } else {
        setError("비밀번호를 확인해주세요.");
      }
    } catch (error) {
      console.log(error);
      if (error instanceof FirebaseError) {
        setError(error.message);
      }
    }
  };

  return (
    <form onSubmit={onClickUpdate}>
      <div className="edit-form">
        <div className="col">
          <p className="key">이름</p>
          <input
            className="value"
            type="text"
            value={input.name}
            name="name"
            onChange={onChangeInput}
            required
          ></input>
        </div>
        <div className="col">
          <p className="key">소개</p>
          <input
            className="value"
            type="text"
            value={input.intro}
            name="intro"
            onChange={onChangeInput}
          ></input>
        </div>
        <div className="col">
          <p className="key">현재 비밀번호</p>
          <input
            className="value"
            type="password"
            value={input.prevPassword}
            name="prevPassword"
            onChange={onChangeInput}
          ></input>
        </div>
        <div className="col">
          <p className="key">새 비밀번호</p>
          <input
            className="value"
            type="password"
            value={input.password1}
            name="password1"
            onChange={onChangeInput}
          ></input>
        </div>
        <div className="col">
          <p className="key">새 비밀번호 확인</p>
          <input
            className="value"
            type="password"
            value={input.password2}
            name="password2"
            onChange={onChangeInput}
          ></input>
        </div>
      </div>
      {error !== "" ? <div className="error-text">{error}</div> : null}
      <div className="btn">
        <button type="submit" className="edit-btn">
          수정
        </button>
        <button type="button" className="cancel-btn" onClick={onClickCancel}>
          취소
        </button>
      </div>
    </form>
  );
}

export default memo(EditForm);
