import React, { useState } from "react";
import { motion } from "framer-motion";
import { useUserAuth } from "../context/UserAuthContext";
import toast from "react-hot-toast";
import { FiShare2, FiCopy, FiGift } from "react-icons/fi";

const Ref = () => {
  const { user, userDetails } = useUserAuth();
  const [copying, setCopying] = useState(false);

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

  return (
    <div className="min-h-screen bg-cards p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-Cerebri font-bold text-primary mb-8"
        >
          Referral Program
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Referral Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-cards3 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-accent bg-opacity-20 rounded-lg">
                <FiShare2 className="text-accent text-xl" />
              </div>
              <h2 className="text-xl font-semibold text-primary">
                Your Referral Link
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 bg-cards2 text-secondary px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={copyToClipboard}
                  className={`px-6 py-3 bg-accent text-white rounded-lg font-medium 
                    flex items-center gap-2 transition-colors hover:bg-opacity-90 
                    ${copying ? "opacity-75" : ""}`}
                >
                  <FiCopy className="text-lg" />
                  {copying ? "Copying..." : "Copy"}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Rewards Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-cards3 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-accent bg-opacity-20 rounded-lg">
                <FiGift className="text-accent text-xl" />
              </div>
              <h2 className="text-xl font-semibold text-primary">Rewards</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-cards2 p-4 rounded-lg">
                <p className="text-cardtext leading-relaxed">
                  For every friend you invite:
                </p>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-center gap-2 text-cardtext">
                    <span className="text-accent">•</span>
                    You receive{" "}
                    <span className="text-accent font-semibold">
                      5,000 coins
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-cardtext">
                    <span className="text-accent">•</span>
                    Your friend receives{" "}
                    <span className="text-accent font-semibold">
                      5,000 coins
                    </span>
                  </li>
                </ul>
              </div>

              <p className="text-dimtext text-sm">
                Share your referral link with friends to start earning rewards.
                Rewards are credited when your friend signs up and completes
                verification.
              </p>
            </div>
          </motion.div>
        </div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-cards3 rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold text-primary mb-4">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                text: "Share your unique referral link with friends",
              },
              { step: "2", text: "Friends sign up using your referral link" },
              { step: "3", text: "Both of you receive 5,000 coins instantly" },
            ].map((item) => (
              <div key={item.step} className="bg-cards2 p-4 rounded-lg">
                <div className="text-accent font-bold mb-2">
                  Step {item.step}
                </div>
                <p className="text-cardtext">{item.text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Ref;
