// src/utils/auth.ts
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err) {
    console.error("Login failed:", err);
    return null;
  }
}

export async function logout() {
  await signOut(auth);
}
