import React, { useState, useEffect } from "react";
import { db } from "../firebase/firestore"; // adjust the path as needed
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

const AdminPanel = () => {
  const [tasks, setTasks] = useState([]);
  const [taskData, setTaskData] = useState({
    title: "",
    bonus: 0,
    id: "",
    link: "",
    icon: "",
    chatId: "",
  });
  const [showTaskInputs, setShowTaskInputs] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState("");
  const [loading, setLoading] = useState(true);

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

  const fetchCounter = async () => {
    const counterDoc = await getDoc(doc(db, "counters", "taskCounter"));
    if (counterDoc.exists()) {
      return counterDoc.data().currentId;
    } else {
      await setDoc(doc(db, "counters", "taskCounter"), { currentId: 0 });
      return 0;
    }
  };

  const incrementCounter = async () => {
    const currentId = await fetchCounter();
    const newId = currentId + 1;
    await setDoc(doc(db, "counters", "taskCounter"), { currentId: newId });
    return newId;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData({
      ...taskData,
      [name]: name === "bonus" ? (value === "" ? "" : Number(value)) : value,
    });
  };

  const handleAddTask = async () => {
    try {
      const newId = await incrementCounter();
      const taskDoc = doc(db, "tasks", newId.toString());
      await setDoc(taskDoc, { ...taskData, id: newId });
      setSuccessMessage("Task successfully added!");
      setShowTaskInputs(false);
      setTaskData({
        title: "",
        bonus: 0,
        id: "",
        link: "",
        icon: "",
        chatId: "",
      });
      fetchTasks();
    } catch (e) {
      console.error("Error adding document: ", e);
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
        bonus: taskData.bonus,
        link: taskData.link,
        icon: taskData.icon,
        chatId: taskData.chatId,
      });
      setSuccessMessage("Task successfully updated!");
      setShowTaskInputs(false);
      setTaskData({
        title: "",
        bonus: 0,
        id: "",
        link: "",
        icon: "",
        chatId: "",
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

  const cancelEdits = () => {
    setIsEditing(false);
    setShowTaskInputs(!showTaskInputs);
    setTaskData({
      title: "",
      bonus: 0,
      id: "",
      link: "",
      icon: "",
      chatId: "",
    });
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
            } bg-accent hover:bg-accent/90 font-medium text-[15px] rounded-lg px-6 py-3 text-primary flex items-center gap-2 transition-all duration-200 shadow-lg`}
          >
            <FiPlus className="text-lg" />
            Add new task
          </motion.button>

          {showTaskInputs && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-cards2/50 p-6 rounded-xl border border-borders2/50 backdrop-blur-sm shadow-xl"
            >
              <div className="flex w-full flex-wrap gap-4">
                <div className="flex flex-col w-full sm:w-[calc(50%-8px)] gap-1">
                  <label className="text-[13px] pl-1 pb-[2px] font-medium text-secondary">
                    Task title
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    name="title"
                    value={taskData.title}
                    onChange={handleInputChange}
                    placeholder="Title"
                    className="bg-cards3/40 w-full placeholder:text-dimtext text-cardtext placeholder:text-[12px] text-[13px] h-[55px] border border-borders2/30 outline-none rounded-lg px-6 transition-all duration-200 focus:border-accent/50 focus:bg-cards3/60"
                  />
                </div>
                <div className="flex flex-col w-full sm:w-[calc(50%-8px)] gap-1">
                  <label className="text-[13px] pl-1 pb-[2px] font-medium text-secondary">
                    Task bonus amount
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="number"
                    name="bonus"
                    value={taskData.bonus}
                    onChange={handleInputChange}
                    placeholder="Bonus"
                    className="bg-cards3/40 w-full placeholder:text-dimtext text-cardtext placeholder:text-[12px] text-[13px] h-[55px] border border-borders2/30 outline-none rounded-lg px-6 transition-all duration-200 focus:border-accent/50 focus:bg-cards3/60"
                  />
                </div>
                <div className="flex flex-col w-full sm:w-[calc(50%-8px)] gap-1">
                  <label className="text-[13px] pl-1 pb-[2px] font-medium text-secondary">
                    Task link
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    name="link"
                    value={taskData.link}
                    onChange={handleInputChange}
                    placeholder="Link"
                    className="bg-cards3/40 w-full placeholder:text-dimtext text-cardtext placeholder:text-[12px] text-[13px] h-[55px] border border-borders2/30 outline-none rounded-lg px-6 transition-all duration-200 focus:border-accent/50 focus:bg-cards3/60"
                  />
                </div>
                <div className="flex flex-col w-full sm:w-[calc(50%-8px)] gap-1">
                  <label className="text-[13px] pl-1 pb-[2px] font-medium text-secondary">
                    Task icon url
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    name="icon"
                    value={taskData.icon}
                    onChange={handleInputChange}
                    placeholder="Icon"
                    className="bg-cards3/40 w-full placeholder:text-dimtext text-cardtext placeholder:text-[12px] text-[13px] h-[55px] border border-borders2/30 outline-none rounded-lg px-6 transition-all duration-200 focus:border-accent/50 focus:bg-cards3/60"
                  />
                </div>
                <div className="flex flex-col w-full sm:w-[calc(50%-8px)] gap-1">
                  <label className="text-[13px] pl-1 pb-[2px] font-medium text-secondary">
                    Telegram Channel/Group ID
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    name="chatId"
                    value={taskData.chatId}
                    onChange={handleInputChange}
                    placeholder="Chat ID"
                    className="bg-cards3/40 w-full placeholder:text-dimtext text-cardtext placeholder:text-[12px] text-[13px] h-[55px] border border-borders2/30 outline-none rounded-lg px-6 transition-all duration-200 focus:border-accent/50 focus:bg-cards3/60"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={isEditing ? handleUpdateTask : handleAddTask}
                  className="bg-accent hover:bg-accent/90 font-medium text-[15px] rounded-lg w-full sm:w-[200px] px-6 py-3 text-primary transition-all duration-200 shadow-lg"
                >
                  {isEditing ? "Update Task" : "Add Task"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={cancelEdits}
                  className="bg-cards3 hover:bg-cards3/80 font-medium text-[15px] rounded-lg w-full sm:w-[200px] px-6 py-3 text-primary transition-all duration-200 shadow-lg"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          )}

          <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4" layout>
            {tasks.map((task, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                key={task.id}
                className="p-6 rounded-xl bg-gradient-to-b from-cards2/50 to-cards3/30 border border-borders2/30 backdrop-blur-sm hover:border-borders2/50 transition-all duration-300 shadow-lg group"
              >
                <div className="flex flex-col items-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-16 h-16 rounded-2xl bg-cards3/40 p-2 flex items-center justify-center shadow-lg"
                  >
                    <motion.img
                      src={task.icon || "/telegram.svg"}
                      alt={task.title}
                      className="w-12 h-12 object-contain rounded-xl"
                    />
                  </motion.div>

                  <div className="text-center space-y-2">
                    <motion.h3
                      className="font-medium text-cardtext text-lg group-hover:text-accent transition-colors duration-300"
                      whileHover={{ scale: 1.02 }}
                    >
                      {task.title}
                    </motion.h3>
                    <motion.p
                      className="text-secondary text-sm"
                      initial={{ opacity: 0.8 }}
                      whileHover={{ opacity: 1 }}
                    >
                      Bonus: <span className="text-accent">{task.bonus}</span>
                    </motion.p>
                  </div>

                  <div className="flex items-center gap-3 mt-2 w-full">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEditTask(task)}
                      className="flex items-center justify-center gap-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg px-4 py-2.5 text-sm transition-all duration-200 flex-1 border border-accent/20 hover:border-accent/30"
                    >
                      <RiEditLine className="text-lg" />
                      <span>Edit</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeleteTask(task.id)}
                      className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg px-4 py-2.5 text-sm transition-all duration-200 flex-1 border border-red-500/20 hover:border-red-500/30"
                    >
                      <RiDeleteBinLine className="text-lg" />
                      <span>Delete</span>
                    </motion.button>
                  </div>
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
