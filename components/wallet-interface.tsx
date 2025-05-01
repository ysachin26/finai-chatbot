"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Loader2,
  AlertCircle,
  Copy,
  ExternalLink,
  RefreshCw,
  Shield,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  AlertTriangle,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { saveToStorage, getFromStorage, STORAGE_KEYS } from "@/lib/storage-service"
import { removeFromStorage } from "@/lib/storage-service"

interface WalletData {
  publicKey: string
  balance: string
  transactionHistory: any[]
  status: "loading" | "none" | "created"
}

interface TransactionDetails {
  amount: string
  recipient: string
  senderBalance: string
  senderHistory: any[]
  timestamp: number
  memo?: string
  isInternal?: boolean
  exchangeRate?: number
}

interface FraudAnalysisResult {
  riskLevel: "low" | "medium" | "high"
  warnings: string[]
  shouldBlock: boolean
}

interface WalletStats {
  totalSent: string
  totalReceived: string
  lastActivity: string
  transactionCount: number
}

// Fraud detection function
function analyzeTransaction(transaction: TransactionDetails): FraudAnalysisResult {
  const warnings: string[] = []
  let riskLevel: "low" | "medium" | "high" = "low"

  // Check for large transactions (relative to balance)
  const amountNum = Number.parseFloat(transaction.amount)
  const balanceNum = Number.parseFloat(transaction.senderBalance)

  if (amountNum > balanceNum * 0.5) {
    warnings.push("This transaction is for more than 50% of your current balance.")
    riskLevel = "medium"
  }

  if (amountNum > balanceNum * 0.8) {
    warnings.push("This transaction is for more than 80% of your current balance.")
    riskLevel = "high"
  }

  // Check for unusual recipient patterns
  const isKnownRecipient = transaction.senderHistory.some((tx) => tx.type === "sent" && tx.to === transaction.recipient)

  if (!isKnownRecipient) {
    warnings.push("You have not sent funds to this recipient before.")
    if (riskLevel === "low") riskLevel = "medium"
  }

  // Check for unusual timing
  const recentTransactions = transaction.senderHistory.filter(
    (tx) => tx.type === "sent" && new Date(tx.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000,
  )

  if (recentTransactions.length >= 3) {
    warnings.push("You have made multiple transactions in the last 24 hours.")
    if (riskLevel === "low") riskLevel = "medium"
  }

  // Determine if transaction should be blocked
  const shouldBlock = riskLevel === "high"

  return {
    riskLevel,
    warnings,
    shouldBlock,
  }
}

export default function WalletInterface() {
  const [walletStatus, setWalletStatus] = useState<"loading" | "none" | "created">("loading")
  const [publicKey, setPublicKey] = useState("")
  const [privateKey, setPrivateKey] = useState("") // Store securely in a real app
  const [balance, setBalance] = useState("0")
  const [recipientAddress, setRecipientAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [memo, setMemo] = useState("")
  const [isCreatingWallet, setIsCreatingWallet] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [transactionHistory, setTransactionHistory] = useState<any[]>([])
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isTransactionSuccess, setIsTransactionSuccess] = useState(false)

  // Fraud detection states
  const [fraudAnalysis, setFraudAnalysis] = useState<FraudAnalysisResult | null>(null)
  const [showFraudDialog, setShowFraudDialog] = useState(false)

  // Add wallet stats
  const [walletStats, setWalletStats] = useState<WalletStats>({
    totalSent: "0",
    totalReceived: "0",
    lastActivity: "-",
    transactionCount: 0,
  })

  // Use a ref to track if we should save to storage to prevent infinite loops
  const shouldSaveToStorage = useRef(false)

  // Calculate wallet statistics from transaction history
  const calculateWalletStats = useCallback((history: any[]) => {
    if (!history || history.length === 0) {
      return
    }

    // Calculate totals
    let sent = 0
    let received = 0
    let lastActivityDate = new Date(0)

    history.forEach((tx) => {
      const txDate = new Date(tx.timestamp)
      if (txDate > lastActivityDate) {
        lastActivityDate = txDate
      }

      if (tx.type === "sent") {
        sent += Number.parseFloat(tx.amount)
      } else if (tx.type === "received") {
        received += Number.parseFloat(tx.amount)
      }
    })

    setWalletStats({
      totalSent: sent.toFixed(7),
      totalReceived: received.toFixed(7),
      lastActivity: lastActivityDate.getTime() > 0 ? lastActivityDate.toLocaleString() : "-",
      transactionCount: history.length,
    })
  }, [])

  // Load wallet data from storage on component mount
  useEffect(() => {
    const loadWallet = () => {
      const savedWallet = getFromStorage<WalletData | null>(STORAGE_KEYS.WALLET, null)

      if (savedWallet) {
        setWalletStatus(savedWallet.status)
        setPublicKey(savedWallet.publicKey)
        setBalance(savedWallet.balance)
        setTransactionHistory(savedWallet.transactionHistory)

        // Also set the private key if available (in a real app, this would be securely stored)
        const privateKeyData = getFromStorage<{ key: string } | null>("finai-private-key", null)
        if (privateKeyData) {
          setPrivateKey(privateKeyData.key)
        }

        // Calculate wallet stats
        calculateWalletStats(savedWallet.transactionHistory)
      } else {
        // No saved wallet, set to none after a brief loading period
        setTimeout(() => {
          setWalletStatus("none")
        }, 1000)
      }
    }

    // Simulate network delay for a more realistic experience
    setTimeout(loadWallet, 500)

    // Listen for storage events from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.WALLET) {
        loadWallet()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [calculateWalletStats])

  // Save wallet data whenever it changes
  useEffect(() => {
    // Only save if we should (prevents infinite loops)
    if (walletStatus === "created" && shouldSaveToStorage.current) {
      const walletData: WalletData = {
        publicKey,
        balance,
        transactionHistory,
        status: walletStatus,
      }

      saveToStorage(STORAGE_KEYS.WALLET, walletData)
      shouldSaveToStorage.current = false
    }
  }, [walletStatus, publicKey, balance, transactionHistory])

  const handleCreateWallet = async () => {
    setIsCreatingWallet(true)

    // Simulate wallet creation
    setTimeout(() => {
      // Generate a realistic Stellar address and secret key
      const newPublicKey = "GC2XCX56TSIPMYKCCYJUBDA6BJZ5ISKXJCFR5AVZLHZX3TCE5EKMRJJL"
      const newSecretKey = "SDZOPOJCPA4IQTI3SDQA7XOHQYFXYVAFKOH3ITSX2TUTXTKFDCFEWKFP"

      setPublicKey(newPublicKey)
      setPrivateKey(newSecretKey)
      setBalance("100.0000000")
      setWalletStatus("created")
      setIsCreatingWallet(false)

      // Store the private key securely (in a real app, this would use a secure storage mechanism)
      saveToStorage("finai-private-key", { key: newSecretKey })

      // Add some mock transaction history
      const initialTransaction = {
        id: "tx1",
        type: "received",
        amount: "100.0000000",
        from: "Initial funding",
        timestamp: new Date().toISOString(),
      }

      setTransactionHistory([initialTransaction])

      // Update wallet stats
      setWalletStats({
        totalSent: "0",
        totalReceived: "100.0000000",
        lastActivity: new Date().toLocaleString(),
        transactionCount: 1,
      })

      // Set flag to save to storage
      shouldSaveToStorage.current = true
    }, 2000)
  }

  const checkForFraud = () => {
    if (!amount || !recipientAddress) return null

    // Create transaction details for analysis
    const transactionDetails = {
      amount,
      recipient: recipientAddress,
      senderBalance: balance,
      senderHistory: transactionHistory,
      timestamp: Date.now(),
      memo: memo,
    }

    // Analyze the transaction
    return analyzeTransaction(transactionDetails)
  }

  const handleSendTransaction = async (e: React.FormEvent) => {
    e.preventDefault()

    // Run fraud detection
    const fraudResult = checkForFraud()

    if (fraudResult && (fraudResult.riskLevel !== "low" || fraudResult.warnings.length > 0)) {
      setFraudAnalysis(fraudResult)
      setShowFraudDialog(true)
      return
    }

    // If no fraud detected or user confirmed, proceed with transaction
    processTransaction()
  }

  const processTransaction = () => {
    setIsSending(true)

    // Simulate sending transaction with Stellar
    setTimeout(() => {
      // Deduct the amount from balance
      const newBalance = (Number.parseFloat(balance) - Number.parseFloat(amount)).toFixed(7)
      setBalance(newBalance)

      // Create a new transaction record
      const newTransaction = {
        id: `tx${transactionHistory.length + 1}`,
        type: "sent",
        amount: amount,
        to: recipientAddress,
        timestamp: new Date().toISOString(),
        memo: memo || undefined,
      }

      // Add to transaction history
      const updatedHistory = [newTransaction, ...transactionHistory]
      setTransactionHistory(updatedHistory)

      // Reset form
      setRecipientAddress("")
      setAmount("")
      setMemo("")
      setIsSending(false)
      setFraudAnalysis(null)

      // Show success message
      setIsTransactionSuccess(true)
      setTimeout(() => setIsTransactionSuccess(false), 3000)

      // Update wallet stats
      calculateWalletStats(updatedHistory)

      // Set flag to save to storage
      shouldSaveToStorage.current = true
    }, 2000)
  }

  const handleRefreshBalance = () => {
    setIsRefreshing(true)

    // Simulate refreshing balance from Stellar network
    setTimeout(() => {
      // In a real implementation, this would fetch the current balance from the Stellar network
      setIsRefreshing(false)
    }, 1000)
  }

  const handleDeleteWallet = () => {
    // Remove wallet data
    removeFromStorage(STORAGE_KEYS.WALLET)
    removeFromStorage("finai-private-key")

    // Reset state
    setWalletStatus("none")
    setPublicKey("")
    setPrivateKey("")
    setBalance("0")
    setTransactionHistory([])
    setShowDeleteConfirm(false)

    // Reset wallet stats
    setWalletStats({
      totalSent: "0",
      totalReceived: "0",
      lastActivity: "-",
      transactionCount: 0,
    })
  }

  if (walletStatus === "loading") {
    return (
      <Card className="w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Loader2 className="h-10 w-10 animate-spin text-teal-500 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading wallet information...</p>
        </CardContent>
      </Card>
    )
  }

  if (walletStatus === "none") {
    return (
      <Card className="w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">Create Your Stellar Wallet</CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            You don't have a wallet yet. Create one to start sending and receiving funds.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-6">
          <Button
            onClick={handleCreateWallet}
            disabled={isCreatingWallet}
            className="w-full max-w-xs bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white"
          >
            {isCreatingWallet ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Wallet...
              </>
            ) : (
              "Create Wallet"
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-t-lg">
        <CardTitle className="flex justify-between items-center">
          <span>Your Stellar Wallet</span>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefreshBalance}
                    disabled={isRefreshing}
                    className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Update your balance from the Stellar network</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-500/20 hover:bg-red-500/40 text-white border-red-500/30"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
        <CardDescription className="text-teal-100">
          Manage your funds and transactions on the Stellar network
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-gray-700 dark:text-gray-300">Public Key</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(publicKey)}
                      className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-200"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy to clipboard</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-md overflow-x-auto border border-gray-200 dark:border-gray-700">
              <code className="text-xs sm:text-sm break-all text-gray-800 dark:text-gray-300">{publicKey}</code>
            </div>
          </div>

          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 rounded-lg text-white shadow-lg">
            <div className="text-sm text-teal-100">Available Balance</div>
            <div className="text-4xl font-bold mt-1 flex items-baseline">
              {balance}
              <span className="ml-2 text-lg">XLM</span>
            </div>
            <div className="mt-2 text-xs text-teal-200">≈ ${(Number.parseFloat(balance) * 0.11).toFixed(2)} USD</div>

            <div className="grid grid-cols-2 mt-4 pt-4 border-t border-teal-500/30">
              <div>
                <div className="text-xs text-teal-200">Total Sent</div>
                <div className="font-medium">{walletStats.totalSent} XLM</div>
              </div>
              <div>
                <div className="text-xs text-teal-200">Total Received</div>
                <div className="font-medium">{walletStats.totalReceived} XLM</div>
              </div>
            </div>
          </div>

          {isTransactionSuccess && (
            <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 p-4 rounded-md flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Transaction completed successfully!</span>
            </div>
          )}

          <Tabs defaultValue="send" className="mt-6">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800">
              <TabsTrigger value="send" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
                Send
              </TabsTrigger>
              <TabsTrigger
                value="receive"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
              >
                Receive
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
              >
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="send" className="space-y-4 pt-4">
              <form onSubmit={handleSendTransaction}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipient" className="text-gray-700 dark:text-gray-300">
                      Recipient Address
                    </Label>
                    <Input
                      id="recipient"
                      placeholder="G..."
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      required
                      className="border-gray-200 dark:border-gray-700 focus-visible:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-gray-700 dark:text-gray-300">
                      Amount (XLM)
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.0000001"
                      min="0.0000001"
                      max={balance}
                      placeholder="0.0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      className="border-gray-200 dark:border-gray-700 focus-visible:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="memo" className="text-gray-700 dark:text-gray-300">
                      Memo (Optional)
                    </Label>
                    <Input
                      id="memo"
                      placeholder="Add a note to this transaction"
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                      className="border-gray-200 dark:border-gray-700 focus-visible:ring-teal-500"
                    />
                  </div>

                  <Alert
                    variant="destructive"
                    className="bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800/50"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Important</AlertTitle>
                    <AlertDescription>
                      Double-check the recipient address before sending. Blockchain transactions cannot be reversed.
                    </AlertDescription>
                  </Alert>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white"
                    disabled={isSending || !recipientAddress || !amount}
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send XLM"
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="receive" className="space-y-4 pt-4">
              <div className="text-center space-y-6">
                <div className="mx-auto p-4 rounded-lg bg-white dark:bg-gray-800 max-w-xs border border-gray-200 dark:border-gray-700">
                  {/* This would be a QR code in a real app */}
                  <div className="w-full aspect-square bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <img
                      src="/placeholder.svg?height=180&width=180&text=QR+Code"
                      alt="QR Code"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300">Your Wallet Address</Label>
                  <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-md overflow-x-auto border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <code className="text-xs sm:text-sm break-all text-gray-800 dark:text-gray-300">{publicKey}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(publicKey)}
                      className="ml-2 flex-shrink-0 text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-200"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-gray-700 dark:text-gray-300">Secret Key (Private)</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPrivateKey(!showPrivateKey)}
                      className="text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200"
                    >
                      {showPrivateKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-md overflow-x-auto border border-amber-200 dark:border-amber-800">
                    <code className="text-xs break-all text-gray-800 dark:text-gray-300">
                      {showPrivateKey ? privateKey : "••••••••••••••••••••••••••••••••••••••••••••••••••••••"}
                    </code>
                  </div>
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="h-3 w-3 inline mr-1" />
                    Never share your secret key with anyone. Anyone who has access to this key can control your funds.
                  </p>
                </div>

                <Alert className="bg-teal-50 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-200 dark:border-teal-800/50">
                  <AlertTitle>Receive XLM</AlertTitle>
                  <AlertDescription className="text-sm">
                    Share your wallet address above or have someone scan your QR code to receive XLM tokens.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>

            <TabsContent value="history" className="pt-4">
              {transactionHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">No transaction history yet</div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2 px-2">
                    <span>Transaction</span>
                    <span>Amount</span>
                  </div>

                  <ScrollArea className="h-[320px]">
                    <div className="space-y-3 pr-4">
                      {transactionHistory.map((tx) => (
                        <div
                          key={tx.id}
                          className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex justify-between items-center bg-white/50 dark:bg-gray-800/50 hover:shadow-md transition-shadow"
                        >
                          <div>
                            <div className="font-medium flex items-center text-gray-700 dark:text-gray-300">
                              {tx.type === "sent" ? (
                                <ArrowUpRight className="h-4 w-4 mr-2 text-red-500" />
                              ) : (
                                <ArrowDownLeft className="h-4 w-4 mr-2 text-green-500" />
                              )}
                              {tx.type === "sent" ? "Sent to" : "Received from"}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-[200px]">
                              {tx.type === "sent" ? tx.to : tx.from}
                            </div>
                            <div className="text-xs text-gray-400">{new Date(tx.timestamp).toLocaleString()}</div>
                            {tx.memo && (
                              <div className="text-xs italic mt-1 text-gray-500 dark:text-gray-400">
                                Memo: {tx.memo}
                              </div>
                            )}
                          </div>
                          <div className={`font-medium ${tx.type === "sent" ? "text-red-500" : "text-green-500"}`}>
                            {tx.type === "sent" ? "-" : "+"}
                            {tx.amount} XLM
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <span>Total transactions: {transactionHistory.length}</span>
                    <span>Last activity: {walletStats.lastActivity}</span>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-gray-200 dark:border-gray-700 pt-6">
        <a
          href={`https://stellar.expert/explorer/${process.env.NEXT_PUBLIC_STELLAR_NETWORK === "PUBLIC" ? "public" : "testnet"}/account/${publicKey}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-200 flex items-center"
        >
          View on Stellar Explorer
          <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      </CardFooter>

      {/* Fraud Detection Dialog */}
      <Dialog open={showFraudDialog} onOpenChange={setShowFraudDialog}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Shield
                className={`h-5 w-5 ${fraudAnalysis?.riskLevel === "high" ? "text-red-500" : "text-amber-500"}`}
              />
              {fraudAnalysis?.riskLevel === "high" ? "High Risk Transaction Detected" : "Transaction Warning"}
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Our fraud detection system has identified potential risks with this transaction.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Alert
              variant={fraudAnalysis?.riskLevel === "high" ? "destructive" : "warning"}
              className="bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800/50"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Risk Level: {fraudAnalysis?.riskLevel?.toUpperCase()}</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  {fraudAnalysis?.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFraudDialog(false)}
              className="w-full sm:w-auto border-gray-200 dark:border-gray-700"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cancel Transaction
            </Button>

            <Button
              onClick={() => {
                setShowFraudDialog(false)
                processTransaction()
              }}
              className={`w-full sm:w-auto ${fraudAnalysis?.shouldBlock ? "bg-red-600 hover:bg-red-700" : "bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"} text-white`}
              disabled={fraudAnalysis?.shouldBlock}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {fraudAnalysis?.shouldBlock ? "Transaction Blocked" : "Proceed Anyway"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Wallet Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Wallet</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete your wallet from this device. If you haven't backed up your secret key, you will lose
              access to your funds. Are you absolutely sure?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteWallet} className="bg-red-600 hover:bg-red-700 text-white">
              Yes, Delete Wallet
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
