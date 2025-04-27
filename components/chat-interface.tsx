"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useChat } from "ai/react"
import { Mic, Send, Loader2, StopCircle, WifiOff, RefreshCw } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useOnlineStatus } from "@/hooks/use-online-status"
import { queueMessage, getUnsyncedMessages, markAsSynced, cleanQueue } from "@/lib/offline-queue"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { MessageSquare } from "lucide-react"
import { getFromStorage, saveToStorage } from "@/lib/storage-service"
import { useToast } from "@/components/ui/use-toast"

// Declare SpeechRecognition
declare var SpeechRecognition: any
declare var webkitSpeechRecognition: any

interface ChatInterfaceProps {
  sessionId: string
  onSaveSession: (id: string, messages: any[]) => string
}

export default function ChatInterface({ sessionId, onSaveSession }: ChatInterfaceProps) {
  const [isVoiceInput, setIsVoiceInput] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [micPermissionDenied, setMicPermissionDenied] = useState(false)
  const recognitionRef = useRef<any>(null)
  const isOnline = useOnlineStatus()
  const [offlineMessages, setOfflineMessages] = useState<any[]>([])
  const [isSyncing, setIsSyncing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const [walletData, setWalletData] = useState<any>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput, setMessages } = useChat({
    api: "/api/chat",
    id: sessionId === "new" ? undefined : sessionId,
    onError: (error) => {
      console.error("Chat error:", error)
      toast({
        title: "Error",
        description: "There was an error processing your message. Please try again.",
        variant: "destructive",
      })
    },
    onFinish: () => {
      // Save the session when a message is completed
      if (messages.length > 0) {
        onSaveSession(sessionId, messages)
      }

      // Scroll to bottom when new message is received
      setTimeout(() => {
        scrollToBottom()
      }, 100)
    },
    // Preserve messages when component unmounts
    initialMessages: [],
  })

  // Load wallet data for transaction capabilities
  useEffect(() => {
    const loadWalletData = () => {
      const savedWallet = getFromStorage("finai-wallet", null)
      if (savedWallet) {
        setWalletData(savedWallet)
      }
    }

    loadWalletData()

    // Add event listener for wallet updates
    const handleStorageChange = () => {
      const updatedWallet = getFromStorage("finai-wallet", null)
      if (updatedWallet) {
        setWalletData(updatedWallet)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("storage-updated", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("storage-updated", handleStorageChange)
    }
  }, [])

  // Load saved messages for this session
  useEffect(() => {
    if (sessionId !== "new") {
      const savedMessages = getFromStorage(`finai-chat-${sessionId}`, [])
      if (savedMessages.length > 0) {
        setMessages(savedMessages)
      }
    } else {
      // Check if we have messages in session storage (for tab switching)
      const currentMessages = sessionStorage.getItem("finai-current-chat")
      if (currentMessages) {
        try {
          setMessages(JSON.parse(currentMessages))
        } catch (e) {
          console.error("Error parsing stored messages:", e)
        }
      } else {
        setMessages([])
      }
    }
  }, [sessionId, setMessages])

  // Save messages to session storage when they change (for tab switching)
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem("finai-current-chat", JSON.stringify(messages))
    }
  }, [messages])

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Load offline messages when component mounts
  useEffect(() => {
    const unsyncedMessages = getUnsyncedMessages()
    if (unsyncedMessages.length > 0) {
      setOfflineMessages(
        unsyncedMessages.map((msg) => ({
          id: msg.id,
          content: msg.content,
          role: "user",
          createdAt: new Date(msg.timestamp),
          offline: true,
        })),
      )
    }
  }, [])

  // Sync offline messages when back online
  useEffect(() => {
    if (isOnline && offlineMessages.length > 0 && !isSyncing) {
      syncOfflineMessages()
    }
  }, [isOnline, offlineMessages])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {
          console.error("Error stopping speech recognition:", e)
        }
      }
    }
  }, [])

  const syncOfflineMessages = async () => {
    if (offlineMessages.length === 0) return

    setIsSyncing(true)

    try {
      // Process each offline message
      for (const msg of offlineMessages) {
        // Add the message to the chat
        setMessages((prev) => [
          ...prev,
          {
            id: msg.id,
            content: msg.content,
            role: "user",
          },
        ])

        // Mark as synced in the queue
        markAsSynced([msg.id])
      }

      // Clear offline messages
      setOfflineMessages([])

      // Clean up the queue
      cleanQueue()
    } catch (error) {
      console.error("Error syncing offline messages:", error)
    } finally {
      setIsSyncing(false)
    }
  }

  const checkMicrophonePermission = async (): Promise<boolean> => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // If we get here, permission was granted
      // Stop all tracks to release the microphone
      stream.getTracks().forEach((track) => track.stop())

      return true
    } catch (error) {
      console.error("Microphone permission error:", error)
      return false
    }
  }

  const startVoiceRecording = async () => {
    // Reset the denied state
    setMicPermissionDenied(false)

    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast({
        title: "Browser not supported",
        description: "Your browser doesn't support speech recognition. Please try a different browser.",
        variant: "destructive",
      })
      return
    }

    // First check if we have microphone permission
    const hasPermission = await checkMicrophonePermission()

    if (!hasPermission) {
      setMicPermissionDenied(true)
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to use voice input.",
        variant: "destructive",
      })
      return
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()

      // Detect language automatically
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = "en-US" // Default to English, but can be changed

      recognition.onstart = () => {
        setIsRecording(true)
        setTranscript("")
        toast({
          title: "Listening...",
          description: "Speak now. Click the microphone button again to stop.",
        })
      }

      recognition.onresult = (event: any) => {
        let interimTranscript = ""
        let finalTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          } else {
            interimTranscript += event.results[i][0].transcript
          }
        }

        // Update the input field with the transcript
        const newTranscript = finalTranscript || interimTranscript
        setTranscript(newTranscript)
        setInput(newTranscript)
      }

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error)

        if (event.error === "not-allowed") {
          setMicPermissionDenied(true)
          toast({
            title: "Microphone access denied",
            description: "Please allow microphone access in your browser settings to use voice input.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Voice input error",
            description: `Error: ${event.error}. Please try again.`,
            variant: "destructive",
          })
        }

        stopVoiceRecording()
      }

      recognition.onend = () => {
        stopVoiceRecording()
        toast({
          title: "Voice input ended",
          description: "Voice recording has stopped.",
        })
      }

      recognitionRef.current = recognition
      recognition.start()
    } catch (error) {
      console.error("Error starting speech recognition:", error)
      toast({
        title: "Voice input error",
        description: "Could not start voice recognition. Please try again.",
        variant: "destructive",
      })
    }
  }

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (e) {
        console.error("Error stopping speech recognition:", e)
      }
      recognitionRef.current = null
    }
    setIsRecording(false)
  }

  const toggleVoiceInput = () => {
    if (isRecording) {
      stopVoiceRecording()
    } else {
      startVoiceRecording()
    }
  }

  // Process transaction commands from chat
  const processTransactionCommand = (message: string) => {
    // Check if this is a transaction command
    const sendMatch = message.match(/send\s+(\d+(?:\.\d+)?)\s+XLM\s+to\s+([A-Z0-9]+)/i)
    const balanceMatch = message.match(/check\s+(?:my\s+)?(?:wallet\s+)?balance/i)
    const transactionHistoryMatch = message.match(/(?:show|view|get)\s+(?:my\s+)?(?:transaction|payment)\s+history/i)

    if (sendMatch && walletData && walletData.status === "created") {
      const amount = sendMatch[1]
      const recipient = sendMatch[2]

      // Check if we have enough balance
      const currentBalance = Number.parseFloat(walletData.balance)
      const sendAmount = Number.parseFloat(amount)

      if (sendAmount > currentBalance) {
        return `I'm sorry, but you don't have enough balance to send ${amount} XLM. Your current balance is ${currentBalance} XLM.`
      }

      // Simulate transaction
      const newBalance = (currentBalance - sendAmount).toFixed(7)

      // Update wallet data
      const updatedWallet = {
        ...walletData,
        balance: newBalance,
        transactionHistory: [
          {
            id: `tx${walletData.transactionHistory.length + 1}`,
            type: "sent",
            amount: amount,
            to: recipient,
            timestamp: new Date().toISOString(),
          },
          ...walletData.transactionHistory,
        ],
      }

      // Save updated wallet
      saveToStorage("finai-wallet", updatedWallet)
      setWalletData(updatedWallet)

      // Dispatch event to notify other components
      const event = new Event("storage-updated")
      window.dispatchEvent(event)

      return `Transaction successful! You've sent ${amount} XLM to ${recipient}. Your new balance is ${newBalance} XLM.`
    }

    if (balanceMatch && walletData && walletData.status === "created") {
      return `Your current wallet balance is ${walletData.balance} XLM.`
    }

    if (transactionHistoryMatch && walletData && walletData.status === "created") {
      if (walletData.transactionHistory.length === 0) {
        return "You don't have any transactions yet."
      }

      // Format the last 5 transactions
      const lastTransactions = walletData.transactionHistory.slice(0, 5)
      let historyText = "Here are your most recent transactions:\n\n"

      lastTransactions.forEach((tx: any, index: number) => {
        const date = new Date(tx.timestamp).toLocaleString()
        if (tx.type === "sent") {
          historyText += `${index + 1}. Sent ${tx.amount} XLM to ${tx.to} on ${date}\n`
        } else {
          historyText += `${index + 1}. Received ${tx.amount} XLM from ${tx.from} on ${date}\n`
        }
      })

      return historyText
    }

    return null
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    if (!isOnline) {
      // Store message in offline queue
      const queuedMsg = queueMessage(input)

      // Add to offline messages
      setOfflineMessages((prev) => [
        ...prev,
        {
          id: queuedMsg.id,
          content: input,
          role: "user",
          createdAt: new Date(),
          offline: true,
        },
      ])

      // Add a placeholder response
      const offlineResponse = {
        id: `offline-${Date.now()}`,
        content: "Your message has been saved and will be processed when you're back online.",
        role: "assistant",
        createdAt: new Date(),
        offline: true,
      }

      // Update UI with user message and offline response
      setMessages((prev) => [
        ...prev,
        {
          id: queuedMsg.id,
          content: input,
          role: "user",
        },
        offlineResponse,
      ])

      // Clear input
      setInput("")
    } else {
      // Check if this is a transaction command that we can handle directly
      const transactionResponse = processTransactionCommand(input)

      if (transactionResponse) {
        // Add user message
        setMessages((prev) => [
          ...prev,
          {
            id: `user-${Date.now()}`,
            content: input,
            role: "user",
          },
        ])

        // Add transaction response
        setMessages((prev) => [
          ...prev,
          {
            id: `transaction-${Date.now()}`,
            content: transactionResponse,
            role: "assistant",
          },
        ])

        // Clear input
        setInput("")

        // Save the session
        if (messages.length > 0) {
          onSaveSession(sessionId, messages)
        }
      } else {
        // Normal online submission
        handleSubmit(e)
      }
    }
  }

  const handleReset = () => {
    setMessages([])
    sessionStorage.removeItem("finai-current-chat")
    onSaveSession(sessionId, [])
    toast({
      title: "Chat Reset",
      description: "Your conversation has been reset.",
    })
  }

  // Function to format message content (remove asterisks)
  const formatMessageContent = (content: string) => {
    // Replace *text* with actual text (remove asterisks)
    return content.replace(/\*(.*?)\*/g, "$1")
  }

  return (
    <div className="flex flex-col h-full">
      {!isOnline && (
        <Alert variant="warning" className="mb-4 bg-amber-50 border-amber-200 text-amber-800">
          <WifiOff className="h-4 w-4" />
          <AlertTitle>Offline Mode</AlertTitle>
          <AlertDescription>
            You're currently offline. Messages will be queued and sent when you reconnect.
            {offlineMessages.length > 0 &&
              ` (${offlineMessages.length} message${offlineMessages.length > 1 ? "s" : ""} queued)`}
          </AlertDescription>
        </Alert>
      )}

      {micPermissionDenied && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Microphone Access Denied</AlertTitle>
          <AlertDescription>
            Please allow microphone access in your browser settings to use voice input.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end items-center mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/30"
          disabled={messages.length === 0}
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Reset Chat
        </Button>
      </div>

      <Card className="flex-1 overflow-hidden border-indigo-200 dark:border-indigo-800">
        <CardContent className="p-4 h-full flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 py-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 dark:text-slate-400 space-y-4">
                <div className="rounded-full bg-indigo-100 dark:bg-indigo-900 p-4">
                  <MessageSquare className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-lg font-medium">Welcome to FinAI</p>
                  <p>Ask me anything about finances, create a wallet, or check your balance.</p>
                  <p className="mt-2 text-sm">
                    Try saying: "What's my wallet balance?" or "Send 5 XLM to
                    GDVLXPGBLMHONKGSXFFW25FTOHYCCIOVFXP6PD7DLWMBZBGEHCA4XI7H"
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-3 rounded-lg p-4",
                    message.role === "user"
                      ? "ml-auto bg-gradient-to-r from-indigo-600 to-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200",
                    (message as any).offline && "opacity-70",
                  )}
                >
                  {message.role !== "user" && (
                    <Avatar className="h-8 w-8 border border-indigo-200 dark:border-indigo-800">
                      <AvatarFallback className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100">
                        AI
                      </AvatarFallback>
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    </Avatar>
                  )}
                  <div className="text-sm whitespace-pre-line">
                    {formatMessageContent(message.content)}
                    {(message as any).offline && (
                      <div className="text-xs mt-1 flex items-center gap-1">
                        <WifiOff className="h-3 w-3" />
                        {message.role === "user" ? "Queued" : "Offline response"}
                      </div>
                    )}
                  </div>
                  {message.role === "user" && (
                    <Avatar className="h-8 w-8 border border-indigo-200 dark:border-indigo-800">
                      <AvatarFallback className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100">
                        U
                      </AvatarFallback>
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    </Avatar>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
              </div>
            )}
            {isSyncing && (
              <div className="flex items-center justify-center py-2 text-sm text-indigo-500">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Syncing offline messages...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleFormSubmit} className="flex items-center gap-2 pt-4">
            <Button
              type="button"
              size="icon"
              variant={isRecording ? "destructive" : "outline"}
              onClick={toggleVoiceInput}
              className={cn(isRecording && "animate-pulse", "border-indigo-200 dark:border-indigo-800")}
              aria-label={isRecording ? "Stop recording" : "Start voice input"}
              disabled={!isOnline || micPermissionDenied}
            >
              {isRecording ? <StopCircle className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder={isRecording ? "Listening..." : "Type your message..."}
              className="flex-1 border-indigo-200 dark:border-indigo-800 focus-visible:ring-indigo-500"
              disabled={isLoading || isRecording}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
