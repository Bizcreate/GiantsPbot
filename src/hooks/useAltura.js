import { useState, useCallback } from "react";
import { useUserAuth } from "../context/UserAuthContext";
import { walletService } from "../services/walletService";
import toast from "react-hot-toast";

export const useAltura = () => {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [account, setAccount] = useState("");
  const [chainId, setChainId] = useState(null);
  const [error, setError] = useState("");
  const [balance, setBalance] = useState("0");
  const [tokens, setTokens] = useState([]);
  const [nfts, setNfts] = useState([]);
  const { user } = useUserAuth();

  // Update balance using Moralis API
  const updateBalance = useCallback(
    async (address) => {
      if (!address) return;

      try {
        const networkMap = {
          1: "eth",
          137: "polygon",
          56: "bsc",
        };
        const chainName = networkMap[chainId] || "eth";
        const apiKey = "YOUR_MORALIS_API_KEY";

        const response = await fetch(
          `https://deep-index.moralis.io/api/v2/${address}/balance?chain=${chainName}`,
          {
            headers: {
              "X-API-Key": apiKey,
            },
          }
        );

        const data = await response.json();
        const balanceInEther = (parseInt(data.balance) / 1e18).toFixed(4);
        setBalance(balanceInEther);

        if (user?.uid) {
          await walletService.updateAlturaBalance(user.uid, balanceInEther);
        }
      } catch (err) {
        console.error("Error fetching Altura balance:", err);
      }
    },
    [chainId, user]
  );

  // Fetch NFTs using Moralis API
  const fetchNFTs = useCallback(
    async (address) => {
      if (!address) return;

      try {
        const networkMap = {
          1: "eth",
          137: "polygon",
          56: "bsc",
        };

        const chainName = networkMap[chainId] || "eth";
        const apiKey = "YOUR_MORALIS_API_KEY";

        const response = await fetch(
          `https://deep-index.moralis.io/api/v2/${address}/nft?chain=${chainName}&format=decimal`,
          {
            headers: {
              "X-API-Key": apiKey,
            },
          }
        );

        const data = await response.json();
        setNfts(data.result || []);

        if (user?.uid) {
          await walletService.updateAlturaNFTs(user.uid, data.result || []);
        }
      } catch (error) {
        console.error("Error fetching Altura NFTs:", error);
      }
    },
    [chainId, user]
  );

  // Fetch tokens using Moralis API
  const fetchTokens = useCallback(
    async (address) => {
      if (!address) return;

      try {
        const networkMap = {
          1: "eth",
          137: "polygon",
          56: "bsc",
        };

        const chainName = networkMap[chainId] || "eth";
        const apiKey = "YOUR_MORALIS_API_KEY";

        const response = await fetch(
          `https://deep-index.moralis.io/api/v2/${address}/erc20?chain=${chainName}`,
          {
            headers: {
              "X-API-Key": apiKey,
            },
          }
        );

        const data = await response.json();
        setTokens(data);

        if (user?.uid) {
          await walletService.updateAlturaTokens(user.uid, data);
        }
      } catch (error) {
        console.error("Error fetching Altura tokens:", error);
      }
    },
    [chainId, user]
  );

  // Connect wallet
  const connectWallet = useCallback(async () => {
    try {
      setConnecting(true);

      // Here you can implement a simple way to get the user's wallet address
      // For example, using a prompt or a modal
      const walletAddress = prompt("Please enter your Altura wallet address:");

      if (walletAddress && user?.uid) {
        setAccount(walletAddress);
        setChainId(1); // Default to Ethereum mainnet
        setConnected(true);

        // Save initial wallet info
        await walletService.saveAlturaWalletInfo(user.uid, {
          address: walletAddress.toLowerCase(),
          chainId: 1,
          networkName: "ethereum",
          balance: "0",
          tokens: [],
          nfts: [],
        });

        // Update all balances and assets
        await Promise.all([
          updateBalance(walletAddress),
          fetchTokens(walletAddress),
          fetchNFTs(walletAddress),
        ]);

        toast.success("Altura wallet connected successfully!");
        return walletAddress;
      }
    } catch (err) {
      console.error("Failed to connect Altura wallet:", err);
      setError(err.message);
      toast.error("Failed to connect Altura wallet");
      return null;
    } finally {
      setConnecting(false);
    }
  }, [user, updateBalance, fetchTokens, fetchNFTs]);

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    try {
      setConnected(false);
      setAccount("");
      setBalance("0");
      setChainId(null);
      setTokens([]);
      setNfts([]);

      if (user?.uid) {
        await walletService.updateAlturaConnectionStatus(user.uid, false);
      }

      toast.success("Altura wallet disconnected");
    } catch (err) {
      console.error("Failed to disconnect Altura wallet:", err);
      setError(err.message);
      toast.error("Failed to disconnect Altura wallet");
    }
  }, [user]);

  return {
    connected,
    connecting,
    account,
    chainId,
    error,
    balance,
    tokens,
    nfts,
    connectWallet,
    disconnectWallet,
    updateBalance,
    fetchTokens,
    fetchNFTs,
  };
};
