import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import {
  collection,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import Spinner from "./Spinner";
import { IoCloseCircleSharp } from "react-icons/io5";
import { motion } from "framer-motion";
import { FiPlus } from "react-icons/fi";
import { RiEditLine, RiDeleteBinLine } from "react-icons/ri";
import { FaTwitter } from "react-icons/fa";

const AdminPanel = () => {
  const [tasks, setTasks] = useState([]);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    tweetLink: "",
    type: "retweet", // Default type
    reward: 0,
    status: "active",
  });
  const [showTaskInputs, setShowTaskInputs] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState("");
  const [loading, setLoading] = useState(true);

  // Extract Tweet ID from tweet URL
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

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    const tasksList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTasks(tasksList);
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData({
      ...taskData,
      [name]: name === "reward" ? (value === "" ? 0 : Number(value)) : value,
    });
  };

  const validateTaskData = () => {
    if (!taskData.title || !taskData.description || !taskData.tweetLink) {
      throw new Error("Please fill in all required fields");
    }

    const tweetId = extractTweetId(taskData.tweetLink);
    if (!tweetId) {
      throw new Error("Invalid Tweet URL");
    }

    return tweetId;
  };

  const handleAddTask = async () => {
    try {
      const tweetId = validateTaskData();

      const taskRef = doc(collection(db, "tasks"));
      await setDoc(taskRef, {
        ...taskData,
        tweetId,
        createdAt: new Date().toISOString(),
        status: "active",
      });

      setSuccessMessage("Task successfully added!");
      setShowTaskInputs(false);
      setTaskData({
        title: "",
        description: "",
        tweetLink: "",
        type: "retweet",
        reward: 0,
        status: "active",
      });
      fetchTasks();
    } catch (error) {
      setSuccessMessage(error.message);
    }
  };

  const handleEditTask = (task) => {
    setTaskData(task);
    setShowTaskInputs(true);
    setIsEditing(true);
    setCurrentTaskId(task.id);
  };

  const handleUpdateTask = async () => {
    const taskDoc = doc(db, "tasks", currentTaskId.toString());
    try {
      await updateDoc(taskDoc, {
        title: taskData.title,
        description: taskData.description,
        tweetLink: taskData.tweetLink,
        type: taskData.type,
        reward: taskData.reward,
        status: taskData.status,
      });
      setSuccessMessage("Task successfully updated!");
      setShowTaskInputs(false);
      setTaskData({
        title: "",
        description: "",
        tweetLink: "",
        type: "retweet",
        reward: 0,
        status: "active",
      });
      setIsEditing(false);
      setCurrentTaskId("");
      fetchTasks();
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const taskDoc = doc(db, "tasks", id.toString());
      await deleteDoc(taskDoc);
      fetchTasks();
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-cards p-6"
    >
      {loading ? (
        <Spinner />
      ) : (
        <div className="max-w-7xl mx-auto space-y-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowTaskInputs(!showTaskInputs)}
            className={`${
              showTaskInputs ? "hidden" : "block"
            } bg-accent hover:bg-accent/90 font-medium text-[15px] rounded-lg px-6 py-3 text-primary flex items-center gap-2`}
          >
            <FiPlus className="text-lg" />
            Add new Twitter task
          </motion.button>

          {showTaskInputs && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-cards2/50 p-6 rounded-xl border border-borders2/50"
            >
              <div className="flex w-full flex-wrap gap-4">
                <div className="flex flex-col w-full sm:w-[calc(50%-8px)] gap-1">
                  <label className="text-[13px] pl-1 font-medium text-secondary">
                    Task Title
                  </label>
                  <motion.input
                    type="text"
                    name="title"
                    value={taskData.title}
                    onChange={handleInputChange}
                    placeholder="Enter task title"
                    className="bg-cards3/40 w-full text-cardtext text-[13px] h-[55px] border rounded-lg px-6"
                  />
                </div>

                <div className="flex flex-col w-full sm:w-[calc(50%-8px)] gap-1">
                  <label className="text-[13px] pl-1 font-medium text-secondary">
                    Description
                  </label>
                  <motion.textarea
                    name="description"
                    value={taskData.description}
                    onChange={handleInputChange}
                    placeholder="Enter task description"
                    className="bg-cards3/40 w-full text-cardtext text-[13px] h-[55px] border rounded-lg px-6"
                  />
                </div>

                <div className="flex flex-col w-full sm:w-[calc(50%-8px)] gap-1">
                  <label className="text-[13px] pl-1 font-medium text-secondary">
                    Tweet Link
                  </label>
                  <motion.input
                    type="url"
                    name="tweetLink"
                    value={taskData.tweetLink}
                    onChange={handleInputChange}
                    placeholder="https://twitter.com/user/status/123456789"
                    className="bg-cards3/40 w-full text-cardtext text-[13px] h-[55px] border rounded-lg px-6"
                  />
                </div>

                <div className="flex flex-col w-full sm:w-[calc(50%-8px)] gap-1">
                  <label className="text-[13px] pl-1 font-medium text-secondary">
                    Task Type
                  </label>
                  <motion.select
                    name="type"
                    value={taskData.type}
                    onChange={handleInputChange}
                    className="bg-cards3/40 w-full text-cardtext text-[13px] h-[55px] border rounded-lg px-6"
                  >
                    <option value="retweet">Retweet</option>
                    <option value="like">Like</option>
                    <option value="follow">Follow</option>
                    <option value="comment">Comment</option>
                  </motion.select>
                </div>

                <div className="flex flex-col w-full sm:w-[calc(50%-8px)] gap-1">
                  <label className="text-[13px] pl-1 font-medium text-secondary">
                    Reward Points
                  </label>
                  <motion.input
                    type="number"
                    name="reward"
                    value={taskData.reward}
                    onChange={handleInputChange}
                    placeholder="Enter reward points"
                    className="bg-cards3/40 w-full text-cardtext text-[13px] h-[55px] border rounded-lg px-6"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={isEditing ? handleUpdateTask : handleAddTask}
                  className="bg-accent hover:bg-accent/90 font-medium text-[15px] rounded-lg w-full sm:w-[200px] px-6 py-3 text-primary"
                >
                  {isEditing ? "Update Task" : "Add Task"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowTaskInputs(false)}
                  className="bg-cards3 hover:bg-cards3/80 font-medium text-[15px] rounded-lg w-full sm:w-[200px] px-6 py-3 text-primary"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Task List */}
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4" layout>
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                className="p-6 rounded-xl bg-gradient-to-b from-cards2/50 to-cards3/30 border border-borders2/30"
              >
                <div className="flex items-center gap-3 mb-4">
                  <FaTwitter className="text-[#1DA1F2] text-2xl" />
                  <h3 className="font-medium text-cardtext text-lg">
                    {task.title}
                  </h3>
                </div>
                <p className="text-secondary mb-2">{task.description}</p>
                <p className="text-accent mb-2">Reward: {task.reward} points</p>
                <p className="text-secondary mb-4">Type: {task.type}</p>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleEditTask(task)}
                    className="flex-1 bg-accent/10 text-accent rounded-lg px-4 py-2"
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleDeleteTask(task.id)}
                    className="flex-1 bg-red-500/10 text-red-500 rounded-lg px-4 py-2"
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {successMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center z-50"
            >
              <div
                className="absolute inset-0 bg-cards3/80 backdrop-blur-sm"
                onClick={() => setSuccessMessage("")}
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-modal rounded-xl p-6 shadow-2xl relative z-10 max-w-md w-full mx-4"
              >
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSuccessMessage("")}
                  >
                    <IoCloseCircleSharp
                      size={28}
                      className="text-secondary hover:text-primary transition-colors"
                    />
                  </motion.button>
                </div>
                <div className="text-center py-4">
                  <p className="text-cardtext">{successMessage}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default AdminPanel;
