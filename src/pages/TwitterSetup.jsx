import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiTwitter, FiArrowRight, FiCheck } from "react-icons/fi";
import { useUserAuth } from "../context/UserAuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const TwitterSetup = ({ returnPath = "/" }) => {
  const [twitterHandle, setTwitterHandle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { updateUserProfile } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Remove @ if user included it
    const cleanHandle = twitterHandle.replace("@", "");

    if (!cleanHandle) {
      toast.error("Please enter a valid Twitter handle");
      setIsLoading(false);
      return;
    }

    try {
      await updateUserProfile("twitterHandle", cleanHandle);
      toast.success("Twitter handle updated successfully!");
      navigate(returnPath);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#15202B] flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="max-w-md w-full bg-[#192734] rounded-xl p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="flex justify-center mb-6"
          >
            <FiTwitter className="text-[#1DA1F2] text-5xl" />
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-white mb-2"
          >
            Connect Your Twitter
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400"
          >
            Link your Twitter account to start completing tasks
          </motion.p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">@</span>
            </div>
            <input
              type="text"
              value={twitterHandle}
              onChange={(e) => setTwitterHandle(e.target.value)}
              placeholder="username"
              className="w-full pl-8 pr-4 py-3 bg-[#253341] text-white rounded-lg 
                         border border-[#38444D] focus:border-[#1DA1F2] focus:ring-1 
                         focus:ring-[#1DA1F2] transition-all duration-200
                         placeholder-gray-500"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-medium flex items-center 
                       justify-center space-x-2 transition-all duration-200
                       ${
                         isLoading
                           ? "bg-[#1A91DA] cursor-not-allowed"
                           : "bg-[#1DA1F2] hover:bg-[#1A91DA]"
                       } text-white`}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <>
                <span>Continue</span>
                <FiArrowRight className="text-lg" />
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Features List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 space-y-4"
        >
          <h3 className="text-white text-sm font-semibold mb-3">
            What you can do:
          </h3>
          {[
            "Complete Twitter engagement tasks",
            "Earn rewards for your social activity",
            "Track your progress and earnings",
            "Compete on the leaderboard",
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex items-center space-x-3 text-gray-400"
            >
              <FiCheck className="text-[#1DA1F2]" />
              <span>{feature}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Skip Option */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-center"
        >
          <button
            onClick={() => navigate(returnPath)}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            Skip for now
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default TwitterSetup;
