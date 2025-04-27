import { groq } from "@ai-sdk/groq"
import { streamText } from "ai"
import { NextResponse } from "next/server"
import { detectLanguage } from "@/lib/language-utils"

// Enhanced system prompt for the financial assistant with transaction handling and fraud detection
const SYSTEM_PROMPT = `You are FinAI, a multilingual financial assistant powered by Groq and Stellar blockchain.

Your capabilities include:
1. Answering financial questions in the user's language
2. Explaining how to use the Stellar blockchain wallet
3. Providing guidance on sending and receiving funds
4. Explaining financial concepts in simple terms
5. Detecting the language of the user and responding in the same language
6. Helping users manage their financial transactions directly
7. Detecting potentially fraudulent transactions and warning users

When users ask about wallet operations, you can help them:
- Create a wallet on the Wallet page
- Send XLM to other Stellar addresses (including to GDVLXPGBLMHONKGSXFFW25FTOHYCCIOVFXP6PD7DLWMBZBGEHCA4XI7H)
- View their transaction history
- Check their current balance
- Understand transaction fees and processing time

For transaction management:
- When a user wants to send funds, guide them through the process step by step
- Explain the importance of verifying recipient addresses before sending
- Discuss the benefits of using Stellar for fast, low-cost transactions
- Educate about the memo field for adding notes to transactions

For fraud detection:
- Flag unusual transaction patterns (large amounts, unknown recipients, multiple rapid transactions)
- Warn users about common scams in cryptocurrency
- Provide security tips for keeping their wallet safe
- Advise on monitoring transaction history regularly

For financial education:
- Explain blockchain concepts in simple terms
- Provide insights on cryptocurrency markets and trends
- Compare traditional banking with blockchain-based solutions
- Offer resources for further learning

Always be helpful, concise, and accessible to users from all financial backgrounds.
If you don't know something, admit it rather than making up information.

IMPORTANT: Always respond in the same language as the user's message. If the user writes in Spanish, respond in Spanish. If they write in French, respond in French, etc.`

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Get the last user message
    const lastUserMessage = messages.filter((m: any) => m.role === "user").pop()

    if (!lastUserMessage) {
      return NextResponse.json({ error: "No user message found" }, { status: 400 })
    }

    // Detect the language of the user's message
    const detectedLanguage = detectLanguage(lastUserMessage.content)

    // Add language information to the system prompt
    let enhancedSystemPrompt = SYSTEM_PROMPT
    if (detectedLanguage !== "en") {
      enhancedSystemPrompt += `\nThe user appears to be writing in ${detectedLanguage}. Please respond in the same language.`
    }

    // Check for potential transaction-related keywords to enhance fraud detection
    const transactionKeywords = [
      "send",
      "transfer",
      "payment",
      "transaction",
      "wallet",
      "address",
      "XLM",
      "Stellar",
      "balance",
    ]
    const containsTransactionKeywords = transactionKeywords.some((keyword) =>
      lastUserMessage.content.toLowerCase().includes(keyword.toLowerCase()),
    )

    if (containsTransactionKeywords) {
      enhancedSystemPrompt += `\nThe user seems to be discussing a transaction. Remember to:
1. Verify the transaction details
2. Check for any suspicious patterns
3. Provide security reminders
4. Ask for confirmation if anything seems unusual
5. If they want to send funds to GDVLXPGBLMHONKGSXFFW25FTOHYCCIOVFXP6PD7DLWMBZBGEHCA4XI7H, guide them through the process`
    }

    // Prepare the conversation history for the AI
    const formattedMessages = messages.map((message: any) => ({
      role: message.role,
      content: message.content,
    }))

    // Stream the response from Groq using the environment variable
    const apiKey = process.env.GROQ_API_KEY || process.env.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

    if (!apiKey) {
      return NextResponse.json({ error: "API key not found" }, { status: 500 })
    }

    const response = await streamText({
      model: groq("llama3-70b-8192", {
        apiKey: apiKey,
      }),
      system: enhancedSystemPrompt,
      messages: formattedMessages,
    })

    // Use the proper streaming response format
    return response.toDataStreamResponse()
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "An error occurred while processing your request" }, { status: 500 })
  }
}
