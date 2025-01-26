import React, { useState, useEffect } from "react";
import { db } from "../firebase/firestore";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";

import { motion } from "framer-motion";
import { FiSearch, FiLoader } from "react-icons/fi";
import toast from "react-hot-toast";
import UserCard from "./UserCard";

const UserManagementPanel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [users, setUsers] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setSearchResults(null);
      return;
    }

    setSearchLoading(true);

    try {
      const usersRef = collection(db, "users");
      const searchTermLower = searchTerm.toLowerCase();
      const q = query(
        usersRef,
        where("fullName", ">=", searchTermLower),
        where("fullName", "<=", searchTermLower + "\uf8ff"),
        limit(10)
      );

      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching users:", error);
      toast.error("Error searching users");
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults(null);
    }
  }, [searchTerm]);

  const fetchUsers = async (loadMore = false) => {
    setLoading(true);
    try {
      const usersRef = collection(db, "users");
      const usersQuery =
        loadMore && lastVisible
          ? query(
              usersRef,
              orderBy("balance", "desc"),
              startAfter(lastVisible),
              limit(50)
            )
          : query(usersRef, orderBy("balance", "desc"), limit(50));

      const userSnapshot = await getDocs(usersQuery);
      const lastVisibleDoc = userSnapshot.docs[userSnapshot.docs.length - 1];
      setLastVisible(lastVisibleDoc);

      const fetchedUsers = userSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUsers(loadMore ? [...users, ...fetchedUsers] : fetchedUsers);
    } catch (error) {
      console.error("Error fetching users: ", error);
      toast.error("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const formatNumber = (num) => {
    if (num < 100000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else if (num < 1000000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else {
      return (num / 1000000).toFixed(3).replace(".", ".") + " M";
    }
  };

  const handleUserUpdate = (updatedUser) => {
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
  };

  return (
    <div className="w-full p-4 md:p-6 space-y-6">
      {/* Search Section */}
      <div className="relative w-full max-w-xl mx-auto">
        <form
          onSubmit={handleSearch}
          className="relative flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users by name..."
              className="w-full bg-[#2b2b2b] text-white placeholder-gray-400 rounded-lg px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-[#f5bb5f]"
            />
            <FiSearch
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-[#f5bb5f] text-black px-6 py-3 rounded-lg font-medium flex items-center gap-2 min-w-[120px] justify-center"
            disabled={searchLoading}
          >
            {searchLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <FiLoader size={18} />
                </motion.div>
                <span>Searching</span>
              </>
            ) : (
              <>
                <FiSearch size={18} />
                <span>Search</span>
              </>
            )}
          </motion.button>
        </form>
      </div>

      {/* Results Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {searchLoading ? (
          <div className="col-span-full text-center py-8 text-gray-400">
            Searching...
          </div>
        ) : searchResults ? (
          searchResults.length > 0 ? (
            searchResults.map((user) => (
              <UserCard key={user.id} user={user} onUpdate={handleUserUpdate} />
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-400">
              No users found
            </div>
          )
        ) : (
          users.map((user) => (
            <UserCard key={user.id} user={user} onUpdate={handleUserUpdate} />
          ))
        )}
      </div>

      {/* Load More Button */}
      {!searchResults && (
        <motion.div
          className="flex justify-center mt-6"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <button
            onClick={() => fetchUsers(true)}
            disabled={loading}
            className="bg-[#f5bb5f] font-semibold text-[15px] rounded-[6px] px-6 py-3 text-[#000]"
          >
            {loading ? "Loading..." : "Load More Users"}
          </button>
        </motion.div>
      )}
    </div>
  );
};

// Add this CSS to your styles
const styles = `
  .highlight-card {
    @apply ring-2 ring-[#f5bb5f] ring-opacity-50;
    animation: highlight 2s ease-out;
  }

  @keyframes highlight {
    0% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(245, 187, 95, 0.7);
    }
    70% {
      transform: scale(1.02);
      box-shadow: 0 0 0 10px rgba(245, 187, 95, 0);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(245, 187, 95, 0);
    }
  }
`;

export default UserManagementPanel;
