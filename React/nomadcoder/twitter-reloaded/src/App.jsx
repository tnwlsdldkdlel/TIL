import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/common/layout";
import { useEffect, useState } from "react";
import LoadingScreen from "./components/common/loading-screen";
import { auth } from "./firebase";
import Home from "./pages/home";
import Profile from "./pages/profile";
import Login from "./pages/login";
import CreateAccount from "./pages/create-account";
import "./App.css";
import ProtectedRoute from "./components/common/protected-route";
import ProfileEdit from "./components/profile/Edit";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: "", element: <Home /> },
      { path: "profile/:userId", element: <Profile /> },
      { path: "profile", element: <Profile /> },
      { path: "profile/edit", element: <ProfileEdit /> },
    ],
  },
  {
    path: "/login",
    children: [{ path: "", element: <Login /> }],
  },
  {
    path: "/create-account",
    children: [{ path: "", element: <CreateAccount /> }],
  },
]);
function App() {
  const [isLoading, setLoading] = useState(true);
  const init = async () => {
    // firebase가 쿠키와 토큰을 읽고 백엔드와 소통해서 로그인여부를 확인하는 동안 기다림.
    await auth.authStateReady();
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="app">
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </div>
  );
}

export default App;
