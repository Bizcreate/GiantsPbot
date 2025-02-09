import React, { useState } from "react";
import { FaWallet } from "react-icons/fa";
import { BsWallet2 } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import { useMetaMask } from "../hooks/useMetaMask";
import { useAltura } from "../hooks/useAltura";
import { LoadingSpinner } from "./LoadingSpinner";
import { IoWallet } from "react-icons/io5";
import { MdKeyboardArrowDown } from "react-icons/md";

const Header = () => {
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const {
    connected: metaMaskConnected,
    connecting: metaMaskConnecting,
    account: metaMaskAccount,
    connectWallet: connectMetaMask,
    disconnectWallet: disconnectMetaMask,
  } = useMetaMask();

  const {
    connected: alturaConnected,
    connecting: alturaConnecting,
    account: alturaAccount,
    connectWallet: connectAltura,
    disconnectWallet: disconnectAltura,
  } = useAltura();

  const isAnyWalletConnected = metaMaskConnected || alturaConnected;
  const isAnyWalletConnecting = metaMaskConnecting || alturaConnecting;

  const handleClickOutside = () => {
    setShowWalletOptions(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="mx-auto flex justify-between items-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-primary text-2xl font-Syne font-bold"
        >
          <img src="/company.svg" alt="Alpha Dogs" className="w-10 h-10" />
        </motion.div>

        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowWalletOptions(!showWalletOptions)}
            className="flex items-center gap-2 border border-gray-600 px-4 py-2 rounded-lg 
              text-gray-200 font-medium transition-all duration-200 hover:bg-accent/20"
          >
            <FaWallet className="text-lg" />
            <div className="flex items-center gap-2">
              {isAnyWalletConnecting ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <span>
                    {isAnyWalletConnected
                      ? "Connected Wallets"
                      : "Connect Wallet"}
                  </span>
                  <MdKeyboardArrowDown
                    className={`transition-transform ${
                      showWalletOptions ? "rotate-180" : ""
                    }`}
                  />
                </>
              )}
            </div>
          </motion.button>

          <AnimatePresence>
            {showWalletOptions && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-72 bg-cards rounded-lg shadow-lg overflow-hidden border border-accent/20"
              >
                {/* MetaMask Option */}
                <div className="p-3 border-b border-accent/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <BsWallet2 className="text-xl text-orange-500" />
                      <span className="font-medium">MetaMask</span>
                    </div>
                    {metaMaskConnected && (
                      <span className="text-xs px-2 py-1 bg-green-500/20 text-green-500 rounded-full">
                        Connected
                      </span>
                    )}
                  </div>
                  {metaMaskConnected ? (
                    <div className="space-y-2">
                      <div className="text-sm text-gray-400">
                        {`${metaMaskAccount.slice(
                          0,
                          6
                        )}...${metaMaskAccount.slice(-4)}`}
                      </div>
                      <button
                        onClick={() => {
                          disconnectMetaMask();
                          setShowWalletOptions(false);
                        }}
                        className="w-full px-3 py-1.5 text-sm text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-colors"
                      >
                        Disconnect
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        connectMetaMask();
                        setShowWalletOptions(false);
                      }}
                      disabled={metaMaskConnecting}
                      className="w-full px-3 py-1.5 text-sm bg-accent/20 rounded-lg hover:bg-accent/30 transition-colors"
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
                      <span className="font-medium">Altura</span>
                    </div>
                    {alturaConnected && (
                      <span className="text-xs px-2 py-1 bg-green-500/20 text-green-500 rounded-full">
                        Connected
                      </span>
                    )}
                  </div>
                  {alturaConnected ? (
                    <div className="space-y-2">
                      <div className="text-sm text-gray-400">
                        {`${alturaAccount.slice(0, 6)}...${alturaAccount.slice(
                          -4
                        )}`}
                      </div>
                      <button
                        onClick={() => {
                          disconnectAltura();
                          setShowWalletOptions(false);
                        }}
                        className="w-full px-3 py-1.5 text-sm text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-colors"
                      >
                        Disconnect
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        connectAltura();
                        setShowWalletOptions(false);
                      }}
                      disabled={alturaConnecting}
                      className="w-full px-3 py-1.5 text-sm bg-accent/20 rounded-lg hover:bg-accent/30 transition-colors"
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
