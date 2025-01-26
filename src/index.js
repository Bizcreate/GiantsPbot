import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Ref from "./pages/Ref";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import ErrorCom from "./Components/ErrorCom";
import { AuthContextProvider } from "./context/AuthContext";
import Leaderboard from "./pages/Leaderboard";
import DailyCheckIn from "./pages/Checkin";
import CryptoFarming from "./pages/Farm";
import Airdrop from "./pages/Airdrop";
import Dashboard from "./pages/admin/Dashboard";
import Settings from "./pages/admin/Settings";
import EditTasks from "./pages/admin/EditTasks";
import ExtrenalTasks from "./pages/admin/ExtrenalTasks";
import AdminAdvertTasks from "./pages/admin/AdminAdvertTasks";
import AirdropWallets from "./pages/admin/AdminWallets";
import Search from "./pages/admin/Search";
import Statistics from "./pages/admin/Statistics";
import AdminRanks from "./pages/admin/AdminRanks";
import AdminYoutube from "./pages/admin/AdminYoutube";
import AlphaDogs from "./pages/AlphaDogs";
import BroadcastMessage from "./Components/BroadcastMessage";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import ProtectedRoute from "./Components/ProtectedRoute";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import AuthLayout from "./layouts/AuthLayout";
import UserDashboard from "./pages/user/UserDashboard";
import { Toaster } from "react-hot-toast";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorCom />,
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <AuthLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/app",
        element: <AlphaDogs />,
      },
      {
        path: "/app/ref",
        element: <Ref />,
      },
      {
        path: "/app/airdrop",
        element: <Airdrop />,
      },
      {
        path: "/app/leaderboard",
        element: <Leaderboard />,
      },
      {
        path: "/app/checkin",
        element: <DailyCheckIn />,
      },
      {
        path: "/app/earn",
        element: <CryptoFarming />,
      },
      {
        path: "/app/dashboard",
        element: <UserDashboard />,
      },
    ],
  },
  {
    path: "/dashboardAdx",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    errorElement: <ErrorCom />,
    children: [
      {
        path: "/dashboardAdx/announcements",
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboardAdx/managetasks",
        element: (
          <ProtectedRoute>
            <EditTasks />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboardAdx/externaltasks",
        element: (
          <ProtectedRoute>
            <ExtrenalTasks />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboardAdx/promo",
        element: (
          <ProtectedRoute>
            <AdminAdvertTasks />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboardAdx/youtube",
        element: (
          <ProtectedRoute>
            <AdminYoutube />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboardAdx/airdroplist",
        element: (
          <ProtectedRoute>
            <AirdropWallets />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboardAdx/ranks",
        element: (
          <ProtectedRoute>
            <AdminRanks />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboardAdx/search",
        element: (
          <ProtectedRoute>
            <Search />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboardAdx/stats",
        element: (
          <ProtectedRoute>
            <Statistics />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboardAdx/Broadcast",
        element: (
          <ProtectedRoute>
            <BroadcastMessage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthContextProvider>
    <UserAuthContextProvider>
      <React.StrictMode>
        <RouterProvider router={router} />
        <Toaster position="top-right" reverseOrder={false} />
      </React.StrictMode>
    </UserAuthContextProvider>
  </AuthContextProvider>
);
