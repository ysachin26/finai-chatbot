"use client"

import type React from "react"

import { useEffect, useState } from "react"
import ChatInterface from "@/components/chat-interface"
import { ConnectionStatus } from "@/components/connection-status"
import { MessageCircle, MessageSquarePlus, Trash2, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getFromStorage, saveToStorage } from "@/lib/storage-service"
import { useAuth } from "@/hooks/use-auth"
import LoginRedirect from "@/components/login-redirect"

interface ChatSession {
  id: string
  title: string
  preview: string
  timestamp: string
  messages: any[]
}

export default function ChatPage() {
  const { isLoggedIn, isLoading } = useAuth()
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string>("new")

  useEffect(() => {
    // Load saved chat sessions
    const savedSessions = getFromStorage<ChatSession[]>("finai-chat-sessions", [])
    if (savedSessions.length > 0) {
      setChatSessions(savedSessions)
    }
  }, [])

  const createNewSession = () => {
    setActiveSessionId("new")
  }

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setChatSessions((prev) => prev.filter((session) => session.id !== id))

    // Update storage
    const updatedSessions = chatSessions.filter((session) => session.id !== id)
    saveToStorage("finai-chat-sessions", updatedSessions)

    // If deleting the active session, switch to a new one
    if (id === activeSessionId) {
      setActiveSessionId("new")
    }
  }

  const saveSession = (id: string, messages: any[]) => {
    // If this is a new session, create it
    if (id === "new" && messages.length > 0) {
      const userMessages = messages.filter((m) => m.role === "user")
      const lastUserMessage = userMessages[userMessages.length - 1]?.content || "New conversation"
      const assistantMessages = messages.filter((m) => m.role === "assistant")
      const lastAssistantMessage = assistantMessages[assistantMessages.length - 1]?.content || ""

      const newSession: ChatSession = {
        id: `session-${Date.now()}`,
        title: lastUserMessage.length > 30 ? lastUserMessage.substring(0, 30) + "..." : lastUserMessage,
        preview:
          lastAssistantMessage.length > 50 ? lastAssistantMessage.substring(0, 50) + "..." : lastAssistantMessage,
        timestamp: new Date().toISOString(),
        messages: messages,
      }

      const updatedSessions = [newSession, ...chatSessions]
      setChatSessions(updatedSessions)
      setActiveSessionId(newSession.id)

      // Update storage
      saveToStorage("finai-chat-sessions", updatedSessions)

      // Save messages for this session
      saveToStorage(`finai-chat-${newSession.id}`, messages)
      return newSession.id
    } else if (id !== "new") {
      // Update existing session
      const sessionIndex = chatSessions.findIndex((s) => s.id === id)

      if (sessionIndex !== -1 && messages.length > 0) {
        const userMessages = messages.filter((m) => m.role === "user")
        const lastUserMessage = userMessages[userMessages.length - 1]?.content || "Conversation"
        const assistantMessages = messages.filter((m) => m.role === "assistant")
        const lastAssistantMessage = assistantMessages[assistantMessages.length - 1]?.content || ""

        const updatedSession: ChatSession = {
          ...chatSessions[sessionIndex],
          title: lastUserMessage.length > 30 ? lastUserMessage.substring(0, 30) + "..." : lastUserMessage,
          preview:
            lastAssistantMessage.length > 50 ? lastAssistantMessage.substring(0, 50) + "..." : lastAssistantMessage,
          timestamp: new Date().toISOString(),
          messages: messages,
        }

        const updatedSessions = [...chatSessions]
        updatedSessions[sessionIndex] = updatedSession
        setChatSessions(updatedSessions)

        // Update storage
        saveToStorage("finai-chat-sessions", updatedSessions)

        // Save messages for this session
        saveToStorage(`finai-chat-${id}`, messages)
      }
      return id
    }
    return id
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[60vh]">Loading...</div>
  }

  if (!isLoggedIn) {
    return <LoginRedirect />
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
      {/* Chat history sidebar */}
      <div className="lg:col-span-3 space-y-4 h-full overflow-hidden flex flex-col">
        <Card className="border-indigo-200 dark:border-indigo-800 flex-1 overflow-hidden flex flex-col">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-t-lg py-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <History className="h-5 w-5" />
              Chat History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 flex-1 overflow-hidden flex flex-col">
            <Button
              onClick={createNewSession}
              className="w-full mb-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white flex items-center gap-2"
            >
              <MessageSquarePlus className="h-4 w-4" />
              New Chat
            </Button>

            <ScrollArea className="flex-1">
              <div className="space-y-2 pr-3">
                {chatSessions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">No chat history yet</div>
                ) : (
                  chatSessions.map((session) => (
                    <div
                      key={session.id}
                      className={`p-3 rounded-lg border cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700 group transition-all
                        ${
                          activeSessionId === session.id
                            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30"
                            : "border-gray-200 dark:border-gray-700"
                        }`}
                      onClick={() => setActiveSessionId(session.id)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 line-clamp-1">
                          {session.title}
                        </h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => deleteSession(session.id, e)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                        {session.preview || "..."}
                      </p>
                      <div className="text-xs text-gray-400 mt-1">{new Date(session.timestamp).toLocaleString()}</div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Main chat area */}
      <div className="lg:col-span-9 h-full flex flex-col">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-2xl font-bold gradient-text">Financial Assistant</h1>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <ChatInterface sessionId={activeSessionId} onSaveSession={saveSession} />
        </div>

        <ConnectionStatus />
      </div>
    </div>
  )
}
