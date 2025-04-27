"use client";

import React, { createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import {
  saveToStorage,
  getFromStorage,
  removeFromStorage,
} from "@/lib/storage-service";

// Groq API key
const GROQ_API_KEY = "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";

interface AuthState {
  isLoggedIn: boolean;
  phone: string;
  loginTime: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  phone: string;
  loginTime: string;
  isLoading: boolean;
  login: (identifier: string) => void;
  logout: () => void;
  checkIsLoggedIn: () => boolean;
}

// Create the auth context
const AuthContext = createContext<AuthContextType>({
  isLoggedIn: true,
  phone: "default",
  loginTime: new Date().toISOString(),
  isLoading: false,
  login: () => {},
  logout: () => {},
  checkIsLoggedIn: () => true,
});

// Create the auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const value: AuthContextType = {
    isLoggedIn: true,
    phone: "default",
    loginTime: new Date().toISOString(),
    isLoading: false,
    login: (identifier: string) => {
      // Save auth state
      saveToStorage<AuthState>("finai-auth", {
        isLoggedIn: true,
        phone: identifier,
        loginTime: new Date().toISOString(),
      });

      // Save Groq API key
      saveToStorage("groq-api-key", GROQ_API_KEY);

      window.location.href = "/chat";
    },
    logout: () => {
      // Clear all storage
      removeFromStorage("finai-auth");
      removeFromStorage("groq-api-key");
      removeFromStorage("finai-wallet");
      removeFromStorage("finai-chat-sessions");

      // Force reload to clear all state
      window.location.href = "/login";
    },
    checkIsLoggedIn: () => {
      const authData = getFromStorage<AuthState | null>("finai-auth", null);
      return authData?.isLoggedIn ?? false;
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Create the useAuth hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
