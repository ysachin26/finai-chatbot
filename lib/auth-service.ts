/**
 * Simple authentication service for the FinAI app
 * In a production app, you would use a more robust solution
 */

// Store OTP codes (in a real app, this would be in a database)
const otpStore: Record<string, { code: string; expires: number }> = {}

/**
 * Generate a random OTP code
 * @returns {string} A 6-digit OTP code
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Send an OTP to a phone number or email
 * This is a mock implementation - in a real app, you would integrate with an SMS or email service
 *
 * @param {string} destination - The phone number or email to send the OTP to
 * @returns {Promise<boolean>} Whether the OTP was sent successfully
 */
export async function sendOTP(destination: string): Promise<boolean> {
  try {
    const otp = generateOTP()

    // Store the OTP with a 10-minute expiration
    otpStore[destination] = {
      code: otp,
      expires: Date.now() + 10 * 60 * 1000, // 10 minutes
    }

    // In a real app, you would send the OTP via SMS or email here
    console.log(`[MOCK] Sending OTP ${otp} to ${destination}`)

    return true
  } catch (error) {
    console.error("Error sending OTP:", error)
    return false
  }
}

/**
 * Verify an OTP
 * @param {string} destination - The phone number or email the OTP was sent to
 * @param {string} otp - The OTP to verify
 * @returns {boolean} Whether the OTP is valid
 */
export function verifyOTP(destination: string, otp: string): boolean {
  const storedOTP = otpStore[destination]

  if (!storedOTP) {
    return false
  }

  // Check if the OTP has expired
  if (storedOTP.expires < Date.now()) {
    delete otpStore[destination]
    return false
  }

  // Check if the OTP matches
  if (storedOTP.code !== otp) {
    return false
  }

  // OTP is valid, remove it from the store
  delete otpStore[destination]
  return true
}
