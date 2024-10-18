import { Navigate } from "react-router-dom";
import { auth } from "../../firebase";
import { memo } from "react";

function ProtectedRoute({ children }) {
  const user = auth.currentUser;

  if (user === null) {
    return <Navigate to="/login"></Navigate>;
  }

  return children;
}

export default memo(ProtectedRoute);
