"use client";
import { loginWithGoogle, logout } from "@/utils/auth";
import useAuth from "@/hooks/useAuth";
import Button from "./UI/Button";

export default function AuthButton() {
  const user = useAuth();

  return user ? (
    <div className="flex items-center gap-2 cursor-pointer">
      <span>{user.displayName}</span>
      <Button onClick={logout}>Log Out</Button>
    </div>
  ) : (
    <Button onClick={loginWithGoogle}>Sign in with Google</Button>
  );
}
