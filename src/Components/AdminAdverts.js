import React, { useState, useEffect } from "react";
import { db } from "../firebase/firestore";
import {
  collection,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import Spinner from "./Spinner";
import { IoCloseCircleSharp } from "react-icons/io5";

const AdminAdverts = () => {
  const [partners, setPartners] = useState([]);
  const [partnerData, setPartnerData] = useState({
    name: "",
    description: "",
    projectLink: "",
    companyImage: "",
  });
  const [showInputs, setShowInputs] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentPartnerId, setCurrentPartnerId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    const querySnapshot = await getDocs(collection(db, "partners"));
    const partnersList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPartners(partnersList);
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPartnerData({
      ...partnerData,
      [name]: value,
    });
  };

  const handleAddPartner = async () => {
    try {
      const partnerRef = doc(collection(db, "partners")); // Firebase will auto-generate ID
      await setDoc(partnerRef, {
        ...partnerData,
        id: partnerRef.id,
      });
      setSuccessMessage("Partner successfully added!");
      setShowInputs(false);
      setPartnerData({
        name: "",
        description: "",
        projectLink: "",
        companyImage: "",
      });
      fetchPartners();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleEditPartner = (partner) => {
    setPartnerData(partner);
    setShowInputs(true);
    setIsEditing(true);
    setCurrentPartnerId(partner.id);
  };

  const handleUpdatePartner = async () => {
    const partnerDoc = doc(db, "partners", currentPartnerId);
    try {
      await updateDoc(partnerDoc, {
        name: partnerData.name,
        description: partnerData.description,
        projectLink: partnerData.projectLink,
        companyImage: partnerData.companyImage,
      });
      setSuccessMessage("Partner successfully updated!");
      setShowInputs(false);
      setPartnerData({
        name: "",
        description: "",
        projectLink: "",
        companyImage: "",
      });
      setIsEditing(false);
      setCurrentPartnerId("");
      fetchPartners();
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  const handleDeletePartner = async (id) => {
    try {
      const partnerDoc = doc(db, "partners", id);
      await deleteDoc(partnerDoc);
      fetchPartners();
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const cancelEdits = () => {
    setIsEditing(false);
    setShowInputs(!showInputs);
    setPartnerData({
      name: "",
      description: "",
      projectLink: "",
      companyImage: "",
    });
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
                {showInputs ? "Cancel" : "Add new partner"}
              </button>
            </div>

            {showInputs && (
              <>
                <div className="flex w-full flex-wrap gap-3">
                  <div className="flex flex-col w-full sm:w-[49%] gap-1">
                    <label className="text-[13px] pl-1 pb-[2px] font-medium">
                      Partner Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={partnerData.name}
                      onChange={handleInputChange}
                      placeholder="Partner name"
                      className="bg-[#4b4b4b] w-full placeholder:text-[#b9b9b9] text-[#e0e0e0] placeholder:text-[12px] text-[13px] placeholder:font-light h-[55px] border-none outline-none rounded-[10px] flex items-center px-6"
                    />
                  </div>

                  <div className="flex flex-col w-full sm:w-[49%] gap-1">
                    <label className="text-[13px] pl-1 pb-[2px] font-medium">
                      Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={partnerData.description}
                      onChange={handleInputChange}
                      placeholder="Partner description"
                      className="bg-[#4b4b4b] placeholder:text-[#b9b9b9] text-[#e0e0e0] placeholder:text-[12px] text-[13px] placeholder:font-light h-[55px] border-none outline-none rounded-[10px] flex items-center px-6"
                    />
                  </div>

                  <div className="flex flex-col w-full sm:w-[49%] gap-1">
                    <label className="text-[13px] pl-1 pb-[2px] font-medium">
                      Project Link
                    </label>
                    <input
                      type="text"
                      name="projectLink"
                      value={partnerData.projectLink}
                      onChange={handleInputChange}
                      placeholder="Project link"
                      className="bg-[#4b4b4b] placeholder:text-[#b9b9b9] text-[#e0e0e0] placeholder:text-[12px] text-[13px] placeholder:font-light h-[55px] border-none outline-none rounded-[10px] flex items-center px-6"
                    />
                  </div>

                  <div className="flex flex-col w-full sm:w-[49%] gap-1">
                    <label className="text-[13px] pl-1 pb-[2px] font-medium">
                      Company Image URL
                    </label>
                    <input
                      type="text"
                      name="companyImage"
                      value={partnerData.companyImage}
                      onChange={handleInputChange}
                      placeholder="Company image URL"
                      className="bg-[#4b4b4b] placeholder:text-[#b9b9b9] text-[#e0e0e0] placeholder:text-[12px] text-[13px] placeholder:font-light h-[55px] border-none outline-none rounded-[10px] flex items-center px-6"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleUpdatePartner}
                        className="bg-green-500 font-semibold text-[15px] rounded-[6px] w-full sm:w-[200px] h-fit px-4 py-3 text-[#fff]"
                      >
                        Update Partner
                      </button>
                      <button
                        onClick={cancelEdits}
                        className="bg-[#4a3a3a] font-semibold text-[15px] rounded-[6px] w-full sm:w-[200px] h-fit px-4 py-3 text-[#fff]"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleAddPartner}
                        className="bg-[#f5bb5f] font-semibold text-[15px] rounded-[6px] w-full sm:w-[200px] h-fit px-4 py-3 text-[#000]"
                      >
                        Add Partner
                      </button>
                      <button
                        onClick={cancelEdits}
                        className="bg-[#4a3a3a] font-semibold text-[15px] rounded-[6px] w-full sm:w-[200px] h-fit px-4 py-3 text-[#fff]"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="p-6 rounded-[15px] bg-cards hover:shadow-lg transition-all duration-300 border border-gray-700"
                >
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-[80px] h-[80px] rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center">
                        <img
                          src={partner.companyImage || "/default-company.svg"}
                          alt={partner.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "/default-company.svg";
                            e.target.className = "w-[40px] h-[40px]";
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1">{partner.name}</h3>
                        <a
                          href={partner.projectLink}
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
                          Visit Project
                        </a>
                      </div>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {partner.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        onClick={() => handleEditPartner(partner)}
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
                        onClick={() => handleDeletePartner(partner.id)}
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

export default AdminAdverts;
