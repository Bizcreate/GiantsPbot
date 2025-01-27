import React from "react";
import { FaWallet } from "react-icons/fa";
import { motion } from "framer-motion";
import { useMetaMask } from "../hooks/useMetaMask";
import { LoadingSpinner } from "./LoadingSpinner";

const Header = () => {
  const { connected, connecting, account, connectWallet, disconnectWallet } =
    useMetaMask();

  const handleWalletClick = async () => {
    console.log("handleWalletClick");
    if (connected) {
      await disconnectWallet();
    } else {
      await connectWallet();
    }
  };
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 bg-cards/80 backdrop-blur-md z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-primary text-2xl font-Syne font-bold"
        >
          <img src="/company.svg" alt="Alpha Dogs" className="w-10 h-10" />
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleWalletClick}
          disabled={connecting}
          className={`flex items-center gap-2 border border-accent px-4 py-2 rounded-lg 
            text-gray-200 font-medium transition-all duration-200
            ${
              connecting
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-accent hover:border-transparent"
            }`}
        >
          <FaWallet className="text-lg" />
          {connecting ? (
            <div className="flex items-center gap-2">
              <LoadingSpinner size="sm" />
              <span>Connecting...</span>
            </div>
          ) : connected ? (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>{`${account.slice(0, 6)}...${account.slice(-4)}`}</span>
            </div>
          ) : (
            "Connect Wallet"
          )}
        </motion.button>
      </div>
    </motion.header>
  );
};

export default Header;
