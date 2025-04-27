"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { saveToStorage, getFromStorage, STORAGE_KEYS } from "@/lib/storage-service"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  CheckCircle,
  User,
  Bell,
  Shield,
  Globe,
  Wallet,
  BookOpen,
  Loader2,
  CreditCard,
  ImagePlus,
  Trash2,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import LoginRedirect from "@/components/login-redirect"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface UserProfile {
  name: string
  email: string
  phone: string
  language: string
  currency: string
  notifications: {
    transactions: boolean
    marketing: boolean
    security: boolean
  }
  securityLevel: "basic" | "medium" | "high"
  learningProgress: number
  walletConnected: boolean
  profileImage?: string
}

interface WalletData {
  publicKey: string
  balance: string
  transactionHistory: any[]
  status: "loading" | "none" | "created"
}

export default function ProfilePage() {
  const { isLoggedIn, isLoading: authLoading, logout } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [walletData, setWalletData] = useState<WalletData | null>(null)
  const [profile, setProfile] = useState<UserProfile>({
    name: "Demo User",
    email: "user@example.com",
    phone: "+1234567890",
    language: "English",
    currency: "USD",
    notifications: {
      transactions: true,
      marketing: false,
      security: true,
    },
    securityLevel: "medium",
    learningProgress: 20,
    walletConnected: true,
  })

  // Simulate loading profile data
  useEffect(() => {
    if (!isLoggedIn) return

    setIsLoading(true)

    // Try to load profile from storage
    const savedProfile = getFromStorage<UserProfile | null>("finai-user-profile", null)

    // Load wallet data
    const savedWallet = getFromStorage<WalletData | null>(STORAGE_KEYS.WALLET, null)
    if (savedWallet) {
      setWalletData(savedWallet)
    }

    setTimeout(() => {
      if (savedProfile) {
        setProfile(savedProfile)
      }
      setIsLoading(false)
    }, 1000)
  }, [isLoggedIn])

  const handleSaveProfile = () => {
    setIsSaving(true)

    // Save profile to storage
    saveToStorage("finai-user-profile", profile)

    setTimeout(() => {
      setIsSaving(false)
      setShowSuccess(true)

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    }, 1500)
  }

  const handleLogout = () => {
    logout()
  }

  const handleDeleteAccount = () => {
    // In a real app, this would delete the account from the server
    // For now, just clear local storage and log out
    localStorage.clear()
    logout()
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        // Update profile with the data URL of the image
        setProfile((prev) => ({
          ...prev,
          profileImage: reader.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    )
  }

  if (!isLoggedIn) {
    return <LoginRedirect />
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-1/3 space-y-6">
          <Card className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950 dark:to-emerald-950 border-teal-200 dark:border-teal-800">
            <CardHeader className="pb-4">
              <div className="flex justify-center mb-4 relative group">
                <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-800 shadow-lg">
                  <AvatarImage src={profile.profileImage || "/placeholder.svg?height=96&width=96"} alt={profile.name} />
                  <AvatarFallback className="text-2xl bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-100">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="profile-image"
                  className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                >
                  <ImagePlus className="h-8 w-8" />
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              <CardTitle className="text-center text-2xl">{profile.name}</CardTitle>
              <CardDescription className="text-center text-teal-600 dark:text-teal-400">
                {profile.email}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400" />
                    <span className="text-sm font-medium">Security Level</span>
                  </div>
                  <Badge
                    className={
                      profile.securityLevel === "high"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : profile.securityLevel === "medium"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                    }
                  >
                    {profile.securityLevel.charAt(0).toUpperCase() + profile.securityLevel.slice(1)}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400" />
                    <span className="text-sm font-medium">Learning Progress</span>
                  </div>
                  <span className="text-sm">{profile.learningProgress}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Wallet className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400" />
                    <span className="text-sm font-medium">Wallet Status</span>
                  </div>
                  <Badge
                    className={
                      walletData && walletData.status === "created"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
                    }
                  >
                    {walletData && walletData.status === "created" ? "Connected" : "Not Connected"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400" />
                    <span className="text-sm font-medium">Language</span>
                  </div>
                  <span className="text-sm">{profile.language}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="space-y-4">
              <Button
                variant="destructive"
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                onClick={handleLogout}
              >
                Log Out
              </Button>

              <Button
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </CardFooter>
          </Card>

          {walletData && walletData.status === "created" && (
            <Card className="border-teal-200 dark:border-teal-800">
              <CardHeader className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Wallet className="h-5 w-5" />
                  Wallet Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Balance:</span>
                  <span className="font-medium text-teal-600 dark:text-teal-400">{walletData.balance} XLM</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Estimated Value:</span>
                  <span className="font-medium text-teal-600 dark:text-teal-400">
                    ${(Number.parseFloat(walletData.balance) * 0.11).toFixed(2)} USD
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Transactions:</span>
                  <span className="font-medium text-teal-600 dark:text-teal-400">
                    {walletData.transactionHistory.length}
                  </span>
                </div>

                <div className="pt-2">
                  <Button
                    variant="outline"
                    className="w-full border-teal-200 text-teal-600 hover:text-teal-700 hover:bg-teal-50 dark:border-teal-800 dark:text-teal-400 dark:hover:bg-teal-900/30"
                    onClick={() => router.push("/wallet")}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Manage Wallet
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="w-full md:w-2/3">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your account settings and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger
                    value="personal"
                    className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-900 dark:data-[state=active]:bg-teal-900 dark:data-[state=active]:text-teal-50"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Personal
                  </TabsTrigger>
                  <TabsTrigger
                    value="preferences"
                    className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-900 dark:data-[state=active]:bg-teal-900 dark:data-[state=active]:text-teal-50"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Preferences
                  </TabsTrigger>
                  <TabsTrigger
                    value="notifications"
                    className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-900 dark:data-[state=active]:bg-teal-900 dark:data-[state=active]:text-teal-50"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="border-gray-200 dark:border-gray-700 focus-visible:ring-teal-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="border-gray-200 dark:border-gray-700 focus-visible:ring-teal-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="border-gray-200 dark:border-gray-700 focus-visible:ring-teal-500"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="preferences" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <select
                        id="language"
                        value={profile.language}
                        onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                        className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                        <option value="Chinese">Chinese</option>
                        <option value="Japanese">Japanese</option>
                        <option value="Arabic">Arabic</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <select
                        id="currency"
                        value={profile.currency}
                        onChange={(e) => setProfile({ ...profile, currency: e.target.value })}
                        className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="JPY">JPY - Japanese Yen</option>
                        <option value="CNY">CNY - Chinese Yuan</option>
                        <option value="INR">INR - Indian Rupee</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Security Level</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={profile.securityLevel === "basic" ? "default" : "outline"}
                        className={profile.securityLevel === "basic" ? "bg-teal-600 hover:bg-teal-700 text-white" : ""}
                        onClick={() => setProfile({ ...profile, securityLevel: "basic" })}
                      >
                        Basic
                      </Button>
                      <Button
                        variant={profile.securityLevel === "medium" ? "default" : "outline"}
                        className={profile.securityLevel === "medium" ? "bg-teal-600 hover:bg-teal-700 text-white" : ""}
                        onClick={() => setProfile({ ...profile, securityLevel: "medium" })}
                      >
                        Medium
                      </Button>
                      <Button
                        variant={profile.securityLevel === "high" ? "default" : "outline"}
                        className={profile.securityLevel === "high" ? "bg-teal-600 hover:bg-teal-700 text-white" : ""}
                        onClick={() => setProfile({ ...profile, securityLevel: "high" })}
                      >
                        High
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="transactions">Transaction Alerts</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Receive notifications for all transactions
                        </p>
                      </div>
                      <Switch
                        id="transactions"
                        checked={profile.notifications.transactions}
                        onCheckedChange={(checked) =>
                          setProfile({
                            ...profile,
                            notifications: { ...profile.notifications, transactions: checked },
                          })
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="security">Security Alerts</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Get notified about security events</p>
                      </div>
                      <Switch
                        id="security"
                        checked={profile.notifications.security}
                        onCheckedChange={(checked) =>
                          setProfile({
                            ...profile,
                            notifications: { ...profile.notifications, security: checked },
                          })
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="marketing">Marketing</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates about new features</p>
                      </div>
                      <Switch
                        id="marketing"
                        checked={profile.notifications.marketing}
                        onCheckedChange={(checked) =>
                          setProfile({
                            ...profile,
                            notifications: { ...profile.notifications, marketing: checked },
                          })
                        }
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              {showSuccess && (
                <Alert className="mr-4 flex-1 bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-100 border-green-200 dark:border-green-800/50">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <AlertDescription>Your profile has been updated successfully!</AlertDescription>
                </Alert>
              )}
              <Button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Delete Account Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your account and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700 text-white">
              Yes, Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
