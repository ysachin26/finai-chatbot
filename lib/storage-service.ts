/**
 * Storage service for persisting data locally
 */

// Define storage keys
const STORAGE_KEYS = {
  WALLET: "finai-wallet",
  LEARNING_PROGRESS: "finai-learning-progress",
  USER_PREFERENCES: "finai-user-preferences",
}

/**
 * Save data to local storage
 * @param key - Storage key
 * @param data - Data to store
 */
export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Error saving to storage (${key}):`, error)
  }
}

/**
 * Get data from local storage
 * @param key - Storage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns The stored data or default value
 */
export function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const storedData = localStorage.getItem(key)
    return storedData ? JSON.parse(storedData) : defaultValue
  } catch (error) {
    console.error(`Error retrieving from storage (${key}):`, error)
    return defaultValue
  }
}

/**
 * Remove data from local storage
 * @param key - Storage key
 */
export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Error removing from storage (${key}):`, error)
  }
}

// Export storage keys
export { STORAGE_KEYS }
