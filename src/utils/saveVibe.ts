import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  setDoc,
  doc,
  serverTimestamp,
  getDoc,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Vibe } from "@/types/VibeComponent";

interface SpotifyTrackInfo {
  name: string;
  artist: string;
  albumArt?: string;
}

interface SaveVibeData {
  journal: string;
  vibe: Vibe;
  trackUrl?: string;
  title?: string;
  trackInfo?: SpotifyTrackInfo;
  vibeId?: string; // Optional ID for existing vibes
}

interface SaveVibeOptions {
  linkToUser?: boolean; // Whether to link the vibe to the user
}

/**
 * Save a vibe to Firestore
 * @param data The vibe data to save
 * @param options Options for saving (linkToUser: whether to link to user's collection)
 * @returns The ID of the saved vibe
 */
export async function saveVibe(
  data: SaveVibeData, 
  options: SaveVibeOptions = {}
): Promise<string> {
  const { linkToUser = false } = options;
  const auth = getAuth();
  const user = auth.currentUser;

  // If we already have a vibeId and want to link to user
  if (data.vibeId && linkToUser && user) {
    // Check if already linked to user
    const userVibeRef = doc(db, "users", user.uid, "vibes", data.vibeId);
    const userVibeDoc = await getDoc(userVibeRef);
    
    // If already linked, just return the ID
    if (userVibeDoc.exists()) {
      return data.vibeId;
    }
    
    // Link to user
    await setDoc(userVibeRef, {
      vibeId: data.vibeId,
      createdAt: serverTimestamp(),
    });
    
    return data.vibeId;
  }

  // Create the document data with timestamps and user info if available
  const docData: Record<string, any> = {
    journal: data.journal,
    vibe: data.vibe,
    createdAt: serverTimestamp(),
    // Add user information if logged in and linking to user
    creator: (user && linkToUser) ? {
      uid: user.uid,
      displayName: user.displayName || null,
      email: user.email || null,
      photoURL: user.photoURL || null,
    } : null,
  };

  // Only add optional fields if they exist
  if (data.trackUrl) docData['trackUrl'] = data.trackUrl;
  if (data.title) docData['title'] = data.title;
  if (data.trackInfo) docData['trackInfo'] = data.trackInfo;

  // If we have an existing vibeId, use it
  let vibeId = data.vibeId;
  
  // If no existing ID, save to the vibes collection
  if (!vibeId) {
    const vibeDocRef = await addDoc(collection(db, "vibes"), docData);
    vibeId = vibeDocRef.id;
  }
  
  // If user is logged in and we want to link to user, store a reference in their collection
  if (user && linkToUser) {
    await setDoc(
      doc(db, "users", user.uid, "vibes", vibeId), 
      {
        vibeId: vibeId,
        createdAt: serverTimestamp(),
      }
    );
  }

  return vibeId;
}

/**
 * Update a vibe with creator information
 * @param vibeId The ID of the vibe to update
 * @returns Whether the update was successful
 */
export async function updateVibeCreator(vibeId: string): Promise<boolean> {
  if (!vibeId) return false;
  
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (!user) return false;
  
  try {
    const vibeRef = doc(db, "vibes", vibeId);
    const vibeDoc = await getDoc(vibeRef);
    
    if (!vibeDoc.exists()) return false;
    
    const vibeData = vibeDoc.data();
    
    // Safety checks:
    // 1. If creator already exists, don't update
    if (vibeData.creator) return true;
    
    // 2. Check if this vibe was created anonymously by this user's session
    // This is a safety measure to prevent updating vibes created by others
    const userVibesQuery = query(
      collection(db, "users", user.uid, "vibes"),
      where("vibeId", "==", vibeId)
    );
    const userVibesSnapshot = await getDocs(userVibesQuery);
    
    // 3. Check if the vibe was auto-saved during the current session
    // We can only update vibes that were created in the current session
    // or explicitly linked to the current user
    const isLinkedToUser = !userVibesSnapshot.empty;
    const isCurrentSession = sessionStorage.getItem(`vibe_created_${vibeId}`) === 'true';
    
    if (!isLinkedToUser && !isCurrentSession) {
      console.log("Cannot update creator: vibe not created by current user");
      return false;
    }
    
    // Update with creator info
    await updateDoc(vibeRef, {
      creator: {
        uid: user.uid,
        displayName: user.displayName || null,
        email: user.email || null,
        photoURL: user.photoURL || null,
      }
    });
    
    return true;
  } catch (error) {
    console.error("Error updating vibe creator:", error);
    return false;
  }
}

/**
 * Check if a vibe is already saved by the current user
 * @param vibeId The ID of the vibe to check
 * @returns Whether the vibe is saved by the current user
 */
export async function isVibeSavedByUser(vibeId: string): Promise<boolean> {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (!user || !vibeId) return false;
  
  const userVibeRef = doc(db, "users", user.uid, "vibes", vibeId);
  const userVibeDoc = await getDoc(userVibeRef);
  
  return userVibeDoc.exists();
}
