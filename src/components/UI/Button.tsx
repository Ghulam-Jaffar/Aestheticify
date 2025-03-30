"use client";

import React, { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  theme?: "light" | "dark";
  className?: string;
}

export default function Button({
  children,
  onClick,
  className = "",
  theme = "dark",
  ...rest
}: ButtonProps) {
  const baseStyle = `px-4 py-2 rounded-lg backdrop-blur transition cursor-pointer font-semibold`;
  const themeStyle =
    theme === "light"
      ? "bg-black/10 text-black hover:bg-black/20"
      : "bg-white/10 text-white hover:bg-white/20";

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${themeStyle} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
