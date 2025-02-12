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
import ExternalTasks from "./pages/admin/ExtrenalTasks";
import AdminAdvertTasks from "./pages/admin/AdminAdvertTasks";
import AirdropWallets from "./pages/admin/AdminWallets";
import Search from "./pages/admin/Search";
import Statistics from "./pages/admin/Statistics";
import AdminRanks from "./pages/admin/AdminRanks";
import AdminYoutube from "./pages/admin/AdminYoutube";
import LandingPage from "./Components/Landing";
import AlphaDogs from "./pages/AlphaDogs";
import BroadcastMessage from "./Components/BroadcastMessage";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import ProtectedRoute from "./Components/ProtectedRoute";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import AuthLayout from "./layouts/AuthLayout";
import UserDashboard from "./pages/user/UserDashboard";
import { Toaster } from "react-hot-toast";
import AdminProtectedRoute from "./Components/AdminProtectedRoute";
import NotAdmin236 from "./pages/NotAdmin236";
import AdminSignUp from "./pages/admin/AdminSignUp";
import AdminPanel from "./Components/AdminPanel";
import TaskPage from "./pages/TaskPage";
import { MetaMaskProvider } from "@metamask/sdk-react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
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
        element: <Home />,
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
      {
        path: "/app/tasks",
        element: <TaskPage />,
      },
    ],
  },
  {
    path: "/dashboardlogin",
    element: <NotAdmin236 />,
  },
  {
    path: "/dashboardAdx/signup",
    element: <AdminSignUp />,
  },
  {
    path: "/dashboardAdx",
    element: (
      <AdminProtectedRoute>
        <Dashboard />
      </AdminProtectedRoute>
    ),
    errorElement: <ErrorCom />,
    children: [
      {
        path: "/dashboardAdx/announcements",
        element: <Settings />,
      },
      {
        path: "/dashboardAdx/managetasks",
        element: <AdminPanel />,
      },
      {
        path: "/dashboardAdx/externaltasks",
        element: <ExternalTasks />,
      },
      {
        path: "/dashboardAdx/promo",
        element: <AdminAdvertTasks />,
      },
      {
        path: "/dashboardAdx/youtube",
        element: <AdminYoutube />,
      },
      {
        path: "/dashboardAdx/airdroplist",
        element: <AirdropWallets />,
      },
      {
        path: "/dashboardAdx/ranks",
        element: <AdminRanks />,
      },
      {
        path: "/dashboardAdx/search",
        element: <Search />,
      },
      {
        path: "/dashboardAdx/stats",
        element: <Statistics />,
      },
      {
        path: "/dashboardAdx/Broadcast",
        element: <BroadcastMessage />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthContextProvider>
    <UserAuthContextProvider>
      <MetaMaskProvider
        sdkOptions={{
          dappMetadata: {
            name: "Your App Name",
            url: window.location.href,
          },
          checkInstallationImmediately: false,
          connectFirstChainId: true,
          defaultNetwork: "etherium",
          infuraAPIKey: "0172cf3cfab54f05b2ad8a6bd21b79ac",
        }}
      >
        <React.StrictMode>
          <RouterProvider router={router} />
          <Toaster position="top-right" reverseOrder={false} />
        </React.StrictMode>
      </MetaMaskProvider>
    </UserAuthContextProvider>
  </AuthContextProvider>
);