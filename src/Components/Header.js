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
import { FaTrophy } from "react-icons/fa";
import { RiHome5Fill } from "react-icons/ri";
import { HiUsers } from "react-icons/hi2";

const Header = () => {
  // State management
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileWalletOptions, setShowMobileWalletOptions] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Refs for click outside detection
  const dropdownRef = useRef(null);
  const mobileWalletRef = useRef(null);
  const headerRef = useRef(null);

  // MetaMask wallet hook
  const {
    connected: metaMaskConnected,
    connecting: metaMaskConnecting,
    account: metaMaskAccount,
    connectWallet: connectMetaMask,
    disconnectWallet: disconnectMetaMask,
  } = useMetaMask();

  // Altura wallet hook
  const {
    connected: alturaConnected,
    connecting: alturaConnecting,
    account: alturaAccount,
    connectWallet: connectAltura,
    disconnectWallet: disconnectAltura,
  } = useAltura();

  // Combined wallet states
  const isAnyWalletConnected = metaMaskConnected || alturaConnected;
  const isAnyWalletConnecting = metaMaskConnecting || alturaConnecting;

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

  // Responsive design handler
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowWalletOptions(false);
      }
      if (
        mobileWalletRef.current &&
        !mobileWalletRef.current.contains(event.target)
      ) {
        setShowMobileWalletOptions(false);
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

  // Wallet connection handler
  const handleWalletConnection = (type, action) => {
    if (type === "metamask") {
      action === "connect" ? connectMetaMask() : disconnectMetaMask();
    } else {
      action === "connect" ? connectAltura() : disconnectAltura();
    }

    if (isMobile) {
      setShowMobileWalletOptions(false);
    } else {
      setShowWalletOptions(false);
    }
  };

  // Reusable wallet options component
  const WalletOptions = ({ isMobile = false }) => (
    <div
      className={` rounded-lg shadow-lg overflow-hidden border border-gray-800 ${
        isMobile ? "w-full mt-2" : "w-72"
      }`}
    >
      {/* MetaMask Option */}
      <div className="p-3 border-b border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BsWallet2 className="text-xl text-orange-500" />
            <span className="font-medium text-white text-sm">MetaMask</span>
          </div>
          {metaMaskConnected && (
            <span className="text-xs px-2 py-1 bg-green-500/20 text-green-500 rounded-full">
              Connected
            </span>
          )}
        </div>
        {metaMaskConnected ? (
          <div className="space-y-2">
            <div className="text-xs text-gray-400">
              {`${metaMaskAccount.slice(0, 6)}...${metaMaskAccount.slice(-4)}`}
            </div>
            <button
              onClick={() => handleWalletConnection("metamask", "disconnect")}
              className="w-full px-3 py-1.5 text-xs text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-colors"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={() => handleWalletConnection("metamask", "connect")}
            disabled={metaMaskConnecting}
            className="w-full px-3 py-1.5 text-white text-xs bg-accent/20 rounded-lg hover:bg-accent/30 transition-colors"
          >
            {metaMaskConnecting ? (
              <div className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" />
                <span>Connecting...</span>
              </div>
            ) : (
              "Connect"
            )}
          </button>
        )}
      </div>

      {/* Altura Option */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <IoWallet className="text-xl text-blue-500" />
            <span className="font-medium text-white text-sm">Altura</span>
          </div>
          {alturaConnected && (
            <span className="text-xs px-2 py-1 bg-green-500/20 text-green-500 rounded-full">
              Connected
            </span>
          )}
        </div>
        {alturaConnected ? (
          <div className="space-y-2">
            <div className="text-xs text-gray-400">
              {`${alturaAccount.slice(0, 6)}...${alturaAccount.slice(-4)}`}
            </div>
            <button
              onClick={() => handleWalletConnection("altura", "disconnect")}
              className="w-full px-3 py-1.5 text-xs text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-colors"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={() => handleWalletConnection("altura", "connect")}
            disabled={alturaConnecting}
            className="w-full px-3 py-1.5 text-xs bg-accent/20 rounded-lg text-white hover:bg-accent/30 transition-colors"
          >
            {alturaConnecting ? (
              <div className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" />
                <span>Connecting...</span>
              </div>
            ) : (
              "Connect"
            )}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <motion.header
      ref={headerRef}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 bg-lightgray sm:bg-transparent border-b border-newborder3 md:border-0 z-50 transition-all duration-300"
    >
      <div className=" mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-primary text-xl font-bold z-50"
        >
          <img
            src="/company.svg"
            alt="Company Logo"
            className="w-8 h-8 sm:w-10 sm:h-10"
          />
        </motion.div>

        {/* Right Side Group */}
        <div className="flex items-center gap-3">
          {/* Desktop Wallet Connection */}
          <div className="relative hidden md:block" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowWalletOptions(!showWalletOptions)}
              className="flex items-center gap-2 border border-gray-600 px-4 py-2 rounded-lg 
                text-gray-200 font-medium transition-all duration-200 hover:bg-accent/20"
            >
              <FaWallet className="text-lg" />
              {isAnyWalletConnecting ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <span>{isAnyWalletConnected ? "Connected" : "Connect"}</span>
                  <MdKeyboardArrowDown
                    className={`transition-transform ${
                      showWalletOptions ? "rotate-180" : ""
                    }`}
                  />
                </>
              )}
            </motion.button>

            <AnimatePresence>
              {showWalletOptions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2"
                >
                  <WalletOptions />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
              <div className="px-4 pt-16 pb-6" ref={mobileWalletRef}>
                <button
                  onClick={() =>
                    setShowMobileWalletOptions(!showMobileWalletOptions)
                  }
                  className="w-full py-3 px-4 rounded-lg border border-gray-800 text-gray-200 hover:bg-gray-800/50 transition-colors flex items-center justify-center gap-2"
                >
                  <FaWallet className="text-lg" />
                  <span>Connect Wallet</span>
                  <MdKeyboardArrowDown
                    className={`transition-transform ${
                      showMobileWalletOptions ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {showMobileWalletOptions && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <WalletOptions isMobile />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Menu Items */}
              <nav className="px-4 space-y-1">
                {menuItems.map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.href}
                    className="flex items-center gap-3 py-3 px-4 text-gray-400 hover:text-white transition-colors"
                  >
                    <span className="w-6">{item.icon}</span>
                    <span className="text-sm">{item.label}</span>
                  </motion.a>
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
