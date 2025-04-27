"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Lightbulb } from "lucide-react"

interface FinancialTip {
  id: number
  title: string
  content: string
  category: string
}

export function FinancialSnippet() {
  const tips: FinancialTip[] = [
    {
      id: 1,
      title: "The 50/30/20 Rule",
      content:
        "Allocate 50% of your income to needs, 30% to wants, and 20% to savings and debt repayment for a balanced budget.",
      category: "Budgeting",
    },
    {
      id: 2,
      title: "Emergency Fund",
      content: "Aim to save 3-6 months of living expenses in an easily accessible account for unexpected emergencies.",
      category: "Savings",
    },
    {
      id: 3,
      title: "Compound Interest",
      content:
        "The earlier you start investing, the more you benefit from compound interest. Time is your greatest asset.",
      category: "Investing",
    },
    {
      id: 4,
      title: "Debt Snowball Method",
      content: "Pay off your smallest debts first to build momentum, then tackle larger ones with the freed-up money.",
      category: "Debt Management",
    },
    {
      id: 5,
      title: "Blockchain Security",
      content:
        "Always keep your private keys secure and never share them. Consider using hardware wallets for large crypto holdings.",
      category: "Cryptocurrency",
    },
    {
      id: 6,
      title: "Dollar-Cost Averaging",
      content:
        "Invest a fixed amount regularly regardless of market conditions to reduce the impact of volatility over time.",
      category: "Investing",
    },
    {
      id: 7,
      title: "The Rule of 72",
      content:
        "Divide 72 by your investment's interest rate to estimate how many years it will take for your money to double.",
      category: "Investing",
    },
    {
      id: 8,
      title: "Pay Yourself First",
      content:
        "Automatically transfer a portion of your income to savings or investments before spending on other expenses.",
      category: "Savings",
    },
    {
      id: 9,
      title: "Diversification",
      content:
        "Spread your investments across different asset classes to reduce risk and protect against market downturns.",
      category: "Investing",
    },
    {
      id: 10,
      title: "Stellar Transaction Fees",
      content:
        "Stellar transactions typically cost just 0.00001 XLM, making it one of the most cost-effective blockchain networks.",
      category: "Cryptocurrency",
    },
    {
      id: 11,
      title: "The 4% Rule",
      content:
        "In retirement planning, withdrawing 4% of your portfolio annually has historically provided sustainable income.",
      category: "Retirement",
    },
    {
      id: 12,
      title: "Credit Score Factors",
      content:
        "Payment history (35%), amounts owed (30%), length of history (15%), new credit (10%), and credit mix (10%) determine your credit score.",
      category: "Credit",
    },
  ]

  const [currentTipIndex, setCurrentTipIndex] = useState(0)
  const currentTip = tips[currentTipIndex]

  const nextTip = () => {
    setCurrentTipIndex((prev) => (prev === tips.length - 1 ? 0 : prev + 1))
  }

  const prevTip = () => {
    setCurrentTipIndex((prev) => (prev === 0 ? tips.length - 1 : prev - 1))
  }

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950 border-indigo-200 dark:border-indigo-800 shadow-md overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-300" />
          <CardTitle className="text-lg">Financial Tip</CardTitle>
        </div>
        <CardDescription className="text-indigo-100">
          <span className="font-medium">{currentTip.category}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-bold mb-2 text-indigo-900 dark:text-indigo-100">{currentTip.title}</h3>
        <p className="text-slate-700 dark:text-slate-300">{currentTip.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 pb-3 bg-indigo-50/50 dark:bg-indigo-900/30 border-t border-indigo-100 dark:border-indigo-800">
        <Button
          variant="ghost"
          size="sm"
          onClick={prevTip}
          className="text-indigo-700 hover:text-indigo-900 hover:bg-indigo-100 dark:text-indigo-300 dark:hover:text-indigo-100 dark:hover:bg-indigo-800"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={nextTip}
          className="text-indigo-700 hover:text-indigo-900 hover:bg-indigo-100 dark:text-indigo-300 dark:hover:text-indigo-100 dark:hover:bg-indigo-800"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  )
}
