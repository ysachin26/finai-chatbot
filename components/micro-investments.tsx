"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Coins, TrendingUp, Loader2 } from "lucide-react"
import { getFromStorage, saveToStorage } from "@/lib/storage-service"
import { useToast } from "@/components/ui/use-toast"

export function MicroInvestments() {
  const [amount, setAmount] = useState(1)
  const [isInvesting, setIsInvesting] = useState(false)
  const { toast } = useToast()

  const handleInvest = () => {
    setIsInvesting(true)

    // Get wallet data
    const walletData = getFromStorage("finai-wallet", null)

    if (!walletData || walletData.status !== "created") {
      toast({
        title: "Wallet Required",
        description: "Please create a wallet first to use micro-investments.",
        variant: "destructive",
      })
      setIsInvesting(false)
      return
    }

    // Check if we have enough balance
    const currentBalance = Number.parseFloat(walletData.balance)

    if (amount > currentBalance) {
      toast({
        title: "Insufficient Balance",
        description: `You don't have enough XLM. Your current balance is ${currentBalance} XLM.`,
        variant: "destructive",
      })
      setIsInvesting(false)
      return
    }

    // Simulate investment
    setTimeout(() => {
      // Update wallet data
      const newBalance = (currentBalance - amount).toFixed(7)
      const updatedWallet = {
        ...walletData,
        balance: newBalance,
        transactionHistory: [
          {
            id: `tx${walletData.transactionHistory.length + 1}`,
            type: "sent",
            amount: amount.toString(),
            to: "Micro-Investment Fund",
            timestamp: new Date().toISOString(),
          },
          ...walletData.transactionHistory,
        ],
      }

      // Save updated wallet
      saveToStorage("finai-wallet", updatedWallet)

      // Dispatch event to notify other components
      const event = new Event("storage-updated")
      window.dispatchEvent(event)

      // Show success message
      toast({
        title: "Investment Successful",
        description: `You've invested ${amount} XLM in the micro-investment fund.`,
      })

      setIsInvesting(false)
    }, 1500)
  }

  return (
    <Card className="border-indigo-200 dark:border-indigo-800">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5" />
          Micro-Investments
        </CardTitle>
        <CardDescription className="text-indigo-100">Invest small amounts of XLM for potential growth</CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="investment-amount">Investment Amount (XLM)</Label>
            <div className="text-indigo-600 dark:text-indigo-400 font-medium">{amount} XLM</div>
          </div>
          <Slider
            id="investment-amount"
            min={0.1}
            max={10}
            step={0.1}
            value={[amount]}
            onValueChange={(value) => setAmount(value[0])}
            className="py-4"
          />
        </div>

        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
          <h3 className="font-medium text-indigo-900 dark:text-indigo-100 mb-2">Potential Returns</h3>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <div className="text-gray-500 dark:text-gray-400">1 Month</div>
              <div className="font-medium text-indigo-600 dark:text-indigo-400 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                {(amount * 1.02).toFixed(2)} XLM
              </div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400">6 Months</div>
              <div className="font-medium text-indigo-600 dark:text-indigo-400 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                {(amount * 1.15).toFixed(2)} XLM
              </div>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400">1 Year</div>
              <div className="font-medium text-indigo-600 dark:text-indigo-400 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                {(amount * 1.35).toFixed(2)} XLM
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={handleInvest}
          disabled={isInvesting || amount <= 0}
          className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
        >
          {isInvesting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Invest Now"
          )}
        </Button>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Micro-investments allow you to invest small amounts of XLM in a diversified portfolio. Returns are not
          guaranteed and will vary based on market conditions.
        </p>
      </CardContent>
    </Card>
  )
}
