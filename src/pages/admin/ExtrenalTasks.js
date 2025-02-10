import React, { useState, useEffect } from "react";
import {
  collection,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import Spinner from "../../Components/Spinner";
import { motion } from "framer-motion";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { FaDiscord, FaTelegram, FaReddit, FaYoutube } from "react-icons/fa";
import { db } from "../../firebase/config";
import { toast } from "react-hot-toast";
import { LoadingSpinner } from "../../Components/LoadingSpinner";
import ExternalTaskCard from "../../Components/ExternalTaskCard";

const ExternalTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    platform: "discord", // Default platform
    link: "",
    reward: 0,
    status: "active",
  });
  const [showTaskInputs, setShowTaskInputs] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const platformIcons = {
    discord: FaDiscord,
    telegram: FaTelegram,
    reddit: FaReddit,
    youtube: FaYoutube,
  };

  const platformColors = {
    discord: "#5865F2",
    telegram: "#0088cc",
    reddit: "#FF4500",
    youtube: "#FF0000",
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const querySnapshot = await getDocs(collection(db, "otherTasks"));
      const tasksList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksList);
    } catch (error) {
      setError("Failed to fetch tasks");
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData({
      ...taskData,
      [name]: name === "reward" ? (value === "" ? 0 : Number(value)) : value,
    });
  };

  const validateTaskData = () => {
    if (!taskData.title || !taskData.description || !taskData.link) {
      throw new Error("Please fill in all required fields");
    }
  };

  const handleAddTask = async () => {
    try {
      setUpdatingId("new"); // Use "new" as ID for add operation
      validateTaskData();

      const taskRef = doc(collection(db, "otherTasks"));
      await setDoc(taskRef, {
        ...taskData,
        createdAt: new Date().toISOString(),
        status: "active",
      });

      toast.success("Task successfully added!");
      setShowTaskInputs(false);
      setTaskData({
        title: "",
        description: "",
        platform: "discord",
        link: "",
        reward: 0,
        status: "active",
      });
      fetchTasks();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleEditTask = async () => {
    try {
      setUpdatingId(currentTaskId);
      validateTaskData();
      const taskRef = doc(db, "otherTasks", currentTaskId);
      await updateDoc(taskRef, {
        ...taskData,
        updatedAt: new Date().toISOString(),
      });

      toast.success("Task successfully updated!");
      setShowTaskInputs(false);
      setIsEditing(false);
      setCurrentTaskId("");
      setTaskData({
        title: "",
        description: "",
        platform: "discord",
        link: "",
        reward: 0,
        status: "active",
      });
      fetchTasks();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      if (window.confirm("Are you sure you want to delete this task?")) {
        setDeletingId(taskId);
        const taskRef = doc(db, "otherTasks", taskId);
        await deleteDoc(taskRef);
        fetchTasks();
        toast.success("Task successfully deleted!");
      }
    } catch (error) {
      toast.error("Failed to delete task");
    } finally {
      setDeletingId(null);
    }
  };

  const startEditing = (task) => {
    setTaskData(task);
    setIsEditing(true);
    setCurrentTaskId(task.id);
    setShowTaskInputs(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-cards p-6"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowTaskInputs(true)}
          disabled={updatingId !== null || deletingId !== null}
          className="bg-accent hover:bg-accent/90 font-medium text-[15px] rounded-lg px-6 py-3 text-primary disabled:opacity-50 flex items-center gap-2"
        >
          {updatingId === "new" ? (
            <>
              <LoadingSpinner size="sm" className="text-primary" />
              <span>Adding...</span>
            </>
          ) : (
            "Add New Task"
          )}
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
                  Platform
                </label>
                <motion.select
                  name="platform"
                  value={taskData.platform}
                  onChange={handleInputChange}
                  className="bg-cards3/40 w-full text-cardtext text-[13px] h-[55px] border rounded-lg px-6"
                >
                  <option value="discord">Discord</option>
                  <option value="telegram">Telegram</option>
                  <option value="reddit">Reddit</option>
                  <option value="youtube">YouTube</option>
                </motion.select>
              </div>

              <div className="flex flex-col w-full sm:w-[calc(50%-8px)] gap-1">
                <label className="text-[13px] pl-1 font-medium text-secondary">
                  Link
                </label>
                <motion.input
                  type="url"
                  name="link"
                  value={taskData.link}
                  onChange={handleInputChange}
                  placeholder="Enter platform link"
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

              <div className="flex w-full justify-end gap-3 mt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowTaskInputs(false)}
                  disabled={updatingId !== null || deletingId !== null}
                  className="bg-cards3/40 hover:bg-cards3/60 font-medium text-[15px] rounded-lg px-6 py-3 text-primary disabled:opacity-50"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={isEditing ? handleEditTask : handleAddTask}
                  disabled={updatingId !== null || deletingId !== null}
                  className="bg-accent hover:bg-accent/90 font-medium text-[15px] rounded-lg px-6 py-3 text-primary disabled:opacity-50 flex items-center gap-2 min-w-[120px] justify-center"
                >
                  {updatingId === "new" || updatingId === currentTaskId ? (
                    <>
                      <LoadingSpinner size="sm" className="text-primary" />
                      <span>{isEditing ? "Updating..." : "Adding..."}</span>
                    </>
                  ) : isEditing ? (
                    "Update Task"
                  ) : (
                    "Add Task"
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4" layout>
          {tasks.map((task) => (
            <ExternalTaskCard
              key={task.id}
              task={task}
              onEdit={startEditing}
              onDelete={handleDeleteTask}
              updatingId={updatingId}
              deletingId={deletingId}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ExternalTasks;
