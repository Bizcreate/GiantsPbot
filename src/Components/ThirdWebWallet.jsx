import React, { useState, useEffect } from "react";
import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import { darkTheme } from "thirdweb/react";
import { createWallet, walletConnect } from "thirdweb/wallets";
import { TonConnectButton } from "@tonconnect/ui-react";
import { FaWallet } from "react-icons/fa";
const client = createThirdwebClient({
  clientId: "30b0a2d7a206d41a5bfc150d57f5bee0",
});

const ThirdWebWallet = () => {
  const [walletsToUse, setWalletsToUse] = useState([]);

  useEffect(() => {
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
      setWalletsToUse([
        walletConnect({
          qrcode: false,
          mobile: {
            getUri: (uri) =>
              `https://metamask.app.link/wc?uri=${encodeURIComponent(uri)}`,
          },
        }),
      ]);
    } else {
      setWalletsToUse([
        createWallet("io.metamask"),
        createWallet("com.coinbase.wallet"),
        createWallet("app.phantom"),
        createWallet("me.rainbow"),
        createWallet("com.trustwallet.app"),
      ]);
    }
  }, []);

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="wallet-wrapper relative flex items-center">
        <div className="absolute left-3 z-10">
          <FaWallet className="w-4 h-4 text-accent" />
        </div>
        <ConnectButton
          client={client}
          wallets={walletsToUse}
          theme={darkTheme({
            colors: {
              modalBg: "#0D0D0D",
              primaryButtonBg: "#fe2e00",
              primaryButtonText: "#ffffff",
              secondaryButtonBg: "#1F1F1F",
              secondaryButtonText: "#ffffff",
              connectedButtonBg: "#1F1F1F",
              connectedButtonText: "#ffffff",
              borderColor: "#272727",
              linkColor: "#fe2e00",
              primaryTextColor: "#ffffff",
              secondaryTextColor: "#BABABA",
            },
          })}
          connectModal={{
            size: "compact",
          }}
          style={{
            backgroundColor: "#1F1F1F",
            border: "1px solid #272727",
            borderRadius: "8px",
            padding: "8px 16px 8px 36px",
            fontSize: "14px",
            fontWeight: "500",
          }}
        />
      </div>
      <div className="ton-wrapper">
        <TonConnectButton />
      </div>
    </div>
  );
};

export default ThirdWebWallet;
