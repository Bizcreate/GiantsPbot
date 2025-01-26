import React, { useState, useEffect, useRef } from "react";
import LogoutButton from "../../Components/LogoutButton";
import { useAuthContext } from "../../context/AuthContext";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { IoCloseCircle } from "react-icons/io5";
import { HiMenuAlt1 } from "react-icons/hi";
import Spinner from "../../Components/Spinner";

const linksTo = [
  {
    link: "/dashboardAdx/stats",
    title: "Dashboard",
  },
  {
    link: "/dashboardAdx/managetasks",
    title: "Tasks",
  },
  {
    link: "/dashboardAdx/promo",
    title: "Partners",
  },
  //   {
  //     link: "/dashboardAdx/externaltasks",
  //     title: "Other Tasks",
  //   },
  //   {
  //     link: "/dashboardAdx/youtube",
  //     title: "Youtube Tasks",
  //   },

  //   {
  //     link: "/dashboardAdx/broadcast",
  //     title: "Broadcast",
  //   },
  //   {
  //     link: "/dashboardAdx/ranks",
  //     title: "Users Ranks",
  //   },
  //   {
  //     link: "/dashboardAdx/airdroplist",
  //     title: "Airdrop List",
  //   },
  {
    link: "/dashboardAdx/search",
    title: "Users list",
  },
  {
    link: "/dashboardAdx/announcements",
    title: "Announcements",
  },
];

const Dashboard = () => {
  const { user, loading } = useAuthContext();
  const [showMenu, setShowMenu] = useState(false);
  const pageRoute = useLocation();
  const [pageTitle, setPageTitle] = useState("");

  const infoRefTwo = useRef(null);
  // const {} = useAdmin();

  const location = useNavigate();
  const handleClickOutside = (event) => {
    if (infoRefTwo.current && !infoRefTwo.current.contains(event.target)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    if (pageRoute.pathname === "/dashboardAdx/stats") {
      setPageTitle("Admin Dashboard");
    } else if (pageRoute.pathname === "/dashboardAdx/managetasks") {
      setPageTitle("Manage  Tasks");
    } else if (pageRoute.pathname === "/dashboardAdx/externaltasks") {
      setPageTitle("Manage External Tasks");
    } else if (pageRoute.pathname === "/dashboardAdx/promo") {
      setPageTitle("Partners");
    } else if (pageRoute.pathname === "/dashboardAdx/youtube") {
      setPageTitle("Youtube Tasks");
    } else if (pageRoute.pathname === "/dashboardAdx/ranks") {
      setPageTitle("Update Users Ranks");
    } else if (pageRoute.pathname === "/dashboardAdx/airdroplist") {
      setPageTitle("Airdrop List");
    } else if (pageRoute.pathname === "/dashboardAdx/announcements") {
      setPageTitle("Announcements");
    } else {
      setPageTitle("Users list");
    }
  }, [pageRoute.pathname]);

  useEffect(() => {
    if (!loading && !user) {
      location("/dashboardlogin");
    }
  }, [user, loading, location]);

  useEffect(() => {
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-cards">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-[#3e3e3e] p-4 z-30">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <div className="flex items-center w-[18%]">
            <NavLink to="/dashboardAdx/stats">
              <img src="/loader.svg" alt="logo" className="w-[20px]" />
            </NavLink>
          </div>

          <div className="flex-1 flex justify-between items-center">
            <h1 className="text-[16px] sm:text-[18px] font-bold text-center">
              {pageTitle}
            </h1>

            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="h-[35px] w-[35px] rounded-full bg-[#606060] flex items-center justify-center text-white"
              >
                {showMenu ? (
                  <IoCloseCircle size={18} />
                ) : (
                  <HiMenuAlt1 size={18} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex pt-[64px]">
        {/* Sidebar */}
        <div
          className={`${
            showMenu
              ? "fixed inset-0 bg-[#2424243f] backdrop-blur-[1px] z-20"
              : "hidden sm:block"
          } sm:static sm:w-[18%]`}
        >
          <div
            ref={infoRefTwo}
            className={`w-[70%] sm:w-full bg-[#282828] h-svh fixed sm:sticky top-0 left-0 p-4`}
          >
            <div className="flex items-center sm:flex-col gap-2 mb-8">
              <img
                src="/loader.svg"
                alt="logo"
                className="w-[18px] sm:w-[24px]"
              />
              <span className="text-[13px] text-cardtext">{user?.email}</span>
            </div>

            <nav className="flex flex-col space-y-2">
              {linksTo.map((menu, index) => (
                <NavLink
                  to={menu.link}
                  onClick={() => setShowMenu(false)}
                  key={index}
                  className={`${
                    pageRoute.pathname === menu.link ? "bg-[#424242]" : ""
                  } px-3 py-2.5 rounded-[6px] font-medium text-cardtext hover:text-accent transition-colors truncate `}
                >
                  {menu.title}
                </NavLink>
              ))}
              <LogoutButton />
            </nav>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 min-h-screen p-6 text-cardtext">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
