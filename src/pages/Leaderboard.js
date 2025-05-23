import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useUserAuth } from "../context/UserAuthContext";
import { BiLike, BiHeart, BiRepeat, BiComment } from "react-icons/bi";
import { FaCrown } from "react-icons/fa";
import getAvatarUrl from "../utils/getDefaultAvatarUrl";
import PageSpinner from "../Components/Spinner";
import Sidebar from "../Components/sidebar";
import Header from "../Components/Header";

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
    const colors = {
      1: "text-yellow-500",
      2: "text-gray-400",
      3: "text-amber-700",
    };

    return (
      <>
        <Header />
        <Sidebar />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: position * 0.2 }}
          whileHover={{ scale: 1.05 }}
          className={`bg-box3 rounded-xl sm:p-6 p-3 w-full sm:h-52 h-48 relative overflow-hidden flex flex-col items-center justify-end`}
        >
          {/* Crown for position 1 */}
          {position === 1 && (
            <FaCrown className="absolute -top-5 text-yellow-500 text-4xl" />
          )}

          <img
            src={getAvatarUrl(user.username, 100)}
            alt={user.username}
            className="w-16 h-16 rounded-full object-cover border-4 border-accent"
          />

          <h3 className="text-lg font-semibold text-primary">
            {user.username}
          </h3>
          <p className="text-accent font-bold">
            {user.balance.toLocaleString()} coins
          </p>

          {/* Position Number */}
          <div
            className={`absolute top-2 right-2 text-3xl font-bold ${colors[position]}`}
          >
            {position}
          </div>
        </motion.div>
      </>
    );
  };

  if (loading) {
    return <PageSpinner />;
  }

  return (
    <div className="min-h-screen  bg-lightgray p-4 sm:p-6 md:p-8">
      <div className="xl:max-w-7xl max-w-4xl mx-auto md:ml-80  pt-20 ">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-primary mb-8"
        >
          Leaderboard
        </motion.h1>

        {/* Current User Status */}
        <h2 className="text-xl font-semibold text-primary mb-4">My Position</h2>
        {userDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-box2 p-6 rounded-xl mb-8"
          >
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 items-start  sm:grid-cols-2 md:grid-cols-5 gap-4 text-center place-items-start md:place-items-normal">
                <p className="text-secondary flex flex-col">
                  Current Rank:
                  <span className="text-white font-bold text-left md:text-center">
                    #{userRank}
                  </span>
                </p>
                <p className="text-secondary text-start md:text-center flex flex-col">
                  Balance:
                  <span className="text-white font-bold text-left md:text-center">
                    {userDetails.balance?.toLocaleString() || 0} coins
                  </span>
                </p>
                <p className="text-secondary flex flex-col">
                  Total Airdrops Earned:
                  <span className="text-white font-bold text-left md:text-center">
                    {userDetails.totalAirdrops?.toLocaleString() || 0} USD
                  </span>
                </p>
                <div className="flex flex-row h-full md:flex-col justify-between w-full  items-center">
                  <div className="flex flex-col justify-start">
                    <p className="text-secondary text-start md:text-center">
                      Unclaimed Points:
                    </p>
                    <span className="text-white font-bold text-start md:text-center">
                      {userDetails.unclaimedPoints?.toLocaleString() || 0} PTS
                    </span>
                  </div>
                  <button className="w-20 h-10 md:mx-0 mx-4 text-white bg-red-600 rounded-xl mt-2">
                    Claim
                  </button>
                </div>
                <div className="flex flex-row md:flex-col justify-between w-full items-center">
                  <div className="flex flex-col justify-start">
                    <p className="text-secondary  text-start md:text-center">
                      Unclaimed Airdrops:
                    </p>
                    <span className="text-white font-bold text-left md:text-center">
                      {userDetails.unclaimedAirdrops?.toLocaleString() || 0} USD
                    </span>
                  </div>
                  <button className="w-20 h-10 md:mx-0 mx-4   text-white bg-red-600 rounded-xl mt-2">
                    Claim
                  </button>
                </div>
              </div>

              {userRank > 3 && (
                <div className="text-center md:text-right">
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

            <div className="border-t py-5 text-white border-[#686868] mt-4">
              <ul className="flex flex-wrap justify-between sm:justify-evenly gap-4 text-center text-sm">
                <li className="flex items-center gap-2">
                  <BiHeart /> 0 Views
                </li>
                <li className="flex items-center gap-2">
                  <BiLike /> 0 Likes
                </li>
                <li className="flex items-center gap-2">
                  <BiRepeat /> 0 Reposts
                </li>
                <li className="flex items-center gap-2">
                  <BiComment /> 0 Replies
                </li>
              </ul>
            </div>
          </motion.div>
        )}

        {/* Top 3 Users */}

        <h2 className="text-white text-xl font-semibold mb-4">Top 10</h2>
        <div className="p-6 rounded-xl bg-box2">
          {/* Top 3 Users Podium */}
          <div className="relative flex items-end justify-center md:px-32 gap-1 sm:gap-6 pt-16">
            {users.slice(0, 3).map((user, index) => {
              const position = index === 0 ? 2 : index === 1 ? 1 : 3;
              const heightClass =
                position === 1
                  ? "h-[220px]"
                  : position === 2
                  ? "h-[180px]"
                  : "h-[160px]";
              const baseHeight = "h-[60px]"; // Ensures all bases align

              return (
                <div
                  key={user.id}
                  className={`relative flex flex-col items-center  justify-end ${heightClass}  w-1/3 `}
                  style={{
                    zIndex: position === 1 ? 2 : 1,
                    order: position === 2 ? 0 : position === 1 ? 1 : 2,
                  }}
                >
                  <TopThreeCard user={user} position={position} />
                </div>
              );
            })}
          </div>

          {/* Other Users List */}
          <motion.div className="rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody className="flex flex-col md:px-32 space-y-3 py-4">
                  {users.slice(3).map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`hover:bg-gray-700 border flex flex-row justify-between items-center rounded-md  border-newborder2 transition-colors ${
                        user.id === userDetails?.uid
                          ? "bg-red-500 bg-opacity-10"
                          : ""
                      }`}
                    >
                      <div className="py-2 sm:py-4 flex items-center justify-center">
                        <td className="px-4 sm:px-6 py-2 sm:py-4 text-sm text-white text-center">
                          {index + 4}
                        </td>
                        <td className="px-4 sm:px-6 py-2 sm:py-4">
                          <div className="flex items-center">
                            <img
                              className="h-6 w-6 sm:h-8 object-cover sm:w-8 rounded-full"
                              src={getAvatarUrl(user.username, 80)}
                              alt={user.username || "User"}
                            />
                            <span className="ml-2 text-white text-xs sm:text-sm">
                              {user.username || "Anonymous"}
                            </span>
                          </div>
                        </td>
                      </div>

                      <td className="px-6 py-4 text-sm text-white font-semibold">
                        {user.balance.toLocaleString()} PTS
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
