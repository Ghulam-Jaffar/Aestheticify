import { db } from "@/lib/firebase";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export async function getUserVibes() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) throw new Error("User not logged in");

  // Get references from user's vibes collection
  const userVibesSnapshot = await getDocs(collection(db, "users", user.uid, "vibes"));
  
  // Fetch the actual vibe data from the main vibes collection
  const vibes = await Promise.all(
    userVibesSnapshot.docs.map(async (userVibeDoc) => {
      const vibeId = userVibeDoc.id;
      const vibeDocRef = doc(db, "vibes", vibeId);
      const vibeDoc = await getDoc(vibeDocRef);
      
      if (!vibeDoc.exists()) {
        console.warn(`Vibe with ID ${vibeId} not found in main collection`);
        return null;
      }
      
      return {
        id: vibeId,
        ...vibeDoc.data(),
      };
    })
  );
  
  // Filter out any null values (vibes that weren't found)
  return vibes.filter(vibe => vibe !== null);
}
