import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, Clock, ExternalLink } from "lucide-react"

interface Article {
  id: string
  title: string
  description: string
  date: string
  readTime: string
  category: string
  imageUrl: string
  url: string
}

export function FinanceArticles() {
  const articles: Article[] = [
    {
      id: "article1",
      title: "Understanding Blockchain Technology",
      description: "A beginner's guide to blockchain technology and its applications beyond cryptocurrency.",
      date: "May 15, 2023",
      readTime: "8 min",
      category: "Blockchain",
      imageUrl: "/Images/blockchain.jpg",
      url: "#",
    },
    {
      id: "article2",
      title: "Financial Planning for Low-Income Households",
      description: "Practical strategies for building financial security with limited resources.",
      date: "June 3, 2023",
      readTime: "6 min",
      category: "Personal Finance",
      imageUrl: "/Images/financial-planning.jpg",
      url: "#",
    },
    {
      id: "article3",
      title: "Mobile Banking in Developing Regions",
      description: "How mobile banking is transforming financial access in underserved communities.",
      date: "April 22, 2023",
      readTime: "10 min",
      category: "Banking",
      imageUrl: "/Images/mobile-banking.jpg",
      url: "#",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Financial Articles</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Stay informed with the latest financial insights and knowledge
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Card
            key={article.id}
            className="overflow-hidden flex flex-col border-gray-200 dark:border-gray-700 transition-all duration-500 hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-700 group hover:-translate-y-1"
          >
            <div className="aspect-video w-full overflow-hidden relative">
              <img
                src={article.imageUrl || "/placeholder.svg?height=200&width=400"}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white text-sm font-medium">{article.description}</p>
              </div>
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Badge
                  variant="outline"
                  className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800/50 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50 transition-colors duration-300"
                >
                  {article.category}
                </Badge>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {article.readTime}
                </div>
              </div>
              <CardTitle className="text-lg mt-2 text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors duration-300">
                {article.title}
              </CardTitle>
              <CardDescription className="line-clamp-2">{article.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2 flex-grow">
              <div className="flex items-center text-xs text-gray-500">
                <CalendarDays className="h-3 w-3 mr-1" />
                {article.date}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full border-gray-200 text-purple-700 hover:text-purple-900 hover:bg-purple-50 hover:border-purple-300 dark:border-gray-700 dark:text-purple-400 dark:hover:bg-purple-900/30 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/40 transition-colors group-hover:border-purple-400 duration-300"
                asChild
              >
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  Read Article
                  <ExternalLink className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
