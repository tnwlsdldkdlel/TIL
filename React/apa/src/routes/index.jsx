import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home";

const router = createBrowserRouter(
  [
    {
      path: "/",
      children: [
        {
          index: true,
          element: <Home />,
        },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
    },
  }
);

export default router;
