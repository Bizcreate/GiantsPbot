import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiEdit2, FiCheck, FiX, FiCamera, FiLogOut } from "react-icons/fi";
import { RiWalletLine, RiTaskLine, RiBarChartLine } from "react-icons/ri";
import { useUserAuth } from "../../context/UserAuthContext";
import Sidebar from "../../Components/sidebar";
import Header from "../../Components/Header";
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { validateFile } from "../../utils/fileUpload";
import { RANKS, getRank } from "../../constants/ranks";
import { LoadingSpinner } from "../../Components/LoadingSpinner";
import getAvatarUrl from "../../utils/getDefaultAvatarUrl";

const UserDashboard = () => {
  const { user, userDetails, updateUserProfile, setUserDetails, logOut } =
    useUserAuth();
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  const ProfileModalContent = () => (
    <div className="flex flex-col bg-newborder3 justify-center items-center">
      <h3 className="text-lg font-semibold text-primary mb-4">
        Profile Picture
      </h3>
      <div className="p-5 rounded-3xl bg-[#1F1F1F]">
        <img
          src={getAvatarUrl(userDetails?.username)}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-accent shadow-lg"
        />
      </div>
      <div className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
          id="fileUpload"
        />
        <label
          htmlFor="fileUpload"
          className="px-4 py-2 border border-gray-400 rounded-md text-white transition cursor-pointer inline-block"
        >
          Change Photo
        </label>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => setIsEditingPicture(false)}
          className="px-4 py-2 text-secondary hover:text-primary transition-colors"
          disabled={updateLoading}
        >
          Cancel
        </button>
      </div>
    </div>
  );

  const [editing, setEditing] = useState({
    fullName: false,
    username: false,
    wallet: false,
    twitterHandle: false,
  });

  const [tempData, setTempData] = useState({
    fullName: userDetails?.fullName || "",
    username: userDetails?.username || "",
    wallet: userDetails?.walletAddress || "",
    twitterHandle: userDetails?.twitterHandle || "",
    profilePicture:
      userDetails?.profilePicture || "https://via.placeholder.com/150",
  });

  const [isEditingPicture, setIsEditingPicture] = useState(false);

  useEffect(() => {
    setTempData({
      fullName: userDetails?.fullName || "",
      username: userDetails?.username || "",
      wallet: userDetails?.walletAddress || "",
      twitterHandle: userDetails?.twitterHandle || "",
      profilePicture:
        userDetails?.profilePicture || "https://via.placeholder.com/150",
    });
  }, [userDetails]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setIsLoadingStats(true);
        const submissionsRef = collection(db, "submissions");
        const q = query(
          submissionsRef,
          where("userId", "==", user?.uid),
          where("status", "==", "verified")
        );

        const querySnapshot = await getDocs(q);
        const submissionsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSubmissions(submissionsData);
      } catch (error) {
        console.error("Error fetching submissions:", error);
        toast.error("Failed to load statistics");
      } finally {
        setIsLoadingStats(false);
      }
    };

    if (user?.uid) {
      fetchSubmissions();
    }
  }, [user?.uid]);

  const handleEdit = (field) => {
    setEditing({ ...editing, [field]: true });
    setTempData({
      fullName: userDetails?.fullName || "",
      username: userDetails?.username || "",
      wallet: userDetails?.walletAddress || "",
      twitterHandle: userDetails?.twitterHandle || "",
      profilePicture:
        userDetails?.profilePicture || "https://via.placeholder.com/150",
    });
    toast.dismiss();
  };

  const handleSave = async (field) => {
    try {
      setError("");
      setUpdateLoading(true);

      if (field === "username" && !tempData.username) {
        throw new Error("Username cannot be empty");
      }

      await updateUserProfile(field, tempData[field]);
      setEditing({ ...editing, [field]: false });
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.message);
      toast.error(error.message);

      // Reset the field to original value on error
      setTempData((prev) => ({
        ...prev,
        [field]: userDetails?.[field] || "",
      }));
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancel = (field) => {
    setEditing({ ...editing, [field]: false });
    setTempData({
      fullName: userDetails?.fullName || "",
      username: userDetails?.username || "",
      wallet: userDetails?.walletAddress || "",
      twitterHandle: userDetails?.twitterHandle || "",
      profilePicture:
        userDetails?.profilePicture || "https://via.placeholder.com/150",
    });
    setError("");
    toast.dismiss();
  };

  const handleProfilePictureUpdate = async (e) => {
    try {
      setUpdateLoading(true);
      const userRef = doc(db, "users", user.uid);

      await updateDoc(userRef, {
        profilePicture: tempData.profilePicture,
      });

      // Update local state
      setUserDetails((prev) => ({
        ...prev,
        profilePicture: tempData.profilePicture,
      }));

      setIsEditingPicture(false);
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error updating profile picture:", error);
      toast.error("Failed to update profile picture");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/signin");
    } catch (error) {
      console.log(error);
      toast.error("Failed to logout");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    try {
      setUpdateLoading(true);
      console.log(file);
      await updateUserProfile("avatar", file);
      setIsEditingPicture(false);
    } catch (error) {
      console.error("Error updating profile picture:", error);
      toast.error("Failed to update profile picture");
    } finally {
      setUpdateLoading(false);
    }
  };

  const getCurrentRankInfo = () => {
    const currentCoins = userDetails?.balance || 0;
    const currentRank = getRank(currentCoins);

    // Find next rank
    const currentRankIndex = RANKS.findIndex(
      (rank) => rank.name === currentRank.name
    );
    const nextRank = RANKS[currentRankIndex + 1];

    // Calculate progress
    let progress = 0;
    let coinsToNextRank = 0;

    if (nextRank) {
      const rangeSize = nextRank.minCoins - currentRank.minCoins;
      const progressInRange = currentCoins - currentRank.minCoins;
      progress = (progressInRange / rangeSize) * 100;
      coinsToNextRank = nextRank.minCoins - currentCoins;
    } else {
      progress = 100; // Max level reached
    }

    return {
      currentRank,
      nextRank,
      progress: Math.min(Math.max(progress, 0), 100), // Clamp between 0 and 100
      coinsToNextRank,
    };
  };

  const statsCards = [
    {
      icon: RiTaskLine,
      title: "Tasks Completed",
      value: isLoadingStats ? (
        <LoadingSpinner size="sm" />
      ) : (
        submissions.filter((sub) => sub.status === "verified").length
      ),
    },
    {
      icon: RiBarChartLine,
      title: "Current Rank",
      value: getCurrentRankInfo().currentRank.name,
    },
    {
      icon: RiWalletLine,
      title: "Total Earnings",
      value: isLoadingStats ? (
        <LoadingSpinner size="sm" />
      ) : (
        `${submissions.reduce((total, sub) => {
          return sub.status === "verified" ? total + (sub.reward || 0) : total;
        }, 0)} `
      ),
    },
  ];

  return (
    <div className="min-h-screen  bg-lightgray p-4 sm:p-6 md:p-8">
      <Sidebar />
      <Header />
      <div className="max-w-4xl xl:max-w-7xl md:ml-80  pt-20  mx-auto">
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:text-3xl sm:text-2xl text-xl font-Cerebri font-bold text-primary"
          >
            My Dashboard
          </motion.h1>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="px-3 py-2 sm:px-4 sm:py-2 md:px-5 md:py-3 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base md:text-lg"
          >
            <FiLogOut className="text-lg" />
            <span>Logout</span>
          </motion.button>
        </div>

        {/* Profile Picture Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex p-5 rounded-xl bg-cards2 mb-8"
        >
          <div className="w-full">
            <div className="flex flex-row">
              <div className="relative w-36 md:w-40 group">
                <div className="relative inline-block group">
                  <img
                    src={getAvatarUrl(userDetails?.username)}
                    alt="Profile"
                    className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full object-cover border-2 sm:border-4 border-accent shadow-lg"
                  />
                  <button
                    onClick={() => setIsEditingPicture(true)}
                    className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 md:top-2 md:right-2 bg-accent text-white p-1 sm:p-2 md:p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <FiCamera className="text-sm sm:text-base md:text-lg" />
                  </button>
                </div>
              </div>

              <div className="px-6">
                {" "}
                <h2 className="text-xl font-semibold text-primary mt-4">
                  {userDetails?.fullName || "Your Name"}
                </h2>
                <p className="text-secondary">
                  @{userDetails?.username || "username"}
                </p>
              </div>
            </div>
            {/* Stats Grid */}
            <div>
              <div className="grid grid-cols-2 pt-5 sm:pt-0 place-items-center sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
                {statsCards.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="px-6 sm:py-6 py-2 rounded-xl "
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 hidden sm:block bg-accent bg-opacity-20 rounded-lg">
                        <stat.icon className="text-accent text-xl" />
                      </div>
                      <div>
                        <h3 className="text-secondary text-sm">{stat.title}</h3>
                        <p className="text-primary text-2xl font-semibold">
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            {/* Profile Picture Edit Modal */}
            {isEditingPicture && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              >
                {/* Desktop View (md and larger) */}
                <div className="hidden md:flex justify-center bg-cards3 w-72 p-6 rounded-xl shadow-xl max-w-md mx-4">
                  <ProfileModalContent />
                </div>

                {/* Mobile View (less than md) - Slide up from bottom */}
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  className="md:hidden fixed bottom-0 left-0 right-0 bg-cards3 p-6 rounded-t-2xl shadow-xl w-full max-w-md mx-auto"
                >
                  <ProfileModalContent />
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-cards2 rounded-xl p-6 mb-8 shadow-lg"
        >
          <h2 className="text-xl font-semibold text-primary mb-4">
            Profile Information
          </h2>
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          <div className="space-y-4">
            {[
              { key: "fullName", label: "Name", value: userDetails?.fullName },
              {
                key: "username",
                label: "Username",
                value: userDetails?.username,
                validation: (value) => {
                  if (!value) return "Username is required";
                  if (value.length < 3)
                    return "Username must be at least 3 characters";
                  if (!/^[a-zA-Z0-9_]+$/.test(value))
                    return "Username can only contain letters, numbers, and underscores";
                  return null;
                },
              },
              {
                key: "wallet",
                label: "Wallet",
                value: userDetails?.walletAddress,
              },
              {
                key: "twitterHandle",
                label: "Twitter",
                value: userDetails?.twitterHandle,
              },
            ].map(({ key, label, value }) => (
              <div
                key={key}
                className="flex flex-col sm:flex-row sm:items-center gap-2"
              >
                <span className="text-secondary w-24">{label}:</span>
                <div className="flex-1 flex items-center gap-2">
                  {editing[key] ? (
                    <>
                      <input
                        type="text"
                        value={tempData[key]}
                        onChange={(e) => {
                          setError("");
                          setTempData({ ...tempData, [key]: e.target.value });
                        }}
                        disabled={updateLoading}
                        className={`bg-cards22 text-primary px-3 py-1 rounded-md flex-1 
                          focus:outline-none focus:ring-2 focus:ring-accent 
                          disabled:opacity-50 ${error ? "border-red-500" : ""}`}
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSave(key)}
                        disabled={updateLoading}
                        className="text-green-500 p-1 disabled:opacity-50"
                      >
                        {updateLoading ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <FiCheck />
                        )}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCancel(key)}
                        disabled={updateLoading}
                        className="text-red-500 p-1 disabled:opacity-50"
                      >
                        <FiX />
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <span className="text-primary flex-1">
                        {value || "Not set"}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(key)}
                        className="text-accent hover:text-accent2 p-1"
                      >
                        <FiEdit2 />
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Rank Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-6 mb-8 "
        >
          <h2 className="text-xl font-semibold text-primary mb-4">
            Rank Progress
          </h2>
          <div className="space-y-4">
            {(() => {
              const { currentRank, nextRank, progress, coinsToNextRank } =
                getCurrentRankInfo();

              return (
                <>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-secondary">Current Rank:</span>
                      <span className="ml-2 text-primary font-semibold">
                        {currentRank.name}
                      </span>
                    </div>
                    {nextRank && (
                      <div>
                        <span className="text-secondary">Next Rank:</span>
                        <span className="ml-2 text-primary font-semibold">
                          {nextRank.name}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="relative w-full h-4 bg-cards22 rounded-full bg-cards overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1 }}
                      className="absolute h-full bg-accent rounded-full"
                    />
                  </div>

                  {nextRank ? (
                    <div className="text-center text-secondary">
                      <span className="text-accent font-semibold">
                        {coinsToNextRank.toLocaleString()}
                      </span>
                      {" coins needed for next rank"}
                    </div>
                  ) : (
                    <div className="text-center text-accent font-semibold">
                      Maximum Rank Achieved!
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserDashboard;
