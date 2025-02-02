import { getFirestore } from "@firebase/firestore";
import { getStorage } from "@firebase/storage";
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA-9guvPoy46YADJ8Gpgj1Vs4N9CVuA5-E",
  authDomain: "trxlabs-858e0.firebaseapp.com",
  projectId: "trxlabs-858e0",
  storageBucket: "trxlabs-858e0.appspot.com",
  messagingSenderId: "6149594968",
  appId: "1:6149594968:web:ad46051f7d8cc351a8cf2d",
  measurementId: "G-D7YSLSRGPK",
};

let firebase_app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(firebase_app);
setPersistence(auth, browserLocalPersistence)
  .then(() => {})
  .catch((error) => {
    console.error("Failed to set session persistence:", error);
  });
const db = getFirestore(firebase_app);
const storage = getStorage(firebase_app);
export { auth, db, storage };
export default firebase_app;
