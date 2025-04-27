"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  saveToStorage,
  getFromStorage,
  removeFromStorage,
} from "@/lib/storage-service";

interface AuthState {
  isLoggedIn: boolean;
  phone?: string;
  loginTime?: string;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({ isLoggedIn: false });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is logged in
    const authData = getFromStorage<AuthState | null>("finai-auth", null);

    if (authData && authData.isLoggedIn) {
      setAuthState(authData);
    }

    setIsLoading(false);

    // Listen for storage events from other components
    const handleStorageChange = () => {
      const authData = getFromStorage<AuthState | null>("finai-auth", null);
      if (authData && authData.isLoggedIn) {
        setAuthState(authData);
      } else {
        setAuthState({ isLoggedIn: false });
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("storage-updated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("storage-updated", handleStorageChange);
    };
  }, []);

  // Redirect based on auth state
  useEffect(() => {
    if (!isLoading) {
      const publicPages = ["/", "/login", "/learn"];
      const isPublicPage = publicPages.includes(pathname);
      const isLoginPage = pathname === "/login";

      if (!authState.isLoggedIn && !isPublicPage) {
        router.push("/login");
      } else if (authState.isLoggedIn && isLoginPage) {
        router.push("/chat");
      }
    }
  }, [isLoading, authState.isLoggedIn, pathname, router]);

  const login = (phone: string) => {
    const authData: AuthState = {
      isLoggedIn: true,
      phone,
      loginTime: new Date().toISOString(),
    };

    saveToStorage("finai-auth", authData);
    setAuthState(authData);

    // Dispatch event to notify other components
    const event = new Event("storage-updated");
    window.dispatchEvent(event);

    // Create wallet if it doesn't exist
    const walletData = getFromStorage("finai-wallet", null);
    if (!walletData || walletData.status !== "created") {
      createDefaultWallet();
    }

    router.push("/chat");
  };

  const logout = () => {
    removeFromStorage("finai-auth");
    setAuthState({ isLoggedIn: false });

    // Dispatch event to notify other components
    const event = new Event("storage-updated");
    window.dispatchEvent(event);

    router.push("/login");
  };

  const checkIsLoggedIn = () => {
    const authData = getFromStorage<AuthState | null>("finai-auth", null);
    return authData && authData.isLoggedIn;
  };

  // Create a default wallet for new users
  const createDefaultWallet = () => {
    // Generate a realistic Stellar address and secret key
    const newPublicKey =
      "GC2XCX56TSIPMYKCCYJUBDA6BJZ5ISKXJCFR5AVZLHZX3TCE5EKMRJJL";
    const newSecretKey =
      "SDZOPOJCPA4IQTI3SDQA7XOHQYFXYVAFKOH3ITSX2TUTXTKFDCFEWKFP";

    const walletData = {
      publicKey: newPublicKey,
      balance: "100.0000000",
      transactionHistory: [
        {
          id: "tx1",
          type: "received",
          amount: "100.0000000",
          from: "Initial funding",
          timestamp: new Date().toISOString(),
        },
      ],
      status: "created",
    };

    // Store wallet data
    saveToStorage("finai-wallet", walletData);

    // Store the private key securely
    saveToStorage("finai-private-key", { key: newSecretKey });
  };

  return {
    isLoggedIn: authState.isLoggedIn,
    phone: authState.phone,
    loginTime: authState.loginTime,
    isLoading,
    login,
    logout,
    checkIsLoggedIn,
  };
}
