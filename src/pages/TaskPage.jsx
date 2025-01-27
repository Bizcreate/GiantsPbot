import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { useUserAuth } from "../context/UserAuthContext";
import { db } from "../firebase/config";
import { verifyTwitterAction } from "../services/twitterService";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiTwitter, FiExternalLink } from "react-icons/fi";
import {
  RiCoinsLine,
  RiCheckboxCircleLine,
  RiLoader4Line,
} from "react-icons/ri";
import TwitterSetup from "./TwitterSetup";

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const { user, userDetails } = useUserAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const tasksCollection = collection(db, "tasks");
      const taskSnapshot = await getDocs(tasksCollection);
      const taskList = taskSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(taskList);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
    }
  };

  const extractTweetId = (tweetUrl) => {
    try {
      const url = new URL(tweetUrl);
      const pathParts = url.pathname.split("/");
      return pathParts[pathParts.length - 1];
    } catch (error) {
      console.error("Invalid Tweet URL:", error);
      return null;
    }
  };

  const handleSubmitTask = async (task) => {
    if (!userDetails?.twitterHandle) {
      toast.error("Please add your Twitter handle in your profile settings!");
      return;
    }

    setLoading(true);
    try {
      const tweetId = extractTweetId(task.tweetLink);
      if (!tweetId) {
        throw new Error("Invalid tweet URL");
      }

      // Check if user has already completed this task
      const submissionsRef = collection(db, "submissions");
      const existingSubmissions = await getDocs(
        query(
          submissionsRef,
          where("taskId", "==", task.id),
          where("userId", "==", user.uid)
        )
      );

      if (!existingSubmissions.empty) {
        toast.error("You have already completed this task!");
        return;
      }

      // toast.loading(`Verifying your ${task.type} action...`);

      // Verify using the stored Twitter handle
      const isVerified = await verifyTwitterAction(
        tweetId,
        userDetails.twitterHandle,
        task.type
      );

      if (isVerified) {
        // Add submission to database
        await addDoc(collection(db, "submissions"), {
          taskId: task.id,
          userId: user.uid,
          userEmail: user.email,
          twitterHandle: userDetails.twitterHandle,
          tweetLink: task.tweetLink,
          verifiedAt: new Date(),
          status: "verified",
          type: task.type,
          reward: task.reward,
        });

        // Update user's points
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          balance: (userDetails.balance || 0) + task.reward,
        });

        toast.success(`Task verified! You earned ${task.reward} points!`);

        // Refresh tasks
        fetchTasks();
      } else {
        toast.error(
          `Could not verify ${task.type}. Make sure you've completed the action with your linked Twitter account (@${userDetails.twitterHandle})`
        );
      }
    } catch (error) {
      console.error("Error processing task:", error);
      toast.error(error.message || "Failed to process task");
    } finally {
      setLoading(false);
    }
  };

  // Twitter handle warning UI
  if (!userDetails?.twitterHandle) {
    return <TwitterSetup returnPath="/app/tasks" />;
  }

  return (
    <div className="min-h-screen bg-cards p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-Syne font-bold mb-6 text-primary"
        >
          Available Tasks
        </motion.h1>

        {/* Twitter handle info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-cards3 p-5 rounded-xl mb-8 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center space-x-3">
            <FiTwitter className="w-5 h-5 text-accent" />
            <p className="text-cardtext font-PublicSans">
              Connected as{" "}
              <span className="font-semibold text-accent">
                @{userDetails.twitterHandle}
              </span>
            </p>
          </div>
        </motion.div>

        <div className="grid gap-6">
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-cards3 border border-borders2 p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:translate-y-[-2px] transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-Syne font-semibold text-primary">
                  {task.title}
                </h2>
                <span className="px-3 py-1 bg-cards rounded-full text-sm font-medium text-accent">
                  {task.type}
                </span>
              </div>

              <p className="text-dimtext font-PublicSans mb-4">
                {task.description}
              </p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <RiCoinsLine className="w-5 h-5 text-accent" />
                  <span className="text-accent font-semibold">
                    {task.reward} points
                  </span>
                </div>

                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={task.tweetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent2 transition-colors duration-200 flex items-center space-x-1"
                >
                  <span>View Tweet</span>
                  <FiExternalLink className="w-4 h-4" />
                </motion.a>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSubmitTask(task)}
                disabled={loading}
                className={`w-full bg-accent text-white px-6 py-3 rounded-lg font-medium
                  flex items-center justify-center space-x-2
                  transform transition-all duration-200
                  ${
                    loading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-accent/90 hover:shadow-md"
                  }
                `}
              >
                {loading ? (
                  <>
                    <RiLoader4Line className="animate-spin h-5 w-5" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <RiCheckboxCircleLine className="h-5 w-5" />
                    <span>Submit Task</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
