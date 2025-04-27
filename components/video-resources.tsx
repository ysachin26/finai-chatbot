"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Clock, BookOpen } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface VideoResource {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  level: "Beginner" | "Intermediate" | "Advanced"
  category: string
  embedUrl: string
}

export function VideoResources() {
  const [selectedVideo, setSelectedVideo] = useState<VideoResource | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const videos: VideoResource[] = [
    {
      id: "video1",
      title: "Introduction to Blockchain Technology",
      description: "Learn the fundamentals of blockchain technology and how it's revolutionizing finance.",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Blockchain+Basics",
      duration: "15:30",
      level: "Beginner",
      category: "Blockchain",
      embedUrl: "https://www.youtube.com/embed/SSo_EIwHSd4",
    },
    {
      id: "video2",
      title: "Understanding Stellar Blockchain",
      description: "A comprehensive guide to the Stellar blockchain network and its financial applications.",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Stellar+Network",
      duration: "22:45",
      level: "Intermediate",
      category: "Stellar",
      embedUrl: "https://www.youtube.com/embed/ixerXWJrDr0",
    },
    {
      id: "video3",
      title: "Personal Finance Basics",
      description: "Essential personal finance concepts everyone should know for financial well-being.",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Personal+Finance",
      duration: "18:20",
      level: "Beginner",
      category: "Personal Finance",
      embedUrl: "https://www.youtube.com/embed/HQzoZfc3GwQ",
    },
    {
      id: "video4",
      title: "Cryptocurrency Investment Strategies",
      description: "Advanced strategies for investing in cryptocurrencies and managing risk.",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Crypto+Investing",
      duration: "27:15",
      level: "Advanced",
      category: "Investing",
      embedUrl: "https://www.youtube.com/embed/Yb6825iv0Vk",
    },
    {
      id: "video5",
      title: "Digital Wallets Explained",
      description: "How to set up and securely manage your digital cryptocurrency wallet.",
      thumbnail: "/placeholder.svg?height=180&width=320&text=Digital+Wallets",
      duration: "12:40",
      level: "Beginner",
      category: "Security",
      embedUrl: "https://www.youtube.com/embed/AlwrxqVmtP8",
    },
    {
      id: "video6",
      title: "The Future of Decentralized Finance (DeFi)",
      description: "Exploring the growing world of DeFi and its potential to transform traditional banking.",
      thumbnail: "/placeholder.svg?height=180&width=320&text=DeFi+Future",
      duration: "31:05",
      level: "Advanced",
      category: "DeFi",
      embedUrl: "https://www.youtube.com/embed/H-O3r2YMWJ4",
    },
  ]

  const openVideoDialog = (video: VideoResource) => {
    setSelectedVideo(video)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Video Learning Resources</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Watch educational videos to enhance your financial knowledge
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Card
            key={video.id}
            className="overflow-hidden flex flex-col border-indigo-200 dark:border-indigo-800 transition-all duration-500 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 group"
          >
            <div className="aspect-video w-full overflow-hidden relative">
              <img
                src={video.thumbnail || "/placeholder.svg"}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Button
                  onClick={() => openVideoDialog(video)}
                  className="rounded-full w-16 h-16 bg-indigo-600/90 hover:bg-indigo-700 text-white"
                >
                  <Play className="h-8 w-8" />
                </Button>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {video.duration}
              </div>
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Badge
                  variant="outline"
                  className={`
                    ${
                      video.level === "Beginner"
                        ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50"
                        : video.level === "Intermediate"
                          ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50"
                          : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/50"
                    }
                  `}
                >
                  {video.level}
                </Badge>
                <Badge variant="secondary">{video.category}</Badge>
              </div>
              <CardTitle className="text-lg mt-2 text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors duration-300">
                {video.title}
              </CardTitle>
              <CardDescription className="line-clamp-2">{video.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 pb-4 mt-auto">
              <Button
                variant="outline"
                className="w-full mt-2 border-indigo-200 text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50 hover:border-indigo-300 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
                onClick={() => openVideoDialog(video)}
              >
                <Play className="h-4 w-4 mr-2" />
                Watch Video
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-500" />
              {selectedVideo?.title}
              <Badge
                className={
                  selectedVideo?.level === "Beginner"
                    ? "bg-green-100 text-green-800 ml-2"
                    : selectedVideo?.level === "Intermediate"
                      ? "bg-blue-100 text-blue-800 ml-2"
                      : "bg-amber-100 text-amber-800 ml-2"
                }
              >
                {selectedVideo?.level}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          <div className="aspect-video w-full">
            <iframe
              width="100%"
              height="100%"
              src={selectedVideo?.embedUrl}
              title={selectedVideo?.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-md"
            ></iframe>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{selectedVideo?.description}</p>
        </DialogContent>
      </Dialog>
    </div>
  )
}
