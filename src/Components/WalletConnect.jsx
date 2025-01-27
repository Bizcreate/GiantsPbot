import React from "react";
import { useMetaMask } from "../hooks/useMetaMask";
import { motion } from "framer-motion";

const WalletConnect = () => {
  const { connected, connecting, account, connectWallet, disconnectWallet } =
    useMetaMask();

  return (
    <div className="flex items-center gap-4">
      {!connected ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={connectWallet}
          disabled={connecting}
          className={`px-4 py-2 bg-accent text-white rounded-xl font-medium
                     flex items-center gap-2 transition-all
                     ${
                       connecting
                         ? "opacity-50 cursor-not-allowed"
                         : "hover:bg-accent2"
                     }`}
        >
          {connecting ? (
            <>
              <span className="animate-spin">↻</span>
              Connecting...
            </>
          ) : (
            "Connect Wallet"
          )}
        </motion.button>
      ) : (
        <div className="flex items-center gap-4">
          <span className="text-primary">
            {account.slice(0, 6)}...{account.slice(-4)}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={disconnectWallet}
            className="px-4 py-2 bg-red-500 text-white rounded-xl font-medium
                     hover:bg-red-600 transition-all"
          >
            Disconnect
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
