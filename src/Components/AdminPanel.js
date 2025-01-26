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
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div
          id="refer"
          className="w-full flex flex-col space-y-4 h-[100vh] scroller pt-4 overflow-y-auto pb-[150px] bg-cards text-cardtext"
        >
          <div className="w-fit">
            <button
              onClick={() => setShowTaskInputs(!showTaskInputs)}
              className={`${
                showTaskInputs ? "hidden" : "block"
              } bg-accent hover:bg-accent/90 font-semibold text-[15px] rounded-[6px] w-fit px-4 py-3 text-primary mb-4`}
            >
              {showTaskInputs ? "Cancel" : "Add new task"}
            </button>
          </div>

          {showTaskInputs && (
            <>
              <div className="flex w-full flex-wrap gap-3">
                <div className="flex flex-col w-full sm:w-[49%] gap-1">
                  <label className="text-[13px] pl-1 pb-[2px] font-medium text-secondary">
                    Task title
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={taskData.title}
                    onChange={handleInputChange}
                    placeholder="Title"
                    className="bg-cards2 w-full placeholder:text-dimtext text-cardtext placeholder:text-[12px] text-[13px] placeholder:font-light h-[55px] border border-borders2 outline-none rounded-[10px] flex items-center px-6"
                  />
                </div>

                <div className="flex flex-col w-full sm:w-[49%] gap-1">
                  <label className="text-[13px] pl-1 pb-[2px] font-medium text-secondary">
                    Task bonus amount
                  </label>

                  <input
                    type="number"
                    name="bonus"
                    value={taskData.bonus}
                    onChange={handleInputChange}
                    placeholder="Bonus"
                    className="bg-cards2 w-full placeholder:text-dimtext text-cardtext placeholder:text-[12px] text-[13px] placeholder:font-light h-[55px] border border-borders2 outline-none rounded-[10px] flex items-center px-6"
                  />
                </div>
                <div className="flex flex-col w-full sm:w-[49%] gap-1">
                  <label className="text-[13px] pl-1 pb-[2px] font-medium text-secondary">
                    Task link
                  </label>

                  <input
                    type="text"
                    name="link"
                    value={taskData.link}
                    onChange={handleInputChange}
                    placeholder="Link"
                    className="bg-cards2 w-full placeholder:text-dimtext text-cardtext placeholder:text-[12px] text-[13px] placeholder:font-light h-[55px] border border-borders2 outline-none rounded-[10px] flex items-center px-6"
                  />
                </div>
                <div className="flex flex-col w-full sm:w-[49%] gap-1">
                  <label className="text-[13px] pl-1 pb-[2px] font-medium text-secondary">
                    Task icon url
                  </label>

                  <input
                    type="text"
                    name="icon"
                    value={taskData.icon}
                    onChange={handleInputChange}
                    placeholder="Icon"
                    className="bg-cards2 w-full placeholder:text-dimtext text-cardtext placeholder:text-[12px] text-[13px] placeholder:font-light h-[55px] border border-borders2 outline-none rounded-[10px] flex items-center px-6"
                  />
                </div>
                <div className="flex flex-col w-full sm:w-[49%] gap-1">
                  <label className="text-[13px] pl-1 pb-[2px] font-medium text-secondary">
                    Telegram Channel/Group ID
                  </label>

                  <input
                    type="text"
                    name="chatId"
                    value={taskData.chatId}
                    onChange={handleInputChange}
                    placeholder="Chat ID"
                    className="bg-cards2 w-full placeholder:text-dimtext text-cardtext placeholder:text-[12px] text-[13px] placeholder:font-light h-[55px] border border-borders2 outline-none rounded-[10px] flex items-center px-6"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleUpdateTask}
                      className="bg-accent hover:bg-accent/90 font-semibold text-[15px] rounded-[6px] w-full sm:w-[200px] h-fit px-4 py-3 text-primary"
                    >
                      Update Task
                    </button>
                    <button
                      onClick={cancelEdits}
                      className="bg-cards2 hover:bg-cards2/90 font-semibold text-[15px] rounded-[6px] w-full sm:w-[200px] h-fit px-4 py-3 text-primary"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleAddTask}
                      className="bg-accent hover:bg-accent/90 font-semibold text-[15px] rounded-[6px] w-full sm:w-[200px] h-fit px-4 py-3 text-primary"
                    >
                      Add Task
                    </button>
                    <button
                      onClick={cancelEdits}
                      className="bg-cards2 hover:bg-cards2/90 font-semibold text-[15px] rounded-[6px] w-full sm:w-[200px] h-fit px-4 py-3 text-primary"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </>
          )}

          {successMessage && (
            <div className="modal fixed w-full h-full top-0 left-0 flex items-center justify-center">
              <div className="modal-overlay absolute w-full h-full bg-cards3 opacity-50"></div>
              <div className="modal-container bg-modal w-11/12 md:max-w-md mx-auto rounded-[10px] shadow-lg z-50 overflow-y-auto text-cardtext">
                <div className="modal-content py-4 text-left px-6">
                  <div className="flex justify-end items-center pb-3">
                    <div
                      className="modal-close cursor-pointer z-50"
                      onClick={() => setSuccessMessage("")}
                    >
                      <IoCloseCircleSharp
                        size={32}
                        className="text-secondary"
                      />
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
                    <p>{successMessage}</p>
                  </div>
                  <div className="flex justify-center pt-2">
                    <button
                      className="modal-close bg-blue-500 text-white p-2 px-6 rounded"
                      onClick={() => setSuccessMessage("")}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap justify-between gap-4 w-full">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-[10px] bg-cards2 border border-borders2 w-full sm:w-[49%] flex flex-col space-y-4"
              >
                <span className="flex items-start gap-2 font-medium text-cardtext">
                  <span className="">
                    <img
                      src={task.icon || "/telegram.svg"}
                      alt={task.title}
                      className="w-[25px]"
                    />
                  </span>
                  <span className="flex flex-col">
                    <p>Title: {task.title}</p>
                    <p>Bonus: {task.bonus}</p>
                  </span>
                </span>
                <div className="flex items-center justify-start text-[13px] gap-3">
                  <button
                    onClick={() => handleEditTask(task)}
                    className="bg-accent hover:bg-accent/90 rounded-[6px] text-primary px-2 py-[6px]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="bg-cards3 hover:bg-cards3/90 rounded-[6px] text-primary px-2 py-[6px]"
                  >
                    Delete {task.id}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPanel;
