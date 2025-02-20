import React, { useState, useEffect, useRef } from "react";
import { FaWallet } from "react-icons/fa";
import { BsWallet2 } from "react-icons/bs";
import { IoWallet, IoClose } from "react-icons/io5";
import { MdKeyboardArrowDown, MdMenu } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { useMetaMask } from "../hooks/useMetaMask";
import { useAltura } from "../hooks/useAltura";
import { LoadingSpinner } from "./LoadingSpinner";
import { BiTask } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { NavLink } from "react-router-dom";
import { FaTrophy } from "react-icons/fa";
import { RiHome5Fill } from "react-icons/ri";
import { HiUsers } from "react-icons/hi2";
import ThirdWebWallet from "./ThirdWebWallet";
const Header = () => {
  // State management
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Refs for click outside detection
  const dropdownRef = useRef(null);
  const mobileWalletRef = useRef(null);
  const headerRef = useRef(null);

  // Menu items configuration
  const menuItems = [
    { label: "Home", icon: <RiHome5Fill className="w-6 h-6" />, href: "/app" },
    {
      label: "Referral",
      icon: <HiUsers className="w-6 h-6" />,
      href: "/app/ref",
    },
    {
      label: "Leaderboard",
      icon: <FaTrophy className="w-6 h-6" />,
      href: "/app/leaderboard",
    },
    {
      label: "Tasks",
      icon: <BiTask className="w-6 h-6" />,
      href: "/app/tasks",
    },
    {
      label: "My Dashboard",
      icon: <CgProfile className="w-6 h-6" />,
      href: "/app/dashboard",
    },
  ];

  // Social links configuration
  const socialLinks = [
    { icon: "/discord.svg", alt: "Discord", href: "#" },
    { icon: "/twitter.svg", alt: "Twitter", href: "#" },
    { icon: "/x.svg", alt: "X", href: "#" },
    { icon: "/telegram.svg", alt: "Telegram", href: "#" },
  ];

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowWalletOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Body scroll lock for mobile menu
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showMobileMenu]);

  return (
    <motion.header
      ref={headerRef}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 bg-lightgray sm:bg-transparent border-b border-newborder3 md:border-0 z-50 transition-all duration-300"
    >
      <div className=" mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <NavLink to={"/"}>
          <img
            src="/company.svg"
            alt="Company Logo"
            className="w-8 h-8 sm:w-10 sm:h-10"
          />
        </NavLink>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-primary text-xl font-bold z-50"
        ></motion.div>

        {/* Right Side Group */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop Wallet Connection */}
          <ThirdWebWallet />

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setShowMobileMenu(true)}
            className="text-gray-200 p-2 border border-gray-600 rounded-lg hover:bg-accent/20 md:hidden"
          >
            <MdMenu className="h-6 w-6" />
          </button>
        </div>

        {/* Full Screen Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black  z-50"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowMobileMenu(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-2"
              >
                <IoClose className="w-6 h-6" />
              </button>

              {/* Mobile Wallet Connection */}
              <div className="px-4 pt-16 pb-6">
                <ThirdWebWallet />
              </div>

              {/* Menu Items */}
              <nav className="px-4 space-y-1">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        `flex items-center gap-3 py-3 px-4 transition-colors ${
                          isActive
                            ? "text-white"
                            : "text-gray-400 hover:text-white"
                        }`
                      }
                    >
                      <span className="w-6">{item.icon}</span>
                      <span className="text-sm">{item.label}</span>
                    </NavLink>
                  </motion.div>
                ))}
              </nav>

              {/* Footer */}
              <div className="absolute bottom-4 left-0 right-0 px-4">
                <div className="text-xs text-gray-500 mb-3 text-center">
                  © 2025 ZAFE Labs PTE. LTD.
                </div>
                <div className="flex justify-center gap-6">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      className="transition-opacity hover:opacity-80"
                    >
                      <img src={link.icon} alt={link.alt} className="h-6 w-6" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
