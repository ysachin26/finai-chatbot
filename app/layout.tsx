import type React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MainNav } from "@/components/main-nav";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FinAI - Multilingual Financial Chatbot",
  description:
    "A lightweight, multilingual financial assistant chatbot powered by Groq and Stellar",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#111827" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
              <header className="border-b bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-30 border-teal-100/50 dark:border-teal-900/30">
                <div className="container mx-auto px-4 py-3">
                  <MainNav />
                </div>
              </header>
              <main className="flex-1">
                <div className="container mx-auto px-4 py-8">{children}</div>
              </main>
              <footer className="border-t py-6 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm border-teal-100/50 dark:border-teal-900/30">
                <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  © {new Date().getFullYear()} FinAI. All rights reserved.
                </div>
              </footer>
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
