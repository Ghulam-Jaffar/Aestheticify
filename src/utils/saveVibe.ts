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

  const docData = {
    ...data,
    createdAt: serverTimestamp(),
  };

  // Save a public copy first (for sharing)
  const publicDocRef = await addDoc(collection(db, "vibes"), docData);

  // Save under user's collection if logged in
  if (user) {
    await setDoc(doc(db, "users", user.uid, "vibes", publicDocRef.id), docData);
  }

  return publicDocRef.id;
}
