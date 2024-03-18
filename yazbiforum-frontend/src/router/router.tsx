import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../pages/error/ErrorPage";
import HomePage from "../pages/home/Home";
import SignupPage from "../pages/signup/Signup";
import SigninPage from "../pages/signin/Signin";
import DashboardPage from "../pages/dashboard/DashboardPage";
import ForumsPages from "../pages/forums/ForumsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/forums",
    element: <ForumsPages />,
    children: [
      {
        path: ":author/:forum_id",
      },
    ],
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/signin",
    element: <SigninPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
    children: [
      {
        path: "myforums",
        // element: <div className="w-full h-full z-[100] absolute top-52 left-52 text-4xl text-rose-500">Forumlarım</div>,
      },

      {
        path: "interaction",
        // element: <div>Etkileşimlerim</div>,
      },

      {
        path: "account",
        // element: <div>Etkileşimlerim</div>,
      },
      {
        path: "addforum",
      },
      {
        path: "updateforum/:forum_id",
      },
    ],
  },
]);

export default router;
