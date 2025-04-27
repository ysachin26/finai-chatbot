import { LearningPath } from "@/components/learning-path"
import { FinancialSnippet } from "@/components/financial-snippet"
import { FinanceArticles } from "@/components/finance-articles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DailyUpdates } from "@/components/daily-updates"
import { VideoResources } from "@/components/video-resources"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, TrendingUp, Video, Newspaper } from "lucide-react"

export default function LearnPage() {
  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center gradient-text">Financial Education</h1>

      <Tabs defaultValue="paths" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="paths" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Learning Paths
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Video Resources
          </TabsTrigger>
          <TabsTrigger value="updates" className="flex items-center gap-2">
            <Newspaper className="h-4 w-4" />
            Daily Updates
          </TabsTrigger>
          <TabsTrigger value="articles" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Articles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="paths">
          <LearningPath />
        </TabsContent>

        <TabsContent value="videos">
          <VideoResources />
        </TabsContent>

        <TabsContent value="updates">
          <DailyUpdates />
        </TabsContent>

        <TabsContent value="articles">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-1">
              <FinancialSnippet />
            </div>
            <div className="md:col-span-2">
              <Card className="h-full border-indigo-200 dark:border-indigo-800">
                <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-t-lg">
                  <CardTitle>Financial Dictionary</CardTitle>
                  <CardDescription className="text-indigo-100">Common financial terms explained simply</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div>
                    <h3 className="font-bold text-indigo-900 dark:text-indigo-100">Blockchain</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      A digital ledger of transactions that is duplicated and distributed across a network of computer
                      systems.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-indigo-900 dark:text-indigo-100">Cryptocurrency</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      A digital or virtual currency that is secured by cryptography, making it nearly impossible to
                      counterfeit.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-indigo-900 dark:text-indigo-100">Stellar</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      An open-source blockchain network designed to facilitate cross-border transactions and connect
                      financial institutions.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-indigo-900 dark:text-indigo-100">Wallet</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      A digital tool that allows users to store and manage their cryptocurrency assets through private
                      and public keys.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <FinanceArticles />
        </TabsContent>
      </Tabs>
    </div>
  )
}
