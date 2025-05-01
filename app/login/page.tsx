"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Loader2, Phone } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { saveToStorage } from "@/lib/storage-service";
import Cookies from "js-cookie";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  // Set authentication header when component mounts
  useEffect(() => {
    const authData = localStorage.getItem("finai-auth");
    if (authData) {
      const parsedData = JSON.parse(authData);
      if (parsedData.isLoggedIn) {
        // Set the auth header
        document.documentElement.style.setProperty(
          "--auth-status",
          "authenticated"
        );
      }
    }
  }, []);

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError("");

    // Validate phone number format
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid phone number");
      setIsProcessing(false);
      return;
    }

    // Simulate OTP sending
    setTimeout(() => {
      setIsOtpSent(true);
      setIsProcessing(false);
    }, 1000);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError("");

    // For demo, accept any 6-digit code
    if (otp.length === 6 && /^\d+$/.test(otp)) {
      // Create auth state in local storage
      const authData = {
        isLoggedIn: true,
        phone: phoneNumber,
        loginTime: new Date().toISOString(),
      };

      // Save auth state
      saveToStorage("finai-auth", authData);

      // Set authentication cookie
      Cookies.set("finai-auth", "true", { expires: 7 }); // Expires in 7 days

      // Create a default wallet if it doesn't exist
      const walletData = {
        publicKey: "GC2XCX56TSIPMYKCCYJUBDA6BJZ5ISKXJCFR5AVZLHZX3TCE5EKMRJJL",
        secretKey: "SDZOPOJCPA4IQTI3SDQA7XOHQYFXYVAFKOH3ITSX2TUTXTKFDCFEWKFP",
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

      // Save wallet data
      saveToStorage("finai-wallet", walletData);

      // Store the private key securely
      saveToStorage("finai-private-key", { key: walletData.secretKey });

      // Set the auth header
      document.documentElement.style.setProperty(
        "--auth-status",
        "authenticated"
      );

      // Dispatch event to notify other components
      const event = new Event("storage-updated");
      window.dispatchEvent(event);

      // Use the login function from useAuth
      login(phoneNumber);

      // Force navigation to chat page
      router.push("/chat");
    } else {
      setError("Invalid OTP. Please enter a 6-digit number.");
      setIsProcessing(false);
    }
  };

  const handleDemoLogin = () => {
    setIsProcessing(true);

    // Create auth state in local storage
    const authData = {
      isLoggedIn: true,
      phone: "1234567890",
      loginTime: new Date().toISOString(),
    };

    // Save auth state
    saveToStorage("finai-auth", authData);

    // Set authentication cookie
    Cookies.set("finai-auth", "true", { expires: 7 }); // Expires in 7 days

    // Create a default wallet if it doesn't exist
    const walletData = {
      publicKey: "GC2XCX56TSIPMYKCCYJUBDA6BJZ5ISKXJCFR5AVZLHZX3TCE5EKMRJJL",
      secretKey: "SDZOPOJCPA4IQTI3SDQA7XOHQYFXYVAFKOH3ITSX2TUTXTKFDCFEWKFP",
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

    // Save wallet data
    saveToStorage("finai-wallet", walletData);

    // Store the private key securely
    saveToStorage("finai-private-key", { key: walletData.secretKey });

    // Set the auth header
    document.documentElement.style.setProperty(
      "--auth-status",
      "authenticated"
    );

    // Dispatch event to notify other components
    const event = new Event("storage-updated");
    window.dispatchEvent(event);

    // Use the login function from useAuth
    login("1234567890");

    // Force navigation to chat page
    router.push("/chat");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-950 dark:to-gray-900 p-4">
      <Card className="w-full max-w-md border-indigo-200 dark:border-indigo-800 shadow-xl">
        <CardHeader className="space-y-1 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-center">
            FinAI
          </CardTitle>
          <CardDescription className="text-center text-teal-100">
            Sign in to access your financial assistant
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-6">
            <Button
              className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white"
              onClick={handleDemoLogin}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Demo Login (Hackathon)"
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground mt-2">
              Click above to instantly access all features
            </p>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or use phone login
              </span>
            </div>
          </div>

          {!isOtpSent ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex">
                  <div className="flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="rounded-l-none"
                    required
                  />
                </div>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">One-Time Password</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  For demo purposes, use any 6-digit code
                </p>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsOtpSent(false)}
                  disabled={isProcessing}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            By logging in, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
