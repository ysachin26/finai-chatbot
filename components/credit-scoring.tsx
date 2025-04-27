"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, RefreshCw, Loader2, Shield } from "lucide-react"
import { getFromStorage } from "@/lib/storage-service"
import { useToast } from "@/components/ui/use-toast"

export function CreditScoring() {
  const [score, setScore] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [walletData, setWalletData] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Load wallet data
    const savedWallet = getFromStorage("finai-wallet", null)
    if (savedWallet) {
      setWalletData(savedWallet)
    }
  }, [])

  const calculateScore = () => {
    setIsLoading(true)

    // Check if wallet exists
    if (!walletData || walletData.status !== "created") {
      toast({
        title: "Wallet Required",
        description: "Please create a wallet first to generate a credit score.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Simulate AI-based credit scoring
    setTimeout(() => {
      // Factors that influence the score:
      // 1. Wallet balance
      // 2. Transaction history length
      // 3. Transaction frequency
      // 4. Transaction amounts

      const balance = Number.parseFloat(walletData.balance)
      const txCount = walletData.transactionHistory.length

      // Base score between 300-850 (standard credit score range)
      let baseScore = 550

      // Balance factor (higher balance = higher score)
      if (balance > 50) baseScore += 100
      else if (balance > 20) baseScore += 50
      else if (balance > 5) baseScore += 25

      // Transaction history factor
      if (txCount > 10) baseScore += 100
      else if (txCount > 5) baseScore += 50
      else if (txCount > 0) baseScore += 25

      // Add some randomness
      const randomFactor = Math.floor(Math.random() * 50)

      // Calculate final score (capped at 850)
      const finalScore = Math.min(850, baseScore + randomFactor)

      setScore(finalScore)
      setIsLoading(false)

      toast({
        title: "Credit Score Generated",
        description: "Your blockchain-based credit score has been calculated.",
      })
    }, 2000)
  }

  const getScoreCategory = () => {
    if (!score) return ""
    if (score >= 750) return "Excellent"
    if (score >= 650) return "Good"
    if (score >= 550) return "Fair"
    return "Needs Improvement"
  }

  const getScoreColor = () => {
    if (!score) return ""
    if (score >= 750) return "text-green-500"
    if (score >= 650) return "text-blue-500"
    if (score >= 550) return "text-amber-500"
    return "text-red-500"
  }

  const getScoreBadgeColor = () => {
    if (!score) return ""
    if (score >= 750) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
    if (score >= 650) return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
    if (score >= 550) return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
  }

  return (
    <Card className="border-indigo-200 dark:border-indigo-800">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          AI Credit Scoring
        </CardTitle>
        <CardDescription className="text-indigo-100">Get your blockchain-based credit score</CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {score ? (
          <>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2 cosmic-pulse">
                <span className={getScoreColor()}>{score}</span>
              </div>
              <Badge variant="outline" className={getScoreBadgeColor()}>
                {getScoreCategory()}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>300</span>
                <span>850</span>
              </div>
              <Progress value={(score / 850) * 100} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Poor</span>
                <span>Fair</span>
                <span>Good</span>
                <span>Excellent</span>
              </div>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
              <h3 className="font-medium text-indigo-900 dark:text-indigo-100 mb-2">Score Factors</h3>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-indigo-500" />
                  <span>Wallet balance: {walletData?.balance || 0} XLM</span>
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-indigo-500" />
                  <span>Transaction history: {walletData?.transactionHistory?.length || 0} transactions</span>
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-indigo-500" />
                  <span>Account activity and patterns</span>
                </li>
              </ul>
            </div>

            <Button
              onClick={calculateScore}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Recalculate Score
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="text-center py-6">
              <Shield className="h-16 w-16 mx-auto mb-4 text-indigo-200 dark:text-indigo-800" />
              <h3 className="text-lg font-medium text-indigo-900 dark:text-indigo-100 mb-2">Get Your Credit Score</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Our AI analyzes your wallet activity to generate a blockchain-based credit score that could be used for
                future financial services.
              </p>
            </div>

            <Button
              onClick={calculateScore}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                "Generate Credit Score"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
