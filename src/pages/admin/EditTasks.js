import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase/config";

const EditTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    tweetLink: "",
    type: "retweet", // or like, comment, etc.
    reward: 0,
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const tasksCollection = collection(db, "tasks");
    const taskSnapshot = await getDocs(tasksCollection);
    const taskList = taskSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTasks(taskList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "tasks"), newTask);
      setNewTask({
        title: "",
        description: "",
        tweetLink: "",
        type: "retweet",
        reward: 0,
      });
      fetchTasks();
      alert("Task created successfully!");
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task");
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
      fetchTasks();
      alert("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Tasks</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid gap-4">
          <input
            type="text"
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="border p-2 rounded"
          />
          <textarea
            placeholder="Task Description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            className="border p-2 rounded"
          />
          <input
            type="url"
            placeholder="Tweet Link"
            value={newTask.tweetLink}
            onChange={(e) =>
              setNewTask({ ...newTask, tweetLink: e.target.value })
            }
            className="border p-2 rounded"
          />
          <select
            value={newTask.type}
            onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="retweet">Retweet</option>
            <option value="like">Like</option>
            <option value="comment">Comment</option>
          </select>
          <input
            type="number"
            placeholder="Reward Points"
            value={newTask.reward}
            onChange={(e) =>
              setNewTask({ ...newTask, reward: parseInt(e.target.value) })
            }
            className="border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Create Task
          </button>
        </div>
      </form>

      <div className="grid gap-4">
        {tasks.map((task) => (
          <div key={task.id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{task.title}</h2>
            <p>{task.description}</p>
            <p>Type: {task.type}</p>
            <p>Reward: {task.reward} points</p>
            <p>
              Tweet Link:{" "}
              <a
                href={task.tweetLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {task.tweetLink}
              </a>
            </p>
            <button
              onClick={() => handleDelete(task.id)}
              className="bg-red-500 text-white px-4 py-2 rounded mt-2"
            >
              Delete Task
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditTasks;
