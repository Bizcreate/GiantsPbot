import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { RiHome5Line, RiHome5Fill } from "react-icons/ri";
import { HiOutlineUsers, HiUsers } from "react-icons/hi2";
import { BiTrophy } from "react-icons/bi";
import { FaTasks, FaTrophy } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { RiUserFill } from "react-icons/ri";

const Sidebar = () => {
  const location = useLocation();

  const navLinks = [
    {
      title: "Home",
      link: "/app",
      icon: RiHome5Line,
      activeIcon: RiHome5Fill,
      exact: true,
    },
    {
      title: "Friends",
      link: "/app/ref",
      icon: HiOutlineUsers,
      activeIcon: HiUsers,
    },
    {
      title: "Leaders",
      link: "/app/leaderboard",
      icon: BiTrophy,
      activeIcon: FaTrophy,
    },
    {
      title: "Tasks",
      link: "/app/tasks",
      icon: FaTasks,
      activeIcon: FaTasks,
    },
    {
      title: "Dashboard",
      link: "/app/dashboard",
      icon: CgProfile,
      activeIcon: RiUserFill,
    },
  ];

  const isLinkActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed left-0 top-0 h-full z-10000 w-64 bg-cards border-r border-borders2 p-4">
      <div className="flex flex-col h-full">
        <div className="mb-16 px-4"></div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2">
          {navLinks.map((item, index) => (
            <NavLink
              key={index}
              to={item.link}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition-colors duration-150
                ${
                  isLinkActive(item.link, item.exact)
                    ? "bg-accent/10 text-accent"
                    : "text-secondary hover:bg-cards2 hover:text-primary"
                }`
              }
            >
              {isLinkActive(item.link, item.exact) ? (
                <item.activeIcon className="w-5 h-5 mr-3" />
              ) : (
                <item.icon className="w-5 h-5 mr-3" />
              )}
              <span className="font-medium">{item.title}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
