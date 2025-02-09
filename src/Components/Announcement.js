import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { IoMegaphoneSharp } from "react-icons/io5";
const Announcement = ({
  title,
  date,
  content,
  priority,
  image,
  projectLink,
}) => {
  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "important":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      default:
        return "text-green-500";
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-cards2 p-6 rounded-xl border border-borders2 hover:shadow-lg"
    >
      <div className="flex flex-col gap-4">
        {image && (
          <div className="relative">
            <img
              src={image}
              alt={title}
              className="w-full h-48 object-cover rounded-lg"
            />
            <span
              className={`absolute top-2 right-2 px-2 py-1 bg-opacity-80 bg-black rounded text-xs ${getPriorityColor(
                priority
              )}`}
            >
              {priority}
            </span>
          </div>
        )}

        <div className="flex items-start gap-4">
          <IoMegaphoneSharp className="text-accent text-xl mt-1 flex-shrink-0" />

          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-primary font-semibold text-lg">{title}</h3>
              <span className="text-dimtext text-sm">{formatDate(date)}</span>
            </div>

            {!image && (
              <span
                className={`inline-block px-2 py-1 bg-opacity-20 rounded text-xs mb-2 ${getPriorityColor(
                  priority
                )}`}
              >
                {priority}
              </span>
            )}

            <p className="text-secondary text-sm mb-4">{content}</p>

            {projectLink && (
              <motion.a
                href={projectLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-accent text-sm hover:underline"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                Learn More →
              </motion.a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default Announcement;
