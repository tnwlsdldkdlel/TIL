import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { login } from "../../api/userApi";

export default function GoogleBtn() {
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      login(result);

      navigate("/", { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button className="github-button" onClick={onClick}>
      <img src="/google-mark.png"></img>
      Google로 로그인
    </button>
  );
}
