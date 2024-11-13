import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// 로그인 한 사람은 로그인, 회원가입 페이지 접근하지 못하도록.
export const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (user !== null) {
    return <Navigate to="/"></Navigate>;
  }

  return children;
};
