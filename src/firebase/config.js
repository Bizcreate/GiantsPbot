import { getFirestore } from "@firebase/firestore";
import { getStorage } from "@firebase/storage";
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyARfcTqmudXQ6-PWNu9E7CBjJ6aPZSnBck",
  authDomain: "giant-protocol-test.firebaseapp.com",
  projectId: "giant-protocol-test",
  storageBucket: "giant-protocol-test.appspot.com",
  messagingSenderId: "342186452477",
  appId: "1:342186452477:web:9c6a30bef0f0495471a594",
  measurementId: "G-HSY32GPTKS",
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
