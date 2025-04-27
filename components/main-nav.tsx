"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Moon,
  Sun,
  MessageSquare,
  Wallet,
  BookOpen,
  User,
  LogOut,
  LogIn,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { getFromStorage } from "@/lib/storage-service";

export function MainNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { isLoggedIn, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [walletBalance, setWalletBalance] = useState<string | null>(null);

  // After mounting, we can access localStorage
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load wallet data whenever login state changes or component mounts
  useEffect(() => {
    if (isLoggedIn && mounted) {
      const walletData = getFromStorage("finai-wallet", null);
      if (walletData && walletData.status === "created") {
        setWalletBalance(walletData.balance);
      }
    }
  }, [isLoggedIn, mounted]);

  // Add event listener for storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      if (isLoggedIn) {
        const walletData = getFromStorage("finai-wallet", null);
        if (walletData && walletData.status === "created") {
          setWalletBalance(walletData.balance);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("storage-updated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("storage-updated", handleStorageChange);
    };
  }, [isLoggedIn]);

  // Toggle theme between light and dark
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Only render theme toggle after mounting to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Link
            href="/"
            className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mr-8"
          >
            FinAI
          </Link>
        </div>
        <div className="w-9 h-9"></div> {/* Placeholder for theme toggle */}
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <Link href="/" className="text-xl font-bold gradient-text mr-8">
          FinAI
        </Link>
        <nav className="hidden md:flex space-x-4">
          {isLoggedIn ? (
            <>
              <Link
                href="/chat"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === "/chat"
                    ? "bg-indigo-100 text-indigo-900 dark:bg-indigo-900 dark:text-indigo-100"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                <span className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat
                </span>
              </Link>
              <Link
                href="/wallet"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === "/wallet"
                    ? "bg-indigo-100 text-indigo-900 dark:bg-indigo-900 dark:text-indigo-100"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                <span className="flex items-center">
                  <Wallet className="h-4 w-4 mr-2" />
                  Wallet
                  {walletBalance && (
                    <span className="ml-2 text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100 px-2 py-0.5 rounded-full">
                      {Number.parseFloat(walletBalance).toFixed(2)} XLM
                    </span>
                  )}
                </span>
              </Link>
            </>
          ) : null}
          <Link
            href="/learn"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              pathname === "/learn"
                ? "bg-indigo-100 text-indigo-900 dark:bg-indigo-900 dark:text-indigo-100"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            <span className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              Learn
            </span>
          </Link>
        </nav>
      </div>

      <div className="flex items-center space-x-2">
        {isLoggedIn ? (
          <>
            <Link
              href="/profile"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === "/profile"
                  ? "bg-indigo-100 text-indigo-900 dark:bg-indigo-900 dark:text-indigo-100"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              <span className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Profile
              </span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </>
        ) : (
          <Link href="/login">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Button>
          </Link>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full w-9 h-9 p-0 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}
