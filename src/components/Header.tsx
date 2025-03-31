"use client";

import { useRouter, usePathname } from "next/navigation";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import AuthButton from "@/components/AuthButton";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const auth = getAuth();
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  // Close mobile menu when navigating
  const navigateTo = (path: string) => {
    setMobileMenuOpen(false);
    router.push(path);
  };

  // Check if the current path matches the given path
  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname?.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="fixed top-0 left-0 w-full px-4 sm:px-6 py-4 z-[999] flex items-center justify-between bg-black/30 backdrop-blur-lg text-white">
      <div
        className="font-bold text-xl cursor-pointer"
        onClick={() => navigateTo("/")}
      >
        🌌 Aestheticify
      </div>
      
      {/* Mobile menu button */}
      <button 
        className="md:hidden flex items-center cursor-pointer" 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          className="w-6 h-6"
        >
          {mobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>
      
      {/* Desktop navigation */}
      <div className="hidden md:flex gap-4 items-center text-sm">
        <button
          onClick={() => navigateTo("/")}
          className={`cursor-pointer transition-all ${isActive("/") ? "underline font-medium" : "hover:underline"}`}
        >
          🎨 Quick Vibe
        </button>
        <button
          onClick={() => navigateTo("/my-vibes")}
          className={`cursor-pointer transition-all ${isActive("/my-vibes") ? "underline font-medium" : "hover:underline"}`}
        >
          🌈 My Vibes
        </button>
        <button
          onClick={() => navigateTo("/about")}
          className={`cursor-pointer transition-all ${isActive("/about") ? "underline font-medium" : "hover:underline"}`}
        >
          📚 About
        </button>

        {user ? (
          <>
            <span className="opacity-70 hidden lg:inline">
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
      
      {/* Mobile navigation menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-black/90 backdrop-blur-lg p-4 flex flex-col gap-4 md:hidden border-t border-white/10 animate-fadeIn">
          <button
            onClick={() => navigateTo("/")}
            className={`cursor-pointer py-2 ${isActive("/") ? "underline font-medium" : ""}`}
          >
            🎨 Quick Vibe
          </button>
          <button
            onClick={() => navigateTo("/my-vibes")}
            className={`cursor-pointer py-2 ${isActive("/my-vibes") ? "underline font-medium" : ""}`}
          >
            🌈 My Vibes
          </button>
          <button
            onClick={() => navigateTo("/about")}
            className={`cursor-pointer py-2 ${isActive("/about") ? "underline font-medium" : ""}`}
          >
            📚 About
          </button>
          
          {user ? (
            <div className="flex flex-col gap-2 border-t border-white/10 pt-2">
              <span className="opacity-70 text-center">
                Hi, {user.displayName || user.email}
              </span>
              <button
                onClick={() => {
                  signOut(getAuth());
                  router.refresh();
                  setMobileMenuOpen(false);
                }}
                className="text-red-300 hover:underline cursor-pointer py-2"
              >
                🚪 Logout
              </button>
            </div>
          ) : (
            <div className="border-t border-white/10 pt-2 text-center">
              <AuthButton />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
