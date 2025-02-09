import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useUserAuth } from "../context/UserAuthContext";
import { RANKS, getRank } from "../constants/ranks";
import { FaCrown, FaMedal } from "react-icons/fa";
import { IoTrophyOutline } from "react-icons/io5";
import PageSpinner from "../Components/Spinner";
import Sidebar from "../Components/sidebar";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userDetails } = useUserAuth();
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const q = query(
        collection(db, "users"),
        orderBy("balance", "desc"),
        limit(50)
      );

      const querySnapshot = await getDocs(q);
      const usersData = querySnapshot.docs.map((doc, index) => ({
        ...doc.data(),
        id: doc.id,
        position: index + 1,
      }));

      setUsers(usersData);

      // Find current user's rank
      const userPosition = usersData.findIndex(
        (u) => u.id === userDetails?.uid
      );
      setUserRank(userPosition + 1);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const TopThreeCard = ({ user, position }) => {
    const icons = {
      1: { Icon: FaCrown, color: "text-yellow-500" },
      2: { Icon: FaMedal, color: "text-gray-400" },
      3: { Icon: IoTrophyOutline, color: "text-amber-700" },
    };
    const { Icon, color } = icons[position];

    return (
      <>
        <Sidebar />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: position * 0.2 }}
          whileHover={{ scale: 1.05 }}
          className={`bg-cards3 rounded-xl p-6 relative overflow-hidden ${
            position === 1 ? "border-2 border-yellow-500" : ""
          }`}
        >
          <div className="absolute top-2 right-2">
            <Icon className={`text-3xl ${color}`} />
          </div>
          <div className="flex flex-col items-center gap-3">
            <img
              src={user.avatarUrl || "https://via.placeholder.com/100"}
              alt={user.username}
              className="w-20 h-20 rounded-full object-cover border-4 border-accent"
            />
            <div className="text-center">
              <h3 className="text-xl font-semibold text-primary">
                {user.username}
              </h3>
              <p className="text-accent font-bold">
                {user.balance.toLocaleString()} coins
              </p>
              <p className="text-secondary text-sm">
                {getRank(user.balance).name}
              </p>
            </div>
          </div>
        </motion.div>
      </>
    );
  };

  if (loading) {
    return <PageSpinner />;
  }

  return (
    <div className="min-h-screen bg-cards p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-primary mb-8 text-center"
        >
          Leaderboard
        </motion.h1>

        {/* Top 3 Users */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {users.slice(0, 3).map((user, index) => (
            <TopThreeCard key={user.id} user={user} position={index + 1} />
          ))}
        </div>

        {/* Current User Status */}
        {userDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-cards3 p-6 rounded-xl mb-8"
          >
            <h2 className="text-xl font-semibold text-primary mb-4">
              Your Position
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary">
                  Current Rank: <span className="text-accent">#{userRank}</span>
                </p>
                <p className="text-secondary">
                  Balance:{" "}
                  <span className="text-accent">
                    {userDetails.balance?.toLocaleString() || 0} coins
                  </span>
                </p>
              </div>
              {userRank > 3 && (
                <div className="text-right">
                  <p className="text-secondary">To reach top 3:</p>
                  <p className="text-accent font-semibold">
                    {(
                      users[2]?.balance - (userDetails.balance || 0)
                    ).toLocaleString()}{" "}
                    coins needed
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Other Users List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-cards3 rounded-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cards2">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cards2">
                {users.slice(3).map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`hover:bg-cards2 transition-colors ${
                      user.id === userDetails?.uid
                        ? "bg-accent bg-opacity-10"
                        : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                      #{index + 4}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-8 w-8 rounded-full"
                          src={
                            user.avatarUrl || "https://via.placeholder.com/32"
                          }
                          alt=""
                        />
                        <span className="ml-2 text-primary">
                          {user.username}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                      {getRank(user.balance).name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-accent font-semibold">
                      {user.balance.toLocaleString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;
