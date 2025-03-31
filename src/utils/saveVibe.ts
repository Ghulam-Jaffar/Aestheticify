import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  setDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Vibe } from "@/types/VibeComponent";

interface SaveVibeData {
  journal: string;
  vibe: Vibe;
  trackUrl?: string;
  title?: string;
}

export async function saveVibe(data: SaveVibeData): Promise<string> {
  const auth = getAuth();
  const user = auth.currentUser;

  // Create the document data with timestamps and user info if available
  const docData = {
    ...data,
    createdAt: serverTimestamp(),
    // Add user information if logged in
    creator: user ? {
      uid: user.uid,
      displayName: user.displayName || null,
      email: user.email || null,
      photoURL: user.photoURL || null,
    } : null,
  };

  // Save to the vibes collection (single source of truth)
  const vibeDocRef = await addDoc(collection(db, "vibes"), docData);
  
  // If user is logged in, just store a reference in their collection
  if (user) {
    await setDoc(
      doc(db, "users", user.uid, "vibes", vibeDocRef.id), 
      {
        vibeId: vibeDocRef.id,
        createdAt: serverTimestamp(),
      }
    );
  }

  return vibeDocRef.id;
}
