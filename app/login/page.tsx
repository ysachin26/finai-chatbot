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
import {
  Loader2,
  Lock,
  Smartphone,
  Mail,
  Github,
  ChromeIcon as Google,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggedIn, isLoading } = useAuth();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [loginMethod, setLoginMethod] = useState<"phone" | "email">("phone");

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn && !isLoading) {
      router.push("/chat");
    }
  }, [isLoggedIn, isLoading, router]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError("");

    // Simulate sending OTP
    setTimeout(() => {
      setIsProcessing(false);
      setStep("otp");

      // For demo purposes, show the OTP code (in a real app, this would be sent via SMS)
      console.log("Demo OTP code: 123456");
    }, 1500);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError("");

    // Simulate verifying OTP
    setTimeout(() => {
      setIsProcessing(false);

      // For demo purposes, any 6-digit code works
      if (otp.length === 6) {
        // Use the login function from useAuth
        login(phoneNumber);
      } else {
        setError("Invalid OTP. Please try again.");
      }
    }, 1500);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError("");

    // Simulate email login
    setTimeout(() => {
      setIsProcessing(false);

      // For demo purposes, any email with password works
      if (email && password) {
        // Use the login function from useAuth
        login(email);
      } else {
        setError("Please enter both email and password.");
      }
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
    setIsProcessing(true);
    setError("");

    // Simulate social login
    setTimeout(() => {
      setIsProcessing(false);
      login(`${provider}-user@example.com`);
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-950 dark:to-gray-900 p-4">
      <Card className="w-full max-w-md border-indigo-200 dark:border-indigo-800 shadow-xl">
        <CardHeader className="space-y-1 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-center">
            FinAI
          </CardTitle>
          <CardDescription className="text-center text-indigo-100">
            Sign in to access your financial assistant
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs
            defaultValue="phone"
            onValueChange={(value) =>
              setLoginMethod(value as "phone" | "email")
            }
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="phone">Phone</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
            </TabsList>

            <TabsContent value="phone">
              {step === "phone" ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-indigo-800 dark:text-indigo-300"
                    >
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-2.5 h-5 w-5 text-indigo-500" />
                      <Input
                        id="phone"
                        placeholder="+1234567890"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="pl-10 border-indigo-200 dark:border-indigo-800 focus-visible:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
                    disabled={isProcessing || !phoneNumber}
                  >
                    {isProcessing ? (
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
                      className="text-indigo-800 dark:text-indigo-300"
                    >
                      One-Time Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-indigo-500" />
                      <Input
                        id="otp"
                        placeholder="123456"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        className="pl-10 border-indigo-200 dark:border-indigo-800 focus-visible:ring-indigo-500"
                        required
                      />
                    </div>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400">
                      For demo purposes, enter any 6 digits (e.g., 123456)
                    </p>
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
                    disabled={isProcessing || otp.length !== 6}
                  >
                    {isProcessing ? (
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
                    className="w-full text-indigo-600 dark:text-indigo-400"
                    onClick={() => setStep("phone")}
                    disabled={isProcessing}
                  >
                    Back to Phone Number
                  </Button>
                </form>
              )}
            </TabsContent>

            <TabsContent value="email">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-indigo-800 dark:text-indigo-300"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-indigo-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 border-indigo-200 dark:border-indigo-800 focus-visible:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-indigo-800 dark:text-indigo-300"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-indigo-500" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 border-indigo-200 dark:border-indigo-800 focus-visible:ring-indigo-500"
                      required
                    />
                  </div>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400">
                    For demo purposes, enter any password
                  </p>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
                  disabled={isProcessing || !email || !password}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialLogin("google")}
              disabled={isProcessing}
              className="border-indigo-200 dark:border-indigo-800"
            >
              <Google className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialLogin("github")}
              disabled={isProcessing}
              className="border-indigo-200 dark:border-indigo-800"
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-indigo-100 dark:border-indigo-900 pt-4">
          <p className="text-xs text-indigo-500 dark:text-indigo-400 text-center">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
