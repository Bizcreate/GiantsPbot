import React from "react";
import { FaWallet } from "react-icons/fa";
import { motion } from "framer-motion";

const Header = () => {
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
          className="flex items-center gap-2 border border-[#fe2e00] px-4 py-2 rounded-lg text-gray-200 font-medium"
        >
          <FaWallet className="text-lg" />
          Connect Wallet
        </motion.button>
      </div>
    </motion.header>
  );
};

export default Header;
