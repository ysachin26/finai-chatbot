import { Keypair, Server, Networks, TransactionBuilder, Operation, Asset } from "stellar-sdk"

// Define the Stellar network to use (testnet or public)
const NETWORK = process.env.NEXT_PUBLIC_STELLAR_NETWORK || "TESTNET"
const NETWORK_PASSPHRASE = NETWORK === "PUBLIC" ? Networks.PUBLIC : Networks.TESTNET

// Create a Stellar server instance
const server = new Server(NETWORK === "PUBLIC" ? "https://horizon.stellar.org" : "https://horizon-testnet.stellar.org")

/**
 * Create a new Stellar wallet (keypair)
 * @returns {Object} Object containing the public and secret keys
 */
export function createWallet() {
  const keypair = Keypair.random()
  return {
    publicKey: keypair.publicKey(),
    secretKey: keypair.secret(),
  }
}

/**
 * Get account balance
 * @param {string} publicKey - The public key of the account
 * @returns {Promise<string>} The account balance in XLM
 */
export async function getBalance(publicKey: string): Promise<string> {
  try {
    const account = await server.loadAccount(publicKey)
    const balance = account.balances.find((b: any) => b.asset_type === "native")
    return balance ? balance.balance : "0"
  } catch (error) {
    console.error("Error getting balance:", error)
    throw new Error("Failed to get account balance")
  }
}

/**
 * Send XLM from one account to another
 * @param {string} sourceSecretKey - The secret key of the sender
 * @param {string} destinationPublicKey - The public key of the recipient
 * @param {string} amount - The amount to send
 * @returns {Promise<any>} The transaction result
 */
export async function sendPayment(sourceSecretKey: string, destinationPublicKey: string, amount: string): Promise<any> {
  try {
    const sourceKeypair = Keypair.fromSecret(sourceSecretKey)
    const sourcePublicKey = sourceKeypair.publicKey()

    // Load the source account
    const sourceAccount = await server.loadAccount(sourcePublicKey)

    // Build the transaction
    const transaction = new TransactionBuilder(sourceAccount, {
      fee: "100",
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        Operation.payment({
          destination: destinationPublicKey,
          asset: Asset.native(),
          amount: amount,
        }),
      )
      .setTimeout(30)
      .build()

    // Sign the transaction
    transaction.sign(sourceKeypair)

    // Submit the transaction
    const result = await server.submitTransaction(transaction)
    return result
  } catch (error) {
    console.error("Error sending payment:", error)
    throw new Error("Failed to send payment")
  }
}

/**
 * Get transaction history for an account
 * @param {string} publicKey - The public key of the account
 * @returns {Promise<any[]>} Array of transactions
 */
export async function getTransactionHistory(publicKey: string): Promise<any[]> {
  try {
    const transactions = await server.transactions().forAccount(publicKey).limit(20).order("desc").call()

    return transactions.records
  } catch (error) {
    console.error("Error getting transaction history:", error)
    throw new Error("Failed to get transaction history")
  }
}
