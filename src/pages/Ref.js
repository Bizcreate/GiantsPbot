import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUserAuth } from "../context/UserAuthContext";
import toast from "react-hot-toast";
import { FiShare2, FiCopy, FiGift, FiLink, FiUserPlus } from "react-icons/fi";
import Sidebar from "../Components/sidebar";
import Header from "../Components/Header";
import { BsPeople } from "react-icons/bs";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const Ref = () => {
  const { user } = useUserAuth();
  const [copying, setCopying] = useState(false);
  const [referralData, setReferralData] = useState(null);

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
    <div className="flex h-screen bg-lightgray">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="p-6 max-w-7xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white mb-6"
          >
            Referral Program
          </motion.h1>

          {/* Referral Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-box2 p-6 rounded-xl flex flex-col">
              <h2 className="text-white text-lg font-medium mb-4">
                My Referral Stats
              </h2>
              <div className="flex justify-between">
                <div className="flex items-center gap-3">
                  <BsPeople className="text-[#FF4D4F] text-3xl" />
                  <div>
                    <p className="text-gray-400 text-sm">Total Referrals</p>
                    <p className="text-white text-2xl font-bold">
                      {referralData?.totalReferrals || 4}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiGift className="text-[#FF4D4F] text-3xl" />
                  <div>
                    <p className="text-gray-400 text-sm">Total Earnings</p>
                    <p className="text-white text-2xl font-bold">
                      {referralData?.totalEarnings || 0} points
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Referral Link */}
            <div className="bg-box2 p-6 rounded-xl">
              <h2 className="text-white text-lg font-medium mb-4">
                Share Referral Link
              </h2>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 bg-[#1E1F22] text-gray-300 px-4 py-3 rounded-lg focus:outline-none"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-5 py-3 bg-[#FF4D4F] text-white rounded-lg font-medium flex items-center gap-2 hover:bg-opacity-90"
                >
                  <FiCopy /> {copying ? "Copying..." : "Copy"}
                </button>
              </div>
            </div>

            {/* Rewards */}
            <div className="bg-box2 p-6 rounded-xl">
              <h2 className="text-white text-lg font-medium mb-4">Rewards</h2>
              <p className="text-gray-400 text-sm mb-2">
                For every friend you invite:
              </p>
              <ul className="text-white text-sm space-y-1">
                <li>
                  • You receive{" "}
                  <span className="text-[#FF4D4F] font-bold">5,000 coins</span>
                </li>
                <li>
                  • Your friend receives{" "}
                  <span className="text-[#FF4D4F] font-bold">5,000 coins</span>
                </li>
              </ul>
            </div>
          </div>

          {/* How It Works */}
          <div className="border border-newborder rounded-lg  p-6">
            <h2 className="text-white text-lg font-medium mb-6">
              How It Works
            </h2>

            <div className="relative  flex justify-between items-center">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="relative flex flex-col items-center z-10"
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

              {/* Connection lines */}
              <div className="absolute top-5 left-0 w-full h-[2px] bg-[#FF4D4F]/20 -z-0">
                <div className="absolute top-0 left-[16.66%] right-[16.66%] h-full bg-[#FF4D4F]" />
              </div>
            </div>
          </div>

          <div className="border border-newborder p-6 rounded-xl my-6">
            <h2 className="text-white text-lg font-medium mb-4">Activities</h2>
            <p className="text-gray-400 text-sm mb-2">
              Collected referral points:
            </p>
            <div className="text-white text-sm space-y-2">
              <p>
                2025-01-05 09:23:12 - Wallet:{" "}
                <span className="text-[#FF4D4F]">ayg7f390fu3fu6</span> - Points:{" "}
                <span className="text-[#FF4D4F]">5,000</span>
              </p>
              <p>
                2025-01-05 09:23:12 - Wallet:{" "}
                <span className="text-[#FF4D4F]">ayg7f390fu3fu6</span> - Points:{" "}
                <span className="text-[#FF4D4F]">5,000</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ref;
