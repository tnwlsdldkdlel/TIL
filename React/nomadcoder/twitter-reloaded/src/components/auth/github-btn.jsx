import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import "./github-btn.css";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { login } from "../../api/userApi";

export default function GithubButton() {
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);

      login(result);

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
