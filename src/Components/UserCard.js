import React from "react";
import { motion } from "framer-motion";
import { FiEdit2, FiCheck, FiX } from "react-icons/fi";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firestore";
import { format, isValid, parseISO } from "date-fns";
import toast from "react-hot-toast";

const UserCard = ({ user, onUpdate }) => {
  const [editingField, setEditingField] = React.useState({
    field: null,
    value: "",
  });
  const [editingBalance, setEditingBalance] = React.useState({
    isEditing: false,
    value: "",
  });

  const formatDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) {
        return "Invalid date";
      }
      return format(date, "PPp");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const handleInlineEdit = async (field, newValue) => {
    try {
      const userDoc = doc(db, "users", user.id);
      await updateDoc(userDoc, { [field]: newValue });
      onUpdate({ ...user, [field]: newValue });
      setEditingField({ field: null, value: "" });
      toast.success(`${field} updated successfully!`);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      toast.error(`Error updating ${field}`);
    }
  };

  const handleBalanceUpdate = async () => {
    if (!editingBalance.value) {
      setEditingBalance({ isEditing: false, value: "" });
      return;
    }

    try {
      const userDoc = doc(db, "users", user.id);
      await updateDoc(userDoc, { balance: Number(editingBalance.value) });
      onUpdate({ ...user, balance: Number(editingBalance.value) });
      toast.success("Balance updated successfully!");
      setEditingBalance({ isEditing: false, value: "" });
    } catch (error) {
      console.error("Error updating balance: ", error);
      toast.error("Error updating balance");
    }
  };

  return (
    <motion.div
      id={`user-${user.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-[#1f2023] border border-[#2b2b2b] rounded-lg p-4 md:p-6 relative group"
    >
      {/* Profile Section */}
      <div className="flex items-start space-x-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-[#2b2b2b]">
            {user.profileImage ? (
              <img
                src={user?.profileImage}
                alt={user?.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-semibold">
                {user?.fullName?.[0] || user?.email[0]}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {/* Name Field */}
          {editingField.field === "fullName" ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={editingField.value}
                onChange={(e) =>
                  setEditingField({ ...editingField, value: e.target.value })
                }
                className="bg-[#2b2b2b] px-2 py-1 rounded text-[15px] w-full"
                autoFocus
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleInlineEdit("fullName", editingField.value)}
                className="text-green-500 p-1"
              >
                <FiCheck />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setEditingField({ field: null, value: "" })}
                className="text-red-500 p-1"
              >
                <FiX />
              </motion.button>
            </div>
          ) : (
            <div className="flex items-center group">
              <h3 className="font-medium text-[15px] truncate">
                {user.fullName || "N/A"}
              </h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setEditingField({ field: "fullName", value: user.fullName })
                }
                className="opacity-0 group-hover:opacity-100 ml-2 text-gray-400 hover:text-white"
              >
                <FiEdit2 size={14} />
              </motion.button>
            </div>
          )}

          {/* Email Display */}
          <p className="text-[13px] text-gray-400 truncate mt-1">
            {user.email}
          </p>
        </div>
      </div>

      {/* Balance Section */}
      <motion.div
        className="mt-4 bg-[#2b2b2b] rounded-lg p-4"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <label className="text-[12px] text-gray-400">Balance</label>
        <div className="flex items-center space-x-2">
          {editingBalance.isEditing ? (
            <div className="flex-1 flex items-center space-x-2">
              <input
                type="number"
                value={editingBalance.value}
                onChange={(e) =>
                  setEditingBalance({
                    isEditing: true,
                    value: e.target.value,
                  })
                }
                className="bg-[#1f2023] text-[18px] font-semibold w-full px-2 py-1 rounded focus:outline-none"
                autoFocus
              />
              <div className="flex items-center space-x-1">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBalanceUpdate}
                  className="bg-green-500/20 text-green-500 p-1.5 rounded"
                >
                  <FiCheck size={16} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    setEditingBalance({ isEditing: false, value: "" })
                  }
                  className="bg-red-500/20 text-red-500 p-1.5 rounded"
                >
                  <FiX size={16} />
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-between">
              <span className="text-[18px] font-semibold">
                {user?.balance?.toLocaleString()}
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setEditingBalance({
                    isEditing: true,
                    value: user?.balance?.toString(),
                  })
                }
                className="text-gray-400 hover:text-white p-1"
              >
                <FiEdit2 size={16} />
              </motion.button>
            </div>
          )}
          <span className="text-[12px] text-gray-400">coins</span>
        </div>
      </motion.div>

      {/* Date Information */}
      <div className="mt-4 space-y-2">
        <div className="text-[12px] text-gray-400">
          Created: {formatDate(user?.createdAt)}
        </div>
        <div className="text-[12px] text-gray-400">
          Last active: {formatDate(user?.lastLoginAt)}
        </div>
      </div>
    </motion.div>
  );
};

export default UserCard;
