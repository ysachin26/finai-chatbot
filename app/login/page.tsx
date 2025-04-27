"use client";

import type React from "react";

import { useState } from "react";
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
import { Loader2, Lock, Smartphone } from "lucide-react";
import { saveToStorage } from "@/lib/storage-service";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate sending OTP
    setTimeout(() => {
      setIsLoading(false);
      setStep("otp");

      // For demo purposes, show the OTP code (in a real app, this would be sent via SMS)
      console.log("Demo OTP code: 123456");
    }, 1500);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate verifying OTP
    setTimeout(() => {
      setIsLoading(false);

      // For demo purposes, any 6-digit code works
      if (otp.length === 6) {
        // Save login state
        const authData = {
          isLoggedIn: true,
          phone: phoneNumber,
          loginTime: new Date().toISOString(),
        };
        saveToStorage("finai-auth", authData);

        // Set cookie for server-side authentication
        document.cookie = `finai-auth=${JSON.stringify(
          authData
        )}; path=/; max-age=86400`; // 24 hours

        router.push("/chat");
      } else {
        setError("Invalid OTP. Please try again.");
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-gray-950 dark:to-gray-900 p-4">
      <Card className="w-full max-w-md border-teal-200 dark:border-teal-800 shadow-xl">
        <CardHeader className="space-y-1 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-center">
            FinAI
          </CardTitle>
          <CardDescription className="text-center text-teal-100">
            {step === "phone"
              ? "Enter your phone number to receive a one-time password"
              : "Enter the 6-digit code sent to your phone"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {step === "phone" ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-teal-800 dark:text-teal-300"
                >
                  Phone Number
                </Label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-2.5 h-5 w-5 text-teal-500" />
                  <Input
                    id="phone"
                    placeholder="+1234567890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-10 border-teal-200 dark:border-teal-800 focus-visible:ring-teal-500"
                    required
                  />
                </div>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white"
                disabled={isLoading || !phoneNumber}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  "Send Code"
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="otp"
                  className="text-teal-800 dark:text-teal-300"
                >
                  One-Time Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-teal-500" />
                  <Input
                    id="otp"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="pl-10 border-teal-200 dark:border-teal-800 focus-visible:ring-teal-500"
                    required
                  />
                </div>
                <p className="text-xs text-teal-600 dark:text-teal-400">
                  For demo purposes, enter any 6 digits (e.g., 123456)
                </p>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Login"
                )}
              </Button>
              <Button
                type="button"
                variant="link"
                className="w-full text-teal-600 dark:text-teal-400"
                onClick={() => setStep("phone")}
                disabled={isLoading}
              >
                Back to Phone Number
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t border-teal-100 dark:border-teal-900 pt-4">
          <p className="text-xs text-teal-500 dark:text-teal-400 text-center">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
