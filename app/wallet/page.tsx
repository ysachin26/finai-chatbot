"use client";
import WalletInterface from "@/components/wallet-interface";
import { ConnectionStatus } from "@/components/connection-status";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Wallet, Shield, History, ExternalLink } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import LoginRedirect from "@/components/login-redirect";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinancialSnippet } from "@/components/financial-snippet";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { getFromStorage } from "@/lib/storage-service";
import { MicroInvestments } from "@/components/micro-investments";
import { CreditScoring } from "@/components/credit-scoring";

export default function WalletPage() {
  const { isLoggedIn, isLoading } = useAuth();
  const [walletData, setWalletData] = useState<any>(null);
  const [network, setNetwork] = useState<string>("testnet");

  useEffect(() => {
    if (isLoggedIn) {
      const savedWallet = getFromStorage("finai-wallet", null);
      if (savedWallet) {
        setWalletData(savedWallet);
      }

      // Get network from environment variable
      const stellarNetwork =
        process.env.NEXT_PUBLIC_STELLAR_NETWORK || "TESTNET";
      setNetwork(stellarNetwork.toLowerCase());
    }
  }, [isLoggedIn]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        Loading...
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginRedirect />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <div className="mb-6 flex items-center gap-3">
          <Wallet className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-2xl font-bold gradient-text">Stellar Wallet</h1>
        </div>

        <Card className="border-indigo-200 dark:border-indigo-800 mb-6">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-t-lg">
            <CardTitle>Your Digital Wallet</CardTitle>
            <CardDescription className="text-indigo-100">
              Manage your Stellar assets securely and efficiently
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <WalletInterface />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <MicroInvestments />
          <CreditScoring />
        </div>

        <Card className="border-indigo-200 dark:border-indigo-800 mb-6">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Transaction Verification Guide
            </CardTitle>
            <CardDescription className="text-indigo-100">
              How to verify your Stellar transactions on the blockchain
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">
                  Verifying Your Transactions
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  All transactions on the Stellar network are recorded on the
                  public blockchain. You can verify any transaction by following
                  these steps:
                </p>
                <ol className="list-decimal pl-5 space-y-2 text-gray-600 dark:text-gray-400">
                  <li>
                    Copy your transaction ID (available in your transaction
                    history) or your wallet's public key
                  </li>
                  <li>
                    Visit the Stellar Explorer website for the{" "}
                    {network === "public" ? "public" : "testnet"} network
                  </li>
                  <li>
                    Paste your transaction ID or public key in the search box
                  </li>
                  <li>
                    View the complete transaction details, including status,
                    amount, and timestamp
                  </li>
                </ol>
              </div>

              <div className="flex justify-center mt-4">
                <Button
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
                  onClick={() => {
                    if (walletData && walletData.publicKey) {
                      window.open(
                        `https://stellar.expert/explorer/${network}/account/${walletData.publicKey}`,
                        "_blank"
                      );
                    } else {
                      window.open(
                        `https://stellar.expert/explorer/${network}`,
                        "_blank"
                      );
                    }
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Stellar Explorer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <FinancialSnippet />

        <Card className="border-indigo-200 dark:border-indigo-800">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="security" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="tips">Usage Tips</TabsTrigger>
              </TabsList>
              <TabsContent value="security">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>Never share your private key with anyone</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>
                      Double-check recipient addresses before sending funds
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>Use a strong, unique password for your wallet</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>Be cautious of phishing attempts and scams</span>
                  </li>
                </ul>
              </TabsContent>
              <TabsContent value="tips">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 font-bold">•</span>
                    <span>
                      Use the memo field to add notes to your transactions
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 font-bold">•</span>
                    <span>
                      Keep a small amount of XLM in your account as a reserve
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 font-bold">•</span>
                    <span>Regularly check your transaction history</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 font-bold">•</span>
                    <span>
                      Use the chat assistant for help with wallet operations
                    </span>
                  </li>
                </ul>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="border-indigo-200 dark:border-indigo-800 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Transaction History
            </CardTitle>
            <CardDescription className="text-indigo-100">
              Your recent wallet activity
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            {walletData &&
            walletData.transactionHistory &&
            walletData.transactionHistory.length > 0 ? (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {walletData.transactionHistory
                  .slice(0, 5)
                  .map((tx: any, index: number) => (
                    <div
                      key={tx.id}
                      className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg flex justify-between items-center bg-white/50 dark:bg-gray-800/50"
                    >
                      <div>
                        <div className="font-medium text-sm">
                          {tx.type === "sent" ? "Sent to" : "Received from"}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-[150px]">
                          {tx.type === "sent" ? tx.to : tx.from}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(tx.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <div
                        className={`font-medium ${
                          tx.type === "sent" ? "text-red-500" : "text-green-500"
                        }`}
                      >
                        {tx.type === "sent" ? "-" : "+"}
                        {tx.amount} XLM
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Your transaction history will appear here once you start using
                your wallet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <ConnectionStatus />
    </div>
  );
}
