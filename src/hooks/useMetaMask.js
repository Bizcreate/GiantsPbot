import { useSDK } from "@metamask/sdk-react";
import { useState, useCallback, useEffect } from "react";
import { useUserAuth } from "../context/UserAuthContext";
import { walletService } from "../services/walletService";
import toast from "react-hot-toast";
import { ethers } from "ethers";

// Common ERC20 ABI for token balance
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
];

// Common ERC721 ABI for NFT balance
const ERC721_ABI = [
  {
    constant: true,
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
];

export const useMetaMask = () => {
  const { sdk, connected, connecting, provider, chainId } = useSDK();
  const [account, setAccount] = useState("");
  const [error, setError] = useState("");
  const [balance, setBalance] = useState("0");
  const [tokens, setTokens] = useState([]);
  const [nfts, setNfts] = useState([]);
  const { user } = useUserAuth();

  // Fetch native token balance
  const updateBalance = useCallback(async () => {
    if (provider && account) {
      try {
        const balance = await provider.request({
          method: "eth_getBalance",
          params: [account, "latest"],
        });
        const formattedBalance = (parseInt(balance, 16) / 1e18).toFixed(4);
        setBalance(formattedBalance);

        if (user?.uid) {
          await walletService.updateBalance(user.uid, formattedBalance);
        }
      } catch (err) {
        console.error("Error fetching balance:", err);
      }
    }
  }, [provider, account, user]);

  // Fetch NFTs using Moralis API
  const fetchNFTs = useCallback(async () => {
    if (!account) return;

    try {
      const networkMap = {
        1: "eth",
        137: "polygon",
        56: "bsc",
        // Add more networks as needed
      };

      const chainName = networkMap[chainId] || "eth";
      const apiKey =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImFjOTI2ZjFiLTczOTctNDEyNS05MjJmLTY2ZGU4OTg0N2UwNSIsIm9yZ0lkIjoiNDI3NzE0IiwidXNlcklkIjoiNDM5OTUzIiwidHlwZUlkIjoiNzIyYWRkODYtODU2Zi00ZWQwLWEyN2ItMjA5ZDIzNzRjNzljIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3Mzc5NjI3NzcsImV4cCI6NDg5MzcyMjc3N30.g5Fc9NqW6Duv1M-rp7CZsXd987orD2N-SkFrq_OYexs";
      const response = await fetch(
        `https://deep-index.moralis.io/api/v2/${account}/nft?chain=${chainName}&format=decimal`,
        {
          headers: {
            "X-API-Key": apiKey,
          },
        }
      );

      const data = await response.json();
      setNfts(data.result || []);

      if (user?.uid) {
        await walletService.updateNFTs(user.uid, data.result || []);
      }
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  }, [account, chainId, user]);

  // Fetch common tokens using Moralis API
  const fetchTokens = useCallback(async () => {
    if (!account) return;

    try {
      const networkMap = {
        1: "eth",
        137: "polygon",
        56: "bsc",
        // Add more networks as needed
      };

      const chainName = networkMap[chainId] || "eth";
      const apiKey =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImFjOTI2ZjFiLTczOTctNDEyNS05MjJmLTY2ZGU4OTg0N2UwNSIsIm9yZ0lkIjoiNDI3NzE0IiwidXNlcklkIjoiNDM5OTUzIiwidHlwZUlkIjoiNzIyYWRkODYtODU2Zi00ZWQwLWEyN2ItMjA5ZDIzNzRjNzljIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3Mzc5NjI3NzcsImV4cCI6NDg5MzcyMjc3N30.g5Fc9NqW6Duv1M-rp7CZsXd987orD2N-SkFrq_OYexs";
      const response = await fetch(
        `https://deep-index.moralis.io/api/v2/${account}/erc20?chain=${chainName}`,
        {
          headers: {
            "X-API-Key": apiKey,
          },
        }
      );

      const data = await response.json();
      setTokens(data);

      if (user?.uid) {
        await walletService.updateTokens(user.uid, data);
      }
    } catch (error) {
      console.error("Error fetching tokens:", error);
    }
  }, [account, chainId, user]);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    try {
      const accounts = await sdk?.connect();
      const connectedAccount = accounts?.[0];

      if (connectedAccount && user?.uid) {
        setAccount(connectedAccount);

        // Get chain ID and network info
        let networkInfo = {
          chainId: null,
          networkName: "unknown",
        };

        try {
          const chainIdHex = await provider?.request({
            method: "eth_chainId",
          });
          const chainIdDecimal = parseInt(chainIdHex, 16);

          const networkMap = {
            1: "ethereum",
            5: "goerli",
            11155111: "sepolia",
            137: "polygon",
            80001: "mumbai",
          };

          networkInfo = {
            chainId: chainIdDecimal,
            networkName: networkMap[chainIdDecimal] || "unknown",
          };
        } catch (error) {
          console.error("Error getting network info:", error);
        }

        // Save initial wallet info
        await walletService.saveWalletInfo(user.uid, {
          address: connectedAccount.toLowerCase(),
          chainId: networkInfo.chainId,
          networkName: networkInfo.networkName,
          balance: "0",
          tokens: [],
          nfts: [],
        });

        // Update all balances and assets
        await Promise.all([updateBalance(), fetchTokens(), fetchNFTs()]);

        toast.success("Wallet connected successfully!");
        return connectedAccount;
      }
    } catch (err) {
      console.error("Failed to connect wallet:", err);
      setError(err.message);
      toast.error("Failed to connect wallet");
      return null;
    }
  }, [sdk, user, provider, updateBalance, fetchTokens, fetchNFTs]);

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    try {
      await sdk?.terminate();
      setAccount("");
      setBalance("0");

      if (user?.uid) {
        await walletService.updateConnectionStatus(user.uid, false);
      }

      toast.success("Wallet disconnected");
    } catch (err) {
      console.error("Failed to disconnect wallet:", err);
      setError(err.message);
      toast.error("Failed to disconnect wallet");
    }
  }, [sdk, user]);

  // Send transaction
  const sendTransaction = useCallback(
    async (to, value, data = "") => {
      try {
        if (!account) throw new Error("Wallet not connected");

        const transaction = {
          from: account,
          to,
          value: `0x${value.toString(16)}`,
          data,
        };

        const txHash = await provider?.request({
          method: "eth_sendTransaction",
          params: [transaction],
        });

        // Save transaction to Firebase
        if (user?.uid) {
          await walletService.addTransaction(user.uid, {
            hash: txHash,
            from: account,
            to,
            value: value.toString(),
            data,
            status: "pending",
          });
        }

        toast.success("Transaction sent successfully");
        return txHash;
      } catch (err) {
        console.error("Transaction failed:", err);
        setError(err.message);
        toast.error("Transaction failed");
        return null;
      }
    },
    [account, provider, user]
  );

  // Update assets periodically
  useEffect(() => {
    if (connected && account) {
      const updateAssets = async () => {
        await Promise.all([updateBalance(), fetchTokens(), fetchNFTs()]);
      };

      updateAssets();
      const interval = setInterval(updateAssets, 30000); // Every 30 seconds
      return () => clearInterval(interval);
    }
  }, [connected, account, updateBalance, fetchTokens, fetchNFTs]);

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
    sendTransaction,
    updateBalance,
    fetchTokens,
    fetchNFTs,
  };
};
