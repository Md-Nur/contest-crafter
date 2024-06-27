import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Login from "../pages/Login";
import AllContests from "../pages/AllContests";
import Register from "../pages/Register";
import Contest from "../pages/Contest";
import OnlyUserRoute from "./OnlyUserRoute";
import ErrorPage from "../pages/ErrorPage";
import Payment from "../pages/Payment";
import MyParticipatedContest from "../dashboard/user/MyParticipatedContest";
import MyWinningContest from "../dashboard/user/MyWinningContest";
import OnlyCreatorRoute from "./OnlyCreatorRoute";
import AddContest from "../dashboard/creator/AddContest";
import MyCreatedContest from "../dashboard/creator/MyCreatedContest";
import ContestSubmissionPage from "../dashboard/creator/ContestSubmissionPage";
import OnlyAdminRoute from "./OnlyAdminRoute";
import ManageUser from "../dashboard/admin/ManageUser";
import ManageContest from "../dashboard/admin/ManageContest";
import Profile from "../dashboard/Profile";
import Drawer from "../dashboard/Drawer";
import SingleContestSubmission from "../dashboard/creator/SingleContestSubmission";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/all-contests",
        element: <AllContests />,
      },
      {
        path: "/contest/:id",
        element: (
          <OnlyUserRoute>
            <Contest />
          </OnlyUserRoute>
        ),
      },
      {
        path: "/payment/:contestId",
        element: (
          <OnlyUserRoute>
            <Payment />
          </OnlyUserRoute>
        ),
      },
      {
        path: "/dashboard",
        element: <Drawer />,
        children: [
          {
            path: "/dashboard",
            element: (
              <OnlyUserRoute>
                <Profile />
              </OnlyUserRoute>
            ),
          },
          {
            path: "/dashboard/participated-contest",
            element: (
              <OnlyUserRoute>
                <MyParticipatedContest />
              </OnlyUserRoute>
            ),
          },
          {
            path: "/dashboard/winning-contest",
            element: (
              <OnlyUserRoute>
                <MyWinningContest />
              </OnlyUserRoute>
            ),
          },
          {
            path: "/dashboard/add-contest",
            element: (
              <OnlyCreatorRoute>
                <AddContest />
              </OnlyCreatorRoute>
            ),
          },
          {
            path: "/dashboard/my-created-contest",
            element: (
              <OnlyCreatorRoute>
                <MyCreatedContest />
              </OnlyCreatorRoute>
            ),
          },
          {
            path: "/dashboard/contest-submission",
            element: (
              <OnlyCreatorRoute>
                <ContestSubmissionPage />
              </OnlyCreatorRoute>
            ),
          },
          {
            path: "/dashboard/contest-submission/:id",
            element: (
              <OnlyCreatorRoute>
                <SingleContestSubmission />
              </OnlyCreatorRoute>
            ),
          },
          {
            path: "/dashboard/manage-user",
            element: (
              <OnlyAdminRoute>
                <ManageUser />
              </OnlyAdminRoute>
            ),
          },
          {
            path: "/dashboard/manage-contest",
            element: (
              <OnlyAdminRoute>
                <ManageContest />
              </OnlyAdminRoute>
            ),
          },
        ],
      },
    ],
  },
]);

export default router;
