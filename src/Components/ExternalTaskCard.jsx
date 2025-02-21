import React from "react";
import { motion } from "framer-motion";
import { FiEdit2, FiTrash2, FiExternalLink } from "react-icons/fi";
import { FaDiscord, FaTelegram, FaReddit, FaYoutube } from "react-icons/fa";
import { LoadingSpinner } from "./LoadingSpinner";

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

const ExternalTaskCard = ({
  task,
  onEdit,
  onDelete,
  updatingId,
  deletingId,
}) => {
  const PlatformIcon = platformIcons[task.platform];

  return (
    <motion.div className="p-6 rounded-xl bg-gradient-to-b from-cards2/50 to-cards3/30 border border-borders2/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <PlatformIcon
            style={{ color: platformColors[task.platform] }}
            className="text-2xl"
          />
          <h3 className="font-medium text-cardtext text-lg">{task.title}</h3>
        </div>
        <a
          href={task.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:text-accent/80 flex items-center gap-1 text-sm"
        >
          <FiExternalLink className="w-4 h-4" />
          Visit
        </a>
      </div>

      <p className="text-secondary mb-3">{task.description}</p>
      <p className="text-accent mb-4">Reward: {task.reward} points</p>

      <div className="flex gap-3 mt-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onEdit(task)}
          disabled={updatingId === task.id || deletingId === task.id}
          className="p-2 rounded-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          {updatingId === task.id ? (
            <>
              <LoadingSpinner size="sm" className="text-blue-500" />
              <span className="text-xs">Editing...</span>
            </>
          ) : (
            <FiEdit2 className="w-4 h-4" />
          )}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDelete(task.id)}
          disabled={updatingId === task.id || deletingId === task.id}
          className="p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          {deletingId === task.id ? (
            <>
              <LoadingSpinner size="sm" className="text-red-500" />
              <span className="text-xs">Deleting...</span>
            </>
          ) : (
            <FiTrash2 className="w-4 h-4" />
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ExternalTaskCard;
