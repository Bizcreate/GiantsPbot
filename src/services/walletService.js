import { db } from "../firebase/config";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

export const walletService = {
  // Create or update wallet information
  async saveWalletInfo(userId, walletData) {
    try {
      const walletRef = doc(db, "wallets", userId);

      const walletInfo = {
        userId,
        address: walletData.address,
        chainId: walletData.chainId,
        lastConnected: serverTimestamp(),
        isConnected: true,
        transactions: [],
        networkName: walletData.networkName || "ethereum",
        balance: walletData.balance || "0",
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      };

      await setDoc(walletRef, walletInfo, { merge: true });
      return walletInfo;
    } catch (error) {
      console.error("Error saving wallet info:", error);
      throw error;
    }
  },

  // Get wallet information by user ID
  async getWalletByUserId(userId) {
    try {
      const walletRef = doc(db, "wallets", userId);
      const walletDoc = await getDoc(walletRef);

      if (walletDoc.exists()) {
        return walletDoc.data();
      }
      return null;
    } catch (error) {
      console.error("Error getting wallet info:", error);
      throw error;
    }
  },

  // Get wallet information by wallet address
  async getWalletByAddress(address) {
    try {
      const walletsRef = collection(db, "wallets");
      const q = query(
        walletsRef,
        where("address", "==", address.toLowerCase())
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data();
      }
      return null;
    } catch (error) {
      console.error("Error getting wallet by address:", error);
      throw error;
    }
  },

  // Update wallet connection status
  async updateConnectionStatus(userId, isConnected) {
    try {
      const walletRef = doc(db, "wallets", userId);
      await updateDoc(walletRef, {
        isConnected,
        lastConnected: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating connection status:", error);
      throw error;
    }
  },

  // Add transaction to wallet history
  async addTransaction(userId, transaction) {
    try {
      const walletRef = doc(db, "wallets", userId);
      const walletDoc = await getDoc(walletRef);

      if (walletDoc.exists()) {
        const transactions = walletDoc.data().transactions || [];
        transactions.push({
          ...transaction,
          timestamp: serverTimestamp(),
        });

        await updateDoc(walletRef, {
          transactions,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }
  },

  // Update wallet balance
  async updateBalance(userId, balance) {
    try {
      const walletRef = doc(db, "wallets", userId);
      await updateDoc(walletRef, {
        balance,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating balance:", error);
      throw error;
    }
  },

  // Update NFTs
  async updateNFTs(userId, nfts) {
    try {
      const walletRef = doc(db, "wallets", userId);
      await updateDoc(walletRef, {
        nfts,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating NFTs:", error);
      throw error;
    }
  },

  // Update Tokens
  async updateTokens(userId, tokens) {
    try {
      const walletRef = doc(db, "wallets", userId);
      await updateDoc(walletRef, {
        tokens,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating tokens:", error);
      throw error;
    }
  },
};
