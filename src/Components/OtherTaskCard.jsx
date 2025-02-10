import React from "react";
import { motion } from "framer-motion";
import {
  RiCoinsLine,
  RiCheckboxCircleLine,
  RiLoader4Line,
} from "react-icons/ri";
import { FiExternalLink } from "react-icons/fi";

const OtherTaskCard = ({
  task,
  loading,
  onSubmit,
  onLinkClick,
  isLinkVisited,
}) => {
  const handleLinkClick = (e) => {
    onLinkClick(task.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-cards2 p-6 rounded-xl shadow-lg 
                 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
        <h2 className="text-xl font-Cerebri font-semibold text-primary">
          {task.title}
        </h2>
        <span className="px-3 py-1 bg-accent/60 text-white rounded-full text-sm font-medium">
          {task.platform || "Task"}
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

        {task.link && (
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={task.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkClick}
            className={`flex items-center space-x-1 group ${
              isLinkVisited
                ? "text-green-600 hover:text-green-700"
                : "text-[#1D9BF0] hover:text-[#1a8cd8]"
            } transition-colors duration-200`}
          >
            <span>{isLinkVisited ? "Task Completed" : "View Task"}</span>
            <FiExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </motion.a>
        )}
      </div>

      {task.steps && (
        <div className="mb-4 bg-gray-50 rounded-lg p-3">
          <h3 className="font-medium text-gray-700 mb-2">Steps to complete:</h3>
          <ol className="list-decimal list-inside text-gray-600 text-sm space-y-1">
            {task.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSubmit(task)}
        disabled={loading || !isLinkVisited}
        className={`w-full px-6 py-3 rounded-xl font-medium
                   flex items-center justify-center space-x-2
                   transform transition-all duration-200
                   ${
                     loading
                       ? "opacity-50 cursor-not-allowed bg-[#1D9BF0]"
                       : isLinkVisited
                       ? "bg-[#1D9BF0] hover:bg-[#1a8cd8] hover:shadow-md"
                       : "bg-gray-400 cursor-not-allowed"
                   } text-white`}
      >
        {loading ? (
          <>
            <RiLoader4Line className="animate-spin h-5 w-5" />
            <span>Verifying...</span>
          </>
        ) : (
          <>
            <RiCheckboxCircleLine className="h-5 w-5" />
            <span>{isLinkVisited ? "Submit Task" : "Complete Task"}</span>
          </>
        )}
      </motion.button>
    </motion.div>
  );
};

export default OtherTaskCard;
