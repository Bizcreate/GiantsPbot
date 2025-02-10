import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUserAuth } from "../context/UserAuthContext";
import toast from "react-hot-toast";
import {
  FiShare2,
  FiCopy,
  FiGift,
  FiLink,
  FiUserPlus,
  FiMenu,
} from "react-icons/fi";
import Sidebar from "../Components/sidebar";
import Header from "../Components/Header";
import { BsPeople } from "react-icons/bs";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const Ref = () => {
  const { user } = useUserAuth();
  const [copying, setCopying] = useState(false);
  const [referralData, setReferralData] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchReferralData = async () => {
      if (!user?.uid) return;

      try {
        const docRef = doc(collection(db, "referrals"), user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setReferralData({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching referral data:", error);
        toast.error("Failed to load referral data");
      }
    };
    fetchReferralData();
  }, [user]);

  const referralLink = `${window.location.origin}/signup?ref=${user?.uid}`;

  const copyToClipboard = async () => {
    try {
      setCopying(true);
      await navigator.clipboard.writeText(referralLink);
      toast.success("Referral link copied!");
    } catch (error) {
      toast.error("Failed to copy link");
    } finally {
      setCopying(false);
    }
  };

  const steps = [
    {
      icon: <FiLink className="text-[#FF4D4F] text-xl" />,
      title: "Step 1",
      description: "Share your unique referral link with friends",
    },
    {
      icon: <FiUserPlus className="text-[#FF4D4F] text-xl" />,
      title: "Step 2",
      description: "Friends sign up using your referral link",
    },
    {
      icon: <FiGift className="text-[#FF4D4F] text-xl" />,
      title: "Step 3",
      description: "Both of you receive 5000 coins instantly",
    },
  ];

  return (
    <div className="flex h-screen pt-20 bg-lightgray overflow-hidden">
      {/* Sidebar for larger screens */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
          <div className="w-64 h-full bg-lightgray">
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col w-full">
        <div className="flex items-center md:hidden">
          <Header />
        </div>

        {/* Regular header for larger screens */}
        <div className="hidden md:block">
          <Header />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 max-w-4xl xl:max-w-7xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6"
            >
              Referral Program
            </motion.h1>

            {/* Referral Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
              {/* Stats Card */}
              <div className="bg-box2 p-4 md:p-6 rounded-xl flex flex-col">
                <h2 className="text-white text-lg font-medium mb-4">
                  My Referral Stats
                </h2>
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <BsPeople className="text-[#FF4D4F] text-2xl md:text-3xl" />
                    <div>
                      <p className="text-gray-400 text-sm">Total Referrals</p>
                      <p className="text-white text-xl md:text-2xl font-bold">
                        {referralData?.totalReferrals || 4}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiGift className="text-[#FF4D4F] text-2xl md:text-3xl" />
                    <div>
                      <p className="text-gray-400 text-sm">Total Earnings</p>
                      <p className="text-white text-xl md:text-2xl font-bold">
                        {referralData?.totalEarnings || 0} points
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Referral Link Card */}
              <div className="bg-box2 p-4 md:p-6 rounded-xl">
                <h2 className="text-white text-lg font-medium mb-4">
                  Share Referral Link
                </h2>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="w-full bg-[#1E1F22] text-gray-300 px-4 py-3 rounded-lg focus:outline-none text-sm md:text-base"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="w-full sm:w-auto px-5 py-3 bg-[#FF4D4F] text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-opacity-90"
                  >
                    <FiCopy /> {copying ? "Copying..." : "Copy"}
                  </button>
                </div>
              </div>

              {/* Rewards Card */}
              <div className="bg-box2 p-4 md:p-6 rounded-xl">
                <h2 className="text-white text-lg font-medium mb-4">Rewards</h2>
                <p className="text-gray-400 text-sm mb-2">
                  For every friend you invite:
                </p>
                <ul className="text-white text-sm space-y-1">
                  <li>
                    • You receive{" "}
                    <span className="text-[#FF4D4F] font-bold">
                      5,000 coins
                    </span>
                  </li>
                  <li>
                    • Your friend receives{" "}
                    <span className="text-[#FF4D4F] font-bold">
                      5,000 coins
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* How It Works Section */}
            <div className="border border-newborder rounded-lg p-4 md:p-6">
              <h2 className="text-white text-lg font-medium mb-4 md:mb-6">
                How It Works
              </h2>

              <div className="relative flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-0">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="relative flex flex-col items-center z-10 w-full sm:w-auto"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#FF4D4F]/10 flex items-center justify-center mb-3">
                      {step.icon}
                    </div>
                    <p className="text-white text-sm font-medium mb-1">
                      {step.title}
                    </p>
                    <p className="text-gray-400 text-sm text-center max-w-[150px]">
                      {step.description}
                    </p>
                  </div>
                ))}

                {/* Connection lines - visible only on larger screens */}
                <div className="hidden sm:block absolute top-5 left-0 w-full h-[2px] bg-[#FF4D4F]/20 -z-0">
                  <div className="absolute top-0 left-[16.66%] right-[16.66%] h-full bg-[#FF4D4F]" />
                </div>
              </div>
            </div>

            {/* Activities Section */}
            <div className="border border-newborder p-4 md:p-6 rounded-xl my-4 md:my-6">
              <h2 className="text-white text-lg font-medium mb-4">
                Activities
              </h2>
              <p className="text-gray-400 text-sm mb-2">
                Collected referral points:
              </p>
              <div className="text-white text-sm space-y-2 overflow-x-auto">
                <p className="whitespace-nowrap">
                  2025-01-05 09:23:12 - Wallet:{" "}
                  <span className="text-[#FF4D4F]">ayg7f390fu3fu6</span> -
                  Points: <span className="text-[#FF4D4F]">5,000</span>
                </p>
                <p className="whitespace-nowrap">
                  2025-01-05 09:23:12 - Wallet:{" "}
                  <span className="text-[#FF4D4F]">ayg7f390fu3fu6</span> -
                  Points: <span className="text-[#FF4D4F]">5,000</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ref;
