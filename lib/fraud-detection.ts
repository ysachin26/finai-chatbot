/**
 * Fraud detection service for FinAI
 * This service analyzes transactions for potential fraud indicators
 */

export interface TransactionDetails {
  amount: string
  recipient: string
  senderBalance: string
  senderHistory: any[]
  timestamp: number
}

export interface FraudAnalysisResult {
  riskLevel: "low" | "medium" | "high"
  warnings: string[]
  shouldBlock: boolean
}

/**
 * Analyze a transaction for potential fraud indicators
 * @param transaction The transaction details to analyze
 * @returns Fraud analysis result with risk level and warnings
 */
export function analyzeTransaction(transaction: TransactionDetails): FraudAnalysisResult {
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

/**
 * Get security tips for the user
 * @returns Array of security tips
 */
export function getSecurityTips(): string[] {
  return [
    "Always double-check recipient addresses before sending funds.",
    "Never share your private keys or seed phrases with anyone.",
    "Be cautious of unexpected requests for cryptocurrency transfers.",
    "Enable two-factor authentication where available.",
    "Regularly update your passwords and security settings.",
    "Consider using a hardware wallet for large amounts.",
    "Monitor your transaction history regularly for unauthorized activity.",
    "Be wary of offers that seem too good to be true - they usually are.",
  ]
}
