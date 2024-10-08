import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import "./github-btn.css";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

export default function GithubButton() {
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const userQuery = query(
        collection(db, "user"),
        where("id", "==", result.user.uid)
      );
      const userSnapshot = await getDocs(userQuery);

      if (userSnapshot.empty) {
        await addDoc(collection(db, "user"), {
          createdAt: Date.now(),
          updatedAt: Date.now(),
          id: result.user.uid,
          name: result.user.displayName,
          photo: result.user.photoURL,
        });
      }

      navigate("/", { replace: true });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button className="github-button" onClick={onClick}>
      <img src="/github-mark.svg"></img>
      Github으로 로그인
    </button>
  );
}
