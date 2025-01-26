import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { RiHome5Line, RiHome5Fill } from "react-icons/ri";
import { HiOutlineUsers, HiUsers } from "react-icons/hi2";
import { BiTrophy } from "react-icons/bi";
import { FaTrophy } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { RiUserFill } from "react-icons/ri";

const Footer = () => {
  const location = useLocation();

  const footerLinks = [
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
      title: "Dashboard",
      link: "/app/dashboard",
      icon: CgProfile,
      activeIcon: RiUserFill,
    },
  ];

  // Custom function to check if link is active
  const isLinkActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="footer-nav">
      {footerLinks.map((item, index) => (
        <NavLink
          key={index}
          to={item.link}
          className={({ isActive }) =>
            `nav-link ${isLinkActive(item.link, item.exact) ? "active" : ""}`
          }
        >
          {isLinkActive(item.link, item.exact) ? (
            <item.activeIcon className="nav-icon" />
          ) : (
            <item.icon className="nav-icon" />
          )}
          <span className="nav-text">{item.title}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default Footer;
