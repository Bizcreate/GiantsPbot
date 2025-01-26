import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";

export const fetchAnnouncements = async () => {
  try {
    const announcementsRef = collection(db, "announcements");
    const q = query(
      announcementsRef,
      where("status", "==", "active"),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const announcementData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { data: announcementData, error: null };
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return { data: [], error: error.message };
  }
};
