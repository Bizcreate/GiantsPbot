import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import { db } from "../firebase/config";

const AdminProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthContext();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setCheckingAdmin(false);
        return;
      }

      try {
        const adminRef = doc(db, "admin", user.uid);

        const adminSnap = await getDoc(adminRef);

        setIsAdmin(adminSnap.exists());
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      }

      setCheckingAdmin(false);
    };

    checkAdminStatus();
  }, [user]);

  if (loading || checkingAdmin) {
    return <Spinner />;
  }

  // Check if user exists and is found in admins collection
  if (!user || !isAdmin) {
    return <Navigate to="/dashboardlogin" />;
  }

  return children;
};

export default AdminProtectedRoute;
