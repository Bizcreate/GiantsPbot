import React, { useState, useEffect } from "react";
import Sidebar from "../Components/sidebar";
import Header from "../Components/Header";
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
import OtherTaskCard from "../Components/OtherTaskCard";

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("twitter");
  const { user, userDetails } = useUserAuth();
  const [loading, setLoading] = useState(false);
  const [visitedLinks, setVisitedLinks] = useState(() => {
    // Initialize from localStorage
    const saved = localStorage.getItem("visitedTaskLinks");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    fetchTasks();
  }, [activeTab]);

  const fetchTasks = async () => {
    try {
      const collectionName = activeTab === "twitter" ? "tasks" : "otherTasks";
      const tasksCollection = collection(db, collectionName);
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

  // Track visited links
  const handleLinkClick = (taskId) => {
    const updatedVisitedLinks = { ...visitedLinks, [taskId]: true };
    setVisitedLinks(updatedVisitedLinks);
    localStorage.setItem(
      "visitedTaskLinks",
      JSON.stringify(updatedVisitedLinks)
    );
  };

  const handleSubmitTask = async (task) => {
    if (activeTab === "twitter" && !userDetails?.twitterHandle) {
      toast.error("Please add your Twitter handle in your profile settings!");
      return;
    }

    if (activeTab === "twitter") {
      setLoading(true);
      try {
        const tweetId = extractTweetId(task.tweetLink);
        if (!tweetId) {
          throw new Error("Invalid tweet URL");
        }

        let isVerified = await verifyTwitterAction(
          tweetId,
          userDetails.twitterHandle,
          task.type
        );

        if (isVerified) {
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
            taskType: activeTab,
          });

          const userRef = doc(db, "users", user.uid);
          await updateDoc(userRef, {
            balance: (userDetails.balance || 0) + task.reward,
          });

          toast.success(`Task verified! You earned ${task.reward} points!`);
          fetchTasks();
        } else {
          toast.error(
            `Could not verify ${task.type}. Make sure you've completed the action correctly.`
          );
        }
      } catch (error) {
        console.error("Error processing task:", error);
        toast.error(error.message || "Failed to process task");
      } finally {
        setLoading(false);
      }
    } else {
      // Other tasks verification
      if (!visitedLinks[task.id]) {
        toast.error("Please visit the task link first!");
        return;
      }

      setLoading(true);
      try {
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

        // Add submission
        await addDoc(collection(db, "submissions"), {
          taskId: task.id,
          userId: user.uid,
          userEmail: user.email,
          verifiedAt: new Date(),
          status: "verified",
          type: task.platform || "other",
          reward: task.reward,
          taskType: "other",
        });

        // Update user's points
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          balance: (userDetails.balance || 0) + task.reward,
        });

        // Clear this task from visited links
        const newVisitedLinks = { ...visitedLinks };
        delete newVisitedLinks[task.id];
        setVisitedLinks(newVisitedLinks);
        localStorage.setItem(
          "visitedTaskLinks",
          JSON.stringify(newVisitedLinks)
        );

        toast.success(`Task completed! You earned ${task.reward} points!`);
        fetchTasks();
      } catch (error) {
        console.error("Error processing task:", error);
        toast.error(error.message || "Failed to process task");
      } finally {
        setLoading(false);
      }
    }
  };

  if (activeTab === "twitter" && !userDetails?.twitterHandle) {
    return <TwitterSetup returnPath="/app/tasks" />;
  }

  const renderTasks = () => {
    return tasks.map((task, index) => {
      if (activeTab === "twitter") {
        return (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-cards2 p-6 rounded-xl shadow-lg 
                     hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
              <h2 className="text-xl font-Cerebri font-semibold text-primary">
                {task.title}
              </h2>
              <span className="px-3 py-1 bg-[#1D9BF0]  rounded-full text-sm font-medium">
                {task.type}
              </span>
            </div>

            <p className="text-secondary font-PublicSans mb-4 line-clamp-2">
              {task.description}
            </p>

            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <RiCoinsLine className="w-5 h-5 text-[#FFD700]" />
                <span className="text-yellow-500/90 font-semibold">
                  {task.reward} points
                </span>
              </div>

              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={task.tweetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1D9BF0] hover:text-[#1871CA] transition-colors duration-200 
                         flex items-center space-x-1 group"
              >
                <span>View Tweet</span>
                <FiExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </motion.a>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSubmitTask(task)}
              disabled={loading}
              className={`w-full border border-accent text-white px-6 py-3 rounded-xl font-medium
                         flex items-center justify-center space-x-2
                         transform transition-all duration-200
                         ${
                           loading
                             ? "opacity-50 cursor-not-allowed"
                             : "hover:shadow-md"
                         }`}
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
        );
      } else {
        return (
          <OtherTaskCard
            key={task.id}
            task={task}
            loading={loading}
            onSubmit={handleSubmitTask}
            onLinkClick={handleLinkClick}
            isLinkVisited={!!visitedLinks[task.id]}
          />
        );
      }
    });
  };

  return (
    <div className="min-h-screen bg-lightgray p-4 sm:p-6 md:p-8">
      <Sidebar />
      <div className=" xl:max-w-7xl max-w-4xl mx-auto md:ml-96 pt-20">
        <Header />
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-Cerebri font-bold text-primary mb-6"
        >
          Available Tasks
        </motion.h1>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("twitter")}
            className={`px-6 py-2 rounded-lg font-medium text-[15px] ${
              activeTab === "twitter"
                ? "bg-accent text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Twitter Tasks
          </button>
          <button
            onClick={() => setActiveTab("other")}
            className={`px-6 py-2 rounded-lg font-medium text-[15px] ${
              activeTab === "other"
                ? "bg-accent text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Other Tasks
          </button>
        </div>

        {activeTab === "twitter" && userDetails?.twitterHandle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-[#1D9BF0] border p-5 rounded-2xl mb-8 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center space-x-3">
              <FiTwitter className="w-5 h-5 text-[#1D9BF0]" />
              <p className="text-[#536471] font-PublicSans">
                Connected as{" "}
                <span className="font-semibold text-[#1D9BF0]">
                  @{userDetails.twitterHandle}
                </span>
              </p>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {renderTasks()}
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
