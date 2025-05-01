import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {
  Globe,
  MessageSquare,
  Wallet,
  BookOpen,
  Shield,
  Zap,
} from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative cosmic-bg text-white py-20">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1200')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">FinAI</h1>
            <p className="text-xl md:text-2xl mb-8">
              Your Multilingual Financial Assistant Powered by Groq & Stellar
            </p>
            <p className="text-lg mb-10 text-indigo-100">
              Access financial services, manage your blockchain wallet, and
              improve your financial literacy in your preferred language.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button
                  size="lg"
                  className="text-lg px-8 bg-white text-indigo-700 hover:bg-indigo-50 hover:scale-105 transition-all duration-300"
                >
                  Get Started
                </Button>
              </Link>
              <Link href="/learn">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 border-white text-white hover:bg-white/20 hover:scale-105 transition-all duration-300"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
            Key Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="overflow-hidden border-t-4 border-t-indigo-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
              <CardHeader className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-950/50 transition-colors duration-300 group-hover:from-indigo-50 group-hover:to-indigo-100 dark:group-hover:from-indigo-950/50 dark:group-hover:to-indigo-900/50">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-indigo-500 group-hover:scale-110 transition-transform duration-300" />
                  Multilingual Support
                </CardTitle>
                <CardDescription>
                  Communicate in your preferred language
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-slate-600 dark:text-slate-300">
                  Our AI assistant understands and responds in multiple
                  languages, making financial services accessible to everyone
                  regardless of their native language.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-t-4 border-t-blue-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
              <CardHeader className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950/50 transition-colors duration-300 group-hover:from-blue-50 group-hover:to-blue-100 dark:group-hover:from-blue-950/50 dark:group-hover:to-blue-900/50">
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                  Blockchain Wallet
                </CardTitle>
                <CardDescription>
                  Secure transactions via Stellar
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-slate-600 dark:text-slate-300">
                  Create a wallet, send/receive funds, and check your balance
                  using the secure Stellar blockchain network for fast and
                  low-cost transactions.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-t-4 border-t-indigo-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
              <CardHeader className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-950/50 transition-colors duration-300 group-hover:from-indigo-50 group-hover:to-indigo-100 dark:group-hover:from-indigo-950/50 dark:group-hover:to-indigo-900/50">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-indigo-500 group-hover:scale-110 transition-transform duration-300" />
                  AI-Powered Assistance
                </CardTitle>
                <CardDescription>
                  Fast and context-aware responses
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-slate-600 dark:text-slate-300">
                  Get instant help with financial questions, transaction
                  guidance, and personalized advice powered by Groq's advanced
                  AI technology.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-t-4 border-t-blue-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
              <CardHeader className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950/50 transition-colors duration-300 group-hover:from-blue-50 group-hover:to-blue-100 dark:group-hover:from-blue-950/50 dark:group-hover:to-blue-900/50">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                  Financial Education
                </CardTitle>
                <CardDescription>Learn at your own pace</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-slate-600 dark:text-slate-300">
                  Access structured learning paths, financial tips, and
                  educational resources to improve your financial literacy and
                  make better decisions.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-t-4 border-t-indigo-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
              <CardHeader className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-950/50 transition-colors duration-300 group-hover:from-indigo-50 group-hover:to-indigo-100 dark:group-hover:from-indigo-950/50 dark:group-hover:to-indigo-900/50">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-indigo-500 group-hover:scale-110 transition-transform duration-300" />
                  Fraud Detection
                </CardTitle>
                <CardDescription>Enhanced transaction security</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-slate-600 dark:text-slate-300">
                  Our intelligent system analyzes transactions for suspicious
                  patterns, protecting you from fraud and ensuring your
                  financial security.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-t-4 border-t-blue-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
              <CardHeader className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950/50 transition-colors duration-300 group-hover:from-blue-50 group-hover:to-blue-100 dark:group-hover:from-blue-950/50 dark:group-hover:to-blue-900/50">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                  Voice Interaction
                </CardTitle>
                <CardDescription>Speak instead of typing</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-slate-600 dark:text-slate-300">
                  Use voice commands and dictation to interact with the
                  assistant, making it accessible for users who prefer speaking
                  over typing.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
            How It Works
          </h2>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-indigo-200 dark:bg-indigo-900"></div>

              <div className="relative z-10 mb-12 group">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-gradient-to-r from-indigo-600 to-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold group-hover:scale-110 group-hover:from-indigo-500 group-hover:to-blue-500 transition-all duration-300">
                    1
                  </div>
                  <div className="ml-8 p-4 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors duration-300">
                    <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
                      Create Your Account
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      Sign up with a simple OTP verification process to get
                      started with FinAI.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative z-10 mb-12 group">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-gradient-to-r from-indigo-600 to-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold group-hover:scale-110 group-hover:from-indigo-500 group-hover:to-blue-500 transition-all duration-300">
                    2
                  </div>
                  <div className="ml-8 p-4 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors duration-300">
                    <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
                      Set Up Your Wallet
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      Create your Stellar blockchain wallet to send, receive,
                      and manage your funds securely.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative z-10 mb-12 group">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-gradient-to-r from-indigo-600 to-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold group-hover:scale-110 group-hover:from-indigo-500 group-hover:to-blue-500 transition-all duration-300">
                    3
                  </div>
                  <div className="ml-8 p-4 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors duration-300">
                    <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
                      Chat with FinAI
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      Ask questions, get financial advice, and manage your
                      finances in your preferred language.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative z-10 group">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-gradient-to-r from-indigo-600 to-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold group-hover:scale-110 group-hover:from-indigo-500 group-hover:to-blue-500 transition-all duration-300">
                    4
                  </div>
                  <div className="ml-8 p-4 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors duration-300">
                    <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
                      Learn and Grow
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      Improve your financial literacy with our structured
                      learning paths and educational resources.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 cosmic-bg text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join FinAI today and experience the future of financial assistance,
            powered by Groq AI and Stellar blockchain.
          </p>
          <Link href="/chat">
            <Button
              size="lg"
              className="text-lg px-8 bg-white text-indigo-700 hover:bg-indigo-50 hover:scale-105 transition-all duration-300"
            >
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
