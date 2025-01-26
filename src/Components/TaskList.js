import React from "react";
import { motion } from "framer-motion";
import { FaTasks } from "react-icons/fa";

const TaskList = ({ tasks }) => {
  return (
    <div className="bg-cards p-6 rounded-xl border border-borders2">
      <div className="flex items-center gap-2 mb-4">
        <FaTasks className="text-accent text-xl" />
        <h2 className="text-primary text-xl font-semibold">Tasks</h2>
      </div>
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.01 }}
            className="p-4 bg-cards2 rounded-lg"
          >
            <h3 className="text-primary font-medium mb-2">{task.title}</h3>
            <p className="text-secondary text-sm">{task.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
