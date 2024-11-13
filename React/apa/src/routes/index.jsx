import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import MainLayout from "../layouts/MainLayout";
import Login from "../pages/auth/Login";
import Join from "../pages/auth/Join";
import { ProtectedRoute } from "./ProtectedRoute";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <MainLayout></MainLayout>,
      children: [
        {
          index: true,
          element: <Home />,
        },
      ],
    },
    {
      path: "login",
      element: (
        <ProtectedRoute>
          <Login />
        </ProtectedRoute>
      ),
    },
    {
      path: "join",
      element: (
        <ProtectedRoute>
          <Join />
        </ProtectedRoute>
      ),
    },
  ],
  {
    future: {
      v7_startTransition: true,
    },
  }
);

export default router;
