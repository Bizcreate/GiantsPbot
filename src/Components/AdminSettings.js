import React, { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/firestore";
import { IoCloseCircleSharp } from "react-icons/io5";
import Spinner from "./Spinner";

const AdminSettings = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [announcementData, setAnnouncementData] = useState({
    title: "",
    description: "",
    projectLink: "",
    image: "",
    date: "",
    priority: "normal",
    status: "active",
    category: "",
  });
  const [showInputs, setShowInputs] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentAnnouncementId, setCurrentAnnouncementId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "announcements"));
      const announcementsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAnnouncements(
        announcementsList.sort((a, b) => new Date(b.date) - new Date(a.date))
      );
      setLoading(false);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAnnouncementData({
      ...announcementData,
      [name]: value,
    });
  };

  const handleAddAnnouncement = async () => {
    try {
      const announcementRef = doc(collection(db, "announcements"));
      await setDoc(announcementRef, {
        ...announcementData,
        id: announcementRef.id,
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      });
      setSuccessMessage("Announcement successfully added!");
      setShowInputs(false);
      resetForm();
      fetchAnnouncements();
    } catch (error) {
      console.error("Error adding announcement:", error);
    }
  };

  const handleUpdateAnnouncement = async () => {
    try {
      const announcementDoc = doc(db, "announcements", currentAnnouncementId);
      await updateDoc(announcementDoc, {
        ...announcementData,
        updatedAt: new Date().toISOString(),
      });
      setSuccessMessage("Announcement successfully updated!");
      setShowInputs(false);
      resetForm();
      fetchAnnouncements();
    } catch (error) {
      console.error("Error updating announcement:", error);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    try {
      await deleteDoc(doc(db, "announcements", id));
      fetchAnnouncements();
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  const handleEditAnnouncement = (announcement) => {
    setAnnouncementData(announcement);
    setShowInputs(true);
    setIsEditing(true);
    setCurrentAnnouncementId(announcement.id);
  };

  const resetForm = () => {
    setAnnouncementData({
      title: "",
      description: "",
      projectLink: "",
      image: "",
      date: "",
      priority: "normal",
      status: "active",
      category: "",
    });
    setIsEditing(false);
    setCurrentAnnouncementId("");
  };

  const cancelEdits = () => {
    setShowInputs(false);
    resetForm();
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="w-full flex flex-col h-[100vh] scroller overflow-y-auto pt-4 pb-[150px]">
          <div className="w-full flex flex-col space-y-4">
            <div className="w-fit">
              <button
                onClick={() => setShowInputs(!showInputs)}
                className={`${
                  showInputs ? "hidden" : "block"
                } bg-[#f5bb5f] font-semibold text-[15px] rounded-[6px] w-fit px-4 py-3 text-[#000] mb-4`}
              >
                {showInputs ? "Cancel" : "Add New Announcement"}
              </button>
            </div>

            {showInputs && (
              <div className="bg-[#2a2a2a] rounded-xl p-6 shadow-lg mb-8">
                <h2 className="text-xl font-bold text-white mb-6">
                  {isEditing ? "Edit Announcement" : "Create New Announcement"}
                </h2>

                <div className="flex w-full flex-wrap gap-4">
                  {/* Title Field */}
                  <div className="flex flex-col w-full gap-2">
                    <label className="text-[14px] font-medium text-gray-300">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={announcementData.title}
                      onChange={handleInputChange}
                      placeholder="Enter announcement title"
                      className="bg-[#3a3a3a] w-full placeholder:text-[#888] text-[#e0e0e0] text-[14px] h-[50px] border border-gray-700 focus:border-[#f5bb5f] transition-colors outline-none rounded-lg px-4"
                      required
                    />
                  </div>

                  {/* Description Field */}
                  <div className="flex flex-col w-full gap-2">
                    <label className="text-[14px] font-medium text-gray-300">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={announcementData.description}
                      onChange={handleInputChange}
                      placeholder="Enter detailed description"
                      className="bg-[#3a3a3a] w-full placeholder:text-[#888] text-[#e0e0e0] text-[14px] min-h-[120px] border border-gray-700 focus:border-[#f5bb5f] transition-colors outline-none rounded-lg p-4 resize-none"
                      required
                    />
                  </div>

                  {/* Category and Priority Row */}
                  <div className="flex flex-col sm:flex-row w-full gap-4">
                    <div className="flex flex-col flex-1 gap-2">
                      <label className="text-[14px] font-medium text-gray-300">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="category"
                        value={announcementData.category}
                        onChange={handleInputChange}
                        className="bg-[#3a3a3a] w-full text-[#e0e0e0] text-[14px] h-[50px] border border-gray-700 focus:border-[#f5bb5f] transition-colors outline-none rounded-lg px-4 appearance-none cursor-pointer"
                        required
                      >
                        <option value="" disabled>
                          Select Category
                        </option>
                        <option value="update">Update</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="new-feature">New Feature</option>
                        <option value="event">Event</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="flex flex-col flex-1 gap-2">
                      <label className="text-[14px] font-medium text-gray-300">
                        Priority <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="priority"
                        value={announcementData.priority}
                        onChange={handleInputChange}
                        className="bg-[#3a3a3a] w-full text-[#e0e0e0] text-[14px] h-[50px] border border-gray-700 focus:border-[#f5bb5f] transition-colors outline-none rounded-lg px-4 appearance-none cursor-pointer"
                        required
                      >
                        <option value="normal">Normal</option>
                        <option value="important">Important</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  {/* Project Link and Image URL Row */}
                  <div className="flex flex-col sm:flex-row w-full gap-4">
                    <div className="flex flex-col flex-1 gap-2">
                      <label className="text-[14px] font-medium text-gray-300">
                        Project Link
                      </label>
                      <input
                        type="url"
                        name="projectLink"
                        value={announcementData.projectLink}
                        onChange={handleInputChange}
                        placeholder="https://example.com"
                        className="bg-[#3a3a3a] w-full placeholder:text-[#888] text-[#e0e0e0] text-[14px] h-[50px] border border-gray-700 focus:border-[#f5bb5f] transition-colors outline-none rounded-lg px-4"
                      />
                    </div>

                    <div className="flex flex-col flex-1 gap-2">
                      <label className="text-[14px] font-medium text-gray-300">
                        Image URL
                      </label>
                      <input
                        type="url"
                        name="image"
                        value={announcementData.image}
                        onChange={handleInputChange}
                        placeholder="https://example.com/image.jpg"
                        className="bg-[#3a3a3a] w-full placeholder:text-[#888] text-[#e0e0e0] text-[14px] h-[50px] border border-gray-700 focus:border-[#f5bb5f] transition-colors outline-none rounded-lg px-4"
                      />
                    </div>
                  </div>

                  {/* Status Field */}
                  <div className="flex flex-col sm:w-1/2 gap-2">
                    <label className="text-[14px] font-medium text-gray-300">
                      Status
                    </label>
                    <select
                      name="status"
                      value={announcementData.status}
                      onChange={handleInputChange}
                      className="bg-[#3a3a3a] w-full text-[#e0e0e0] text-[14px] h-[50px] border border-gray-700 focus:border-[#f5bb5f] transition-colors outline-none rounded-lg px-4 appearance-none cursor-pointer"
                    >
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-4">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleUpdateAnnouncement}
                          className="w-full sm:w-auto bg-green-500 hover:bg-green-600 transition-colors font-semibold text-[15px] rounded-lg px-6 py-3 text-white flex items-center justify-center gap-2"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Update Announcement
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleAddAnnouncement}
                        className="w-full sm:w-auto bg-[#f5bb5f] hover:bg-[#e5ab4f] transition-colors font-semibold text-[15px] rounded-lg px-6 py-3 text-black flex items-center justify-center gap-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Add Announcement
                      </button>
                    )}
                    <button
                      onClick={cancelEdits}
                      className="w-full sm:w-auto bg-gray-700 hover:bg-gray-600 transition-colors font-semibold text-[15px] rounded-lg px-6 py-3 text-white flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Success Message Modal */}
            {successMessage && (
              <div className="modal fixed w-full h-full top-0 left-0 flex items-center justify-center">
                <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
                <div className="modal-container bg-[#595D65] w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
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

            {/* Announcements List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className={`p-6 rounded-[15px] bg-cards hover:shadow-lg transition-all duration-300 border ${
                    announcement.priority === "urgent"
                      ? "border-red-500/50"
                      : announcement.priority === "important"
                      ? "border-yellow-500/50"
                      : "border-gray-700"
                  }`}
                >
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-white">
                            {announcement.title}
                          </h3>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              announcement.priority === "urgent"
                                ? "bg-red-500/10 text-red-500"
                                : announcement.priority === "important"
                                ? "bg-yellow-500/10 text-yellow-500"
                                : "bg-blue-500/10 text-blue-500"
                            }`}
                          >
                            {announcement.priority}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-gray-400 text-sm">
                            {new Date(announcement.date).toLocaleDateString()}
                          </span>
                          <span className="text-gray-400 text-sm">•</span>
                          <span className="text-gray-400 text-sm capitalize">
                            {announcement.category || "Uncategorized"}
                          </span>
                        </div>
                      </div>
                      {announcement.status === "archived" && (
                        <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                          Archived
                        </span>
                      )}
                    </div>

                    {announcement.image && (
                      <div className="w-full h-[200px] rounded-lg overflow-hidden">
                        <img
                          src={announcement.image}
                          alt={announcement.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "/default-announcement.svg";
                          }}
                        />
                      </div>
                    )}

                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {announcement.description}
                      </p>
                    </div>

                    {announcement.projectLink && (
                      <a
                        href={announcement.projectLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 text-sm hover:underline flex items-center gap-1"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        View Related Project
                      </a>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        onClick={() => handleEditAnnouncement(announcement)}
                        className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 transition-colors rounded-lg px-4 py-2 text-white text-sm"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteAnnouncement(announcement.id)
                        }
                        className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors rounded-lg px-4 py-2 text-sm"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSettings;
