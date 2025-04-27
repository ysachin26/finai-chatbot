"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { TrendingUp, Zap, Shield, Wallet, BookOpen } from "lucide-react"
import { getFromStorage, saveToStorage } from "@/lib/storage-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface BadgeType {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  earned: boolean
  progress: number
  maxProgress: number
}

export function RewardsSystem() {
  const [badges, setBadges] = useState<BadgeType[]>([
    {
      id: "wallet_creator",
      name: "Wallet Creator",
      description: "Created your first Stellar wallet",
      icon: <Wallet className="h-5 w-5 text-indigo-500" />,
      earned: false,
      progress: 0,
      maxProgress: 1,
    },
    {
      id: "transaction_master",
      name: "Transaction Master",
      description: "Completed 5 transactions",
      icon: <Zap className="h-5 w-5 text-amber-500" />,
      earned: false,
      progress: 0,
      maxProgress: 5,
    },
    {
      id: "savings_hero",
      name: "Savings Hero",
      description: "Maintained a balance of over 50 XLM",
      icon: <TrendingUp className="h-5 w-5 text-green-500" />,
      earned: false,
      progress: 0,
      maxProgress: 50,
    },
    {
      id: "security_expert",
      name: "Security Expert",
      description: "Completed the security checklist",
      icon: <Shield className="h-5 w-5 text-red-500" />,
      earned: false,
      progress: 0,
      maxProgress: 4,
    },
    {
      id: "financial_scholar",
      name: "Financial Scholar",
      description: "Completed 3 learning modules",
      icon: <BookOpen className="h-5 w-5 text-blue-500" />,
      earned: false,
      progress: 0,
      maxProgress: 3,
    },
  ])

  useEffect(() => {
    // Load saved badges
    const savedBadges = getFromStorage<BadgeType[]>("finai-badges", null)
    if (savedBadges) {
      setBadges(savedBadges)
    }

    // Check for badge progress
    updateBadgeProgress()
  }, [])

  const updateBadgeProgress = () => {
    // Get wallet data
    const walletData = getFromStorage("finai-wallet", null)

    // Get learning progress
    const learningProgress = getFromStorage("finai-learning-progress", [])

    // Update badges based on user data
    const updatedBadges = [...badges]

    // Wallet Creator badge
    if (walletData && walletData.status === "created") {
      updatedBadges[0].progress = 1
      updatedBadges[0].earned = true
    }

    // Transaction Master badge
    if (walletData && walletData.transactionHistory) {
      const txCount = walletData.transactionHistory.length
      updatedBadges[1].progress = Math.min(txCount, 5)
      updatedBadges[1].earned = txCount >= 5
    }

    // Savings Hero badge
    if (walletData && walletData.balance) {
      const balance = Number.parseFloat(walletData.balance)
      updatedBadges[2].progress = Math.min(balance, 50)
      updatedBadges[2].earned = balance >= 50
    }

    // Security Expert badge
    const securityChecks = getFromStorage("finai-security-checks", [])
    updatedBadges[3].progress = securityChecks.length
    updatedBadges[3].earned = securityChecks.length >= 4

    // Financial Scholar badge
    updatedBadges[4].progress = learningProgress.length
    updatedBadges[4].earned = learningProgress.length >= 3

    setBadges(updatedBadges)
    saveToStorage("finai-badges", updatedBadges)
  }

  return (
    <Card className="w-full bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950 border-indigo-200 dark:border-indigo-800">
      <CardHeader>
        <CardTitle className="text-indigo-700 dark:text-indigo-300">Rewards & Achievements</CardTitle>
        <CardDescription>Earn badges by using FinAI features and practicing good financial habits</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {badges.map((badge) => (
            <div key={badge.id} className="flex items-center space-x-4">
              <div
                className={`p-2 rounded-full ${badge.earned ? "bg-indigo-100 dark:bg-indigo-900" : "bg-gray-100 dark:bg-gray-800"}`}
              >
                {badge.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">
                    {badge.name}
                    {badge.earned && <Badge className="ml-2 bg-indigo-500 text-white">Earned</Badge>}
                  </h4>
                  <span className="text-sm text-gray-500">
                    {badge.progress}/{badge.maxProgress}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{badge.description}</p>
                <Progress value={(badge.progress / badge.maxProgress) * 100} className="h-2 mt-1" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
