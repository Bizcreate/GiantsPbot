import { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../firebase/config";
import toast from "react-hot-toast";
import PageSpinner from "../Components/Spinner";
import { uploadFile } from "../utils/fileUpload";

const UserAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);

  async function isUsernameAvailable(username) {
    if (!username || username.length < 3) return false;

    const q = query(
      collection(db, "users"),
      where("username", "==", username.toLowerCase())
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  }

  async function createUserInDb(uid, userData) {
    if (userData.username) {
      userData.username = userData.username.toLowerCase();
    }

    await setDoc(doc(db, "users", uid), {
      ...userData,
      createdAt: new Date().toISOString(),
    });
  }

  async function signUp(email, password, additionalData = {}) {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await createUserInDb(userCredential.user.uid, {
      email,
      ...additionalData,
    });
    return userCredential;
  }

  async function signIn(email, password) {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
    if (userDoc.exists()) {
      setUserDetails(userDoc.data());
    }
    return userCredential;
  }

  async function logOut() {
    console.log("logging out");
    setUserDetails(null);
    await signOut(auth);
  }

  async function updateUserProfile(field, value) {
    if (!user) throw new Error("No user logged in");

    // Update field mapping
    const fieldMapping = {
      fullName: "fullName",
      username: "username",
      wallet: "walletAddress",
      avatar: "avatarUrl",
    };

    const dbField = fieldMapping[field];
    if (!dbField) throw new Error("Invalid field");

    try {
      if (field === "username") {
        const isAvailable = await isUsernameAvailable(value);
        if (!isAvailable) {
          throw new Error("Username is already taken");
        }
        value = value.toLowerCase();
      }

      // Handle file upload for avatar
      if (field === "avatar" && value instanceof File) {
        const uploadResult = await uploadFile(value, `avatars/${user.uid}`);
        value = uploadResult.url;
      }

      const userRef = doc(db, "users", user.uid);
      const updateData = { [dbField]: value };

      await setDoc(userRef, updateData, { merge: true });

      setUserDetails((prev) => ({
        ...prev,
        [dbField]: value,
      }));

      toast.success(
        `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } updated successfully!`
      );
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUserDetails(userDoc.data());
        }
      } else {
        setUserDetails(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    user,
    userDetails,
    signUp,
    signIn,
    logOut,
    updateUserProfile,
    isUsernameAvailable,
  };

  return (
    <UserAuthContext.Provider value={value}>
      {loading ? <PageSpinner /> : children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(UserAuthContext);
}
