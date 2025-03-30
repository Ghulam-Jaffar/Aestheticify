"use client";

import { useRouter } from "next/navigation";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import AuthButton from "@/components/AuthButton";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full px-6 py-4 z-[999] flex items-center justify-between bg-black/30 backdrop-blur-lg text-white">
    {/* <div className="fixed top-0 left-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between"> */}
      <div
        className="font-bold text-xl cursor-pointer "
        onClick={() => router.push("/")}
      >
        🌌 Aestheticify
      </div>
      <div className="flex gap-4 items-center text-sm">
        <button
          onClick={() => router.push("/")}
          className="hover:underline cursor-pointer"
        >
          🎨 Quick Vibe
        </button>
        <button
          onClick={() => router.push("/my-vibes")}
          className="hover:underline cursor-pointer"
        >
          🌈 My Vibes
        </button>
        <button
          onClick={() => router.push("/about")}
          className="hover:underline cursor-pointer"
        >
          📚 About
        </button>

        {user ? (
          <>
            <span className="opacity-70 hidden sm:inline">
              Hi, {user.displayName || user.email}
            </span>
            <button
              onClick={() => {
                signOut(getAuth());
                router.refresh();
              }}
              className="text-red-300 hover:underline cursor-pointer"
            >
              🚪 Logout
            </button>
          </>
        ) : (
          <AuthButton />
        )}
      </div>
    </div>
  );
}
