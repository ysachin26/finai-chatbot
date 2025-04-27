/**
 * Offline message queue for storing messages when the user is offline
 */

// Define the message structure
export interface QueuedMessage {
  id: string
  content: string
  timestamp: number
  synced: boolean
}

// Local storage key
const QUEUE_STORAGE_KEY = "finai-message-queue"

/**
 * Add a message to the offline queue
 * @param content - The message content
 * @returns The queued message object
 */
export function queueMessage(content: string): QueuedMessage {
  const message: QueuedMessage = {
    id: generateId(),
    content,
    timestamp: Date.now(),
    synced: false,
  }

  // Get existing queue
  const queue = getQueue()

  // Add new message
  queue.push(message)

  // Save updated queue
  saveQueue(queue)

  return message
}

/**
 * Get all queued messages
 * @returns Array of queued messages
 */
export function getQueue(): QueuedMessage[] {
  try {
    const queueJson = localStorage.getItem(QUEUE_STORAGE_KEY)
    return queueJson ? JSON.parse(queueJson) : []
  } catch (error) {
    console.error("Error retrieving message queue:", error)
    return []
  }
}

/**
 * Save the queue to local storage
 * @param queue - The message queue to save
 */
export function saveQueue(queue: QueuedMessage[]): void {
  try {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue))
  } catch (error) {
    console.error("Error saving message queue:", error)
  }
}

/**
 * Mark messages as synced
 * @param ids - Array of message IDs to mark as synced
 */
export function markAsSynced(ids: string[]): void {
  const queue = getQueue()

  const updatedQueue = queue.map((message) => {
    if (ids.includes(message.id)) {
      return { ...message, synced: true }
    }
    return message
  })

  saveQueue(updatedQueue)
}

/**
 * Remove synced messages from the queue
 */
export function cleanQueue(): void {
  const queue = getQueue()
  const updatedQueue = queue.filter((message) => !message.synced)
  saveQueue(updatedQueue)
}

/**
 * Get unsynced messages from the queue
 * @returns Array of unsynced messages
 */
export function getUnsyncedMessages(): QueuedMessage[] {
  return getQueue().filter((message) => !message.synced)
}

/**
 * Generate a unique ID for a message
 * @returns A unique ID string
 */
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
