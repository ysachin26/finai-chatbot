import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LockKeyhole } from "lucide-react"
import Link from "next/link"

export default function LoginRedirect() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md border-teal-200 dark:border-teal-800">
        <CardHeader className="text-center">
          <div className="mx-auto bg-teal-100 dark:bg-teal-900 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
            <LockKeyhole className="h-6 w-6 text-teal-600 dark:text-teal-400" />
          </div>
          <CardTitle className="text-2xl">Login Required</CardTitle>
          <CardDescription>You need to be logged in to access this feature</CardDescription>
        </CardHeader>
        <CardContent className="text-center text-gray-600 dark:text-gray-400">
          <p>Please log in to your account to use the chat and wallet features.</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/login">
            <Button className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white">
              Go to Login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
