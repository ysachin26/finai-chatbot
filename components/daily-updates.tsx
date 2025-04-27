"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MarketUpdate {
  id: string;
  title: string;
  description: string;
  date: string;
  change: number;
  category: "Crypto" | "Stocks" | "Forex" | "Commodities";
  source: string;
  url: string;
}

interface NewsUpdate {
  id: string;
  title: string;
  description: string;
  date: string;
  category: "Policy" | "Technology" | "Markets" | "Economy";
  source: string;
  url: string;
  imageUrl: string;
}

export function DailyUpdates() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const marketUpdates: MarketUpdate[] = [
    {
      id: "market1",
      title: "Bitcoin (BTC)",
      description:
        "Bitcoin reaches new monthly high as institutional adoption increases.",
      date: currentDate,
      change: 3.45,
      category: "Crypto",
      source: "CoinDesk",
      url: "#",
    },
    {
      id: "market2",
      title: "Ethereum (ETH)",
      description:
        "Ethereum gains momentum following successful network upgrade.",
      date: currentDate,
      change: 5.12,
      category: "Crypto",
      source: "CryptoNews",
      url: "#",
    },
    {
      id: "market3",
      title: "S&P 500",
      description:
        "S&P 500 dips slightly as investors await Federal Reserve announcement.",
      date: currentDate,
      change: -0.32,
      category: "Stocks",
      source: "MarketWatch",
      url: "#",
    },
    {
      id: "market4",
      title: "Gold",
      description: "Gold prices stabilize amid global economic uncertainty.",
      date: currentDate,
      change: 0.18,
      category: "Commodities",
      source: "Bloomberg",
      url: "#",
    },
    {
      id: "market5",
      title: "EUR/USD",
      description:
        "Euro strengthens against dollar following positive economic data.",
      date: currentDate,
      change: 0.75,
      category: "Forex",
      source: "Reuters",
      url: "#",
    },
    {
      id: "market6",
      title: "Stellar (XLM)",
      description:
        "Stellar Lumens shows strong performance as adoption grows in cross-border payments.",
      date: currentDate,
      change: 4.23,
      category: "Crypto",
      source: "CoinTelegraph",
      url: "#",
    },
  ];

  const newsUpdates: NewsUpdate[] = [
    {
      id: "news1",
      title: "Central Banks Consider Digital Currency Regulations",
      description:
        "Major central banks are discussing new regulatory frameworks for digital currencies and stablecoins.",
      date: currentDate,
      category: "Policy",
      source: "Financial Times",
      url: "https://www.imf.org/en/Topics/digital-payments-and-finance/central-bank-digital-currency/virtual-handbook",
      imageUrl: "/Images/largest-bank-1536x864.jpg",
    },
    {
      id: "news2",
      title: "New Blockchain Solution for Cross-Border Payments",
      description:
        "A consortium of banks launches a new blockchain-based solution to reduce costs and time for international transfers.",
      date: currentDate,
      category: "Technology",
      source: "TechCrunch",
      url: "https://www.investopedia.com/terms/b/blockchain.asp",
      imageUrl: "/Images/blockchain.jpg",
    },
    {
      id: "news3",
      title: "Global Markets React to Inflation Data",
      description:
        "Markets show mixed reactions as inflation data exceeds expectations in several economies.",
      date: currentDate,
      category: "Markets",
      source: "Wall Street Journal",
      url: "https://www.ig.com/en/trading-strategies/how-does-inflation-affect-the-stock-market-210423",
      imageUrl: "Images/global-market.jpg",
    },
    {
      id: "news4",
      title: "Stellar Network Adoption Grows in Banking Sector",
      description:
        "More financial institutions are adopting the Stellar blockchain for efficient cross-border transactions.",
      date: currentDate,
      category: "Technology",
      source: "Blockchain News",
      url: "https://stellar.org/learn/the-power-of-stellar",
      imageUrl: "Images/stellar.jpeg",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Daily Financial Updates
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Stay informed with the latest financial news and market trends
        </p>
      </div>

      <Tabs defaultValue="market" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="market">Market Updates</TabsTrigger>
          <TabsTrigger value="news">Financial News</TabsTrigger>
        </TabsList>

        <TabsContent value="market">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketUpdates.map((update) => (
              <Card
                key={update.id}
                className="border-indigo-200 dark:border-indigo-800 hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge
                      variant="outline"
                      className="bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800/50"
                    >
                      {update.category}
                    </Badge>
                    <div
                      className={`flex items-center ${
                        update.change >= 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {update.change >= 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      <span className="font-medium">
                        {update.change >= 0 ? "+" : ""}
                        {update.change}%
                      </span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{update.title}</CardTitle>
                  <CardDescription>{update.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0 pb-4">
                  <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <CalendarDays className="h-3 w-3 mr-1" />
                      {update.date}
                    </div>
                    <div>Source: {update.source}</div>
                  </div>
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 h-auto mt-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                    asChild
                  >
                    <a
                      href={update.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      Read more <ArrowRight className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="news">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {newsUpdates.map((news) => (
              <Card
                key={news.id}
                className="overflow-hidden border-indigo-200 dark:border-indigo-800 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3">
                    <img
                      src={news.imageUrl || "/placeholder.svg"}
                      alt={news.title}
                      className="w-full h-full object-cover aspect-video md:aspect-square"
                    />
                  </div>
                  <div className="md:w-2/3 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge
                        variant="outline"
                        className="bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800/50"
                      >
                        {news.category}
                      </Badge>
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <CalendarDays className="h-3 w-3 mr-1" />
                        {news.date}
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {news.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {news.description}
                    </p>
                    <div className="flex justify-between items-center mt-auto">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Source: {news.source}
                      </div>
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 h-auto text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                        asChild
                      >
                        <a
                          href={news.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center"
                        >
                          Read full article{" "}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
