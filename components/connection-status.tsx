"use client"

import { useEffect, useState } from "react"
import { useOnlineStatus } from "@/hooks/use-online-status"
import { Wifi, WifiOff } from "lucide-react"
import { cn } from "@/lib/utils"

export function ConnectionStatus() {
  const isOnline = useOnlineStatus()
  const [showNotification, setShowNotification] = useState(false)
  const [initialRender, setInitialRender] = useState(true)

  useEffect(() => {
    // Skip the first render to avoid showing notification on page load
    if (initialRender) {
      setInitialRender(false)
      return
    }

    // Show notification when online status changes
    setShowNotification(true)

    // Hide notification after 3 seconds
    const timer = setTimeout(() => {
      setShowNotification(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [isOnline, initialRender])

  if (!showNotification) return null

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-lg transition-all duration-300",
        isOnline
          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
      )}
    >
      {isOnline ? (
        <>
          <Wifi className="h-4 w-4" />
          <span>You're back online</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4" />
          <span>You're offline. Messages will be queued.</span>
        </>
      )}
    </div>
  )
}
