import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

export const fetchPartners = async () => {
  try {
    const partnersRef = collection(db, "partners");
    const snapshot = await getDocs(partnersRef);
    const partners = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return { data: partners, error: null };
  } catch (error) {
    console.error("Error fetching partners:", error);
    return { data: [], error };
  }
};
