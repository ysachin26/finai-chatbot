"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Trash2, Plus, Clock } from "lucide-react"
import { saveToStorage, getFromStorage } from "@/lib/storage-service"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ChatSession {
  id: string
  title: string
  preview: string
  timestamp: string
  messages: any[]
}

interface ChatHistoryProps {
  currentMessages: any[]
  onSelectSession: (messages: any[]) => void
  onNewChat: () => void
}

export function ChatHistory({ currentMessages, onSelectSession, onNewChat }: ChatHistoryProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null)

  // Load chat history on component mount
  useEffect(() => {
    const savedSessions = getFromStorage<ChatSession[]>("finai-chat-sessions", [])
    if (savedSessions) {
      setSessions(savedSessions)
    }
  }, [])

  // Save current session when messages change
  useEffect(() => {
    if (currentMessages.length > 0) {
      // Create a session from current messages
      const userMessages = currentMessages.filter((msg) => msg.role === "user")
      const lastUserMessage = userMessages[userMessages.length - 1]

      if (!lastUserMessage) return

      const newSession: ChatSession = {
        id: `session-${Date.now()}`,
        title: truncateText(lastUserMessage.content, 30),
        preview: truncateText(lastUserMessage.content, 60),
        timestamp: new Date().toISOString(),
        messages: currentMessages,
      }

      // Update sessions
      setSessions((prev) => {
        // Check if we already have this session
        const existingSessionIndex = prev.findIndex(
          (s) => JSON.stringify(s.messages) === JSON.stringify(currentMessages),
        )

        if (existingSessionIndex >= 0) {
          // Update existing session
          const updated = [...prev]
          updated[existingSessionIndex] = {
            ...updated[existingSessionIndex],
            timestamp: new Date().toISOString(),
          }
          saveToStorage("finai-chat-sessions", updated)
          return updated
        } else {
          // Add new session
          const updated = [newSession, ...prev]
          saveToStorage("finai-chat-sessions", updated)
          return updated
        }
      })
    }
  }, [currentMessages])

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSessionToDelete(id)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    if (!sessionToDelete) return

    setSessions((prev) => {
      const updated = prev.filter((s) => s.id !== sessionToDelete)
      saveToStorage("finai-chat-sessions", updated)
      return updated
    })

    setShowDeleteConfirm(false)
    setSessionToDelete(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Chat History</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onNewChat}
          className="flex items-center gap-1 text-teal-600 border-teal-200 hover:bg-teal-50 hover:text-teal-700 dark:text-teal-400 dark:border-teal-800 dark:hover:bg-teal-900/30"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No chat history yet</p>
          </div>
        ) : (
          sessions.map((session) => (
            <Card
              key={session.id}
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              onClick={() => onSelectSession(session.messages)}
            >
              <CardContent className="p-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h4 className="font-medium text-sm">{session.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{session.preview}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-gray-400 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(session.timestamp)}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-gray-400 hover:text-red-500"
                      onClick={(e) => handleDeleteSession(session.id, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Chat Session</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this chat session? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
