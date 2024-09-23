import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import "./github-btn.css";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function GithubButton() {
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button className="github-button" onClick={onClick}>
      <img src="/github-mark.svg"></img>
      Continue with Github
    </button>
  );
}
