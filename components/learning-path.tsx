"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Lock, PlayCircle, BookOpen, Award, Clock } from "lucide-react"
import { saveToStorage, getFromStorage, STORAGE_KEYS } from "@/lib/storage-service"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Module {
  id: string
  title: string
  description: string
  duration: string
  level: "Beginner" | "Intermediate" | "Advanced"
  completed: boolean
  locked: boolean
  content?: string
  quiz?: Quiz[]
}

interface Quiz {
  question: string
  options: string[]
  correctAnswer: number
}

export function LearningPath() {
  const [modules, setModules] = useState<Module[]>([
    {
      id: "basics",
      title: "Financial Basics",
      description: "Learn the fundamentals of personal finance and budgeting",
      duration: "30 min",
      level: "Beginner",
      completed: false,
      locked: false,
      content:
        "Financial literacy is the ability to understand and effectively use various financial skills, including personal financial management, budgeting, and investing. The main areas of financial literacy include:\n\n1. **Budgeting**: Creating a plan for your money to ensure you have enough for your needs, wants, and savings.\n\n2. **Debt Management**: Understanding different types of debt and how to manage them effectively.\n\n3. **Saving**: Setting aside money for future needs and emergencies.\n\n4. **Investing**: Growing your money by putting it into financial vehicles that have the potential to generate returns.",
      quiz: [
        {
          question: "What is the 50/30/20 rule in budgeting?",
          options: [
            "50% needs, 30% wants, 20% savings",
            "50% savings, 30% needs, 20% wants",
            "50% wants, 30% savings, 20% needs",
            "50% investments, 30% needs, 20% wants",
          ],
          correctAnswer: 0,
        },
        {
          question: "Which of the following is NOT a good emergency fund goal?",
          options: [
            "3-6 months of living expenses",
            "1 month of salary",
            "1 year of living expenses",
            "Enough to cover a major car repair",
          ],
          correctAnswer: 1,
        },
      ],
    },
    {
      id: "savings",
      title: "Saving Strategies",
      description: "Discover effective ways to save money and build an emergency fund",
      duration: "45 min",
      level: "Beginner",
      completed: false,
      locked: true,
      content:
        "Saving money is a crucial part of financial health. Here are key strategies:\n\n1. **Automate Your Savings**: Set up automatic transfers to your savings account on payday.\n\n2. **Emergency Fund**: Aim to save 3-6 months of living expenses for unexpected events.\n\n3. **Set Clear Goals**: Define what you're saving for (home, education, retirement).\n\n4. **Use the 24-Hour Rule**: Wait 24 hours before making non-essential purchases to avoid impulse buying.\n\n5. **Track Your Spending**: Use apps or spreadsheets to monitor where your money goes.",
      quiz: [
        {
          question: "What is the recommended size for an emergency fund?",
          options: ["1 month of expenses", "3-6 months of expenses", "1 year of expenses", "As much as possible"],
          correctAnswer: 1,
        },
      ],
    },
    {
      id: "crypto",
      title: "Cryptocurrency Basics",
      description: "Understand blockchain, cryptocurrency, and digital wallets",
      duration: "60 min",
      level: "Intermediate",
      completed: false,
      locked: true,
      content:
        "Cryptocurrency is a digital or virtual currency that uses cryptography for security and operates on blockchain technology. Key concepts include:\n\n1. **Blockchain**: A distributed ledger technology that records all transactions across a network of computers.\n\n2. **Bitcoin**: The first and most well-known cryptocurrency, created in 2009.\n\n3. **Wallets**: Digital tools that store your private keys, allowing you to access and manage your cryptocurrency.\n\n4. **Mining**: The process by which new coins are created and transactions are verified.\n\n5. **Decentralization**: No central authority controls cryptocurrency, unlike traditional banking systems.",
      quiz: [
        {
          question: "What is blockchain?",
          options: [
            "A type of cryptocurrency",
            "A distributed ledger technology",
            "A digital wallet",
            "An online bank",
          ],
          correctAnswer: 1,
        },
      ],
    },
    {
      id: "investing",
      title: "Investment Fundamentals",
      description: "Learn about different investment options and strategies",
      duration: "90 min",
      level: "Intermediate",
      completed: false,
      locked: true,
      content:
        "Investing is putting money into assets with the expectation of generating income or profit. Key investment concepts include:\n\n1. **Stocks**: Ownership shares in a company.\n\n2. **Bonds**: Loans to a company or government that pay interest.\n\n3. **Mutual Funds**: Pooled investments managed by professionals.\n\n4. **ETFs (Exchange-Traded Funds)**: Similar to mutual funds but traded like stocks.\n\n5. **Diversification**: Spreading investments across different assets to reduce risk.\n\n6. **Risk vs. Return**: Generally, higher potential returns come with higher risk.",
      quiz: [
        {
          question: "What is diversification in investing?",
          options: [
            "Investing all your money in one promising stock",
            "Spreading investments across different assets to reduce risk",
            "Changing your investment strategy frequently",
            "Investing only in safe government bonds",
          ],
          correctAnswer: 1,
        },
      ],
    },
    {
      id: "advanced",
      title: "Advanced Financial Planning",
      description: "Master long-term financial planning and wealth building",
      duration: "120 min",
      level: "Advanced",
      completed: false,
      locked: true,
      content:
        "Advanced financial planning involves comprehensive strategies for long-term wealth building and preservation. Key areas include:\n\n1. **Retirement Planning**: Calculating needs and setting up appropriate accounts (401(k), IRA, etc.).\n\n2. **Tax Optimization**: Strategies to minimize tax burden legally.\n\n3. **Estate Planning**: Wills, trusts, and other tools to manage asset transfer.\n\n4. **Risk Management**: Insurance and other protections against financial setbacks.\n\n5. **Alternative Investments**: Real estate, private equity, and other non-traditional assets.",
      quiz: [
        {
          question: "Which of the following is NOT typically part of estate planning?",
          options: ["Creating a will", "Setting up trusts", "Day trading stocks", "Designating beneficiaries"],
          correctAnswer: 2,
        },
      ],
    },
  ])

  const [activeModule, setActiveModule] = useState<Module | null>(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<number[]>([])
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizScore, setQuizScore] = useState(0)

  // Load saved progress on component mount
  useEffect(() => {
    const savedModules = getFromStorage<Module[]>(STORAGE_KEYS.LEARNING_PROGRESS, [])

    if (savedModules && savedModules.length > 0) {
      setModules((prevModules) => {
        // Merge saved completion status with current modules
        return prevModules.map((module) => {
          const savedModule = savedModules.find((m) => m.id === module.id)
          if (savedModule) {
            return {
              ...module,
              completed: savedModule.completed,
              locked: savedModule.locked,
            }
          }
          return module
        })
      })
    }
  }, [])

  // Save progress whenever modules change
  useEffect(() => {
    // Only save after initial load
    if (modules.some((m) => m.completed)) {
      saveToStorage(
        STORAGE_KEYS.LEARNING_PROGRESS,
        modules.map((m) => ({
          id: m.id,
          completed: m.completed,
          locked: m.locked,
        })),
      )
    }
  }, [modules])

  const completedCount = modules.filter((module) => module.completed).length
  const progress = (completedCount / modules.length) * 100

  const startModule = (module: Module) => {
    setActiveModule(module)
    setShowQuiz(false)
    setQuizAnswers([])
    setQuizCompleted(false)
  }

  const startQuiz = () => {
    if (!activeModule || !activeModule.quiz) return
    setQuizAnswers(new Array(activeModule.quiz.length).fill(-1))
    setShowQuiz(true)
    setQuizCompleted(false)
    setQuizScore(0)
  }

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setQuizAnswers((prev) => {
      const newAnswers = [...prev]
      newAnswers[questionIndex] = answerIndex
      return newAnswers
    })
  }

  const submitQuiz = () => {
    if (!activeModule || !activeModule.quiz) return

    let score = 0
    activeModule.quiz.forEach((question, index) => {
      if (quizAnswers[index] === question.correctAnswer) {
        score++
      }
    })

    const percentage = (score / activeModule.quiz.length) * 100
    setQuizScore(percentage)
    setQuizCompleted(true)

    // Mark as completed if score is 70% or higher
    if (percentage >= 70) {
      completeModule(activeModule.id)
    }
  }

  const completeModule = (id: string) => {
    setModules((prev) =>
      prev.map((module) => {
        if (module.id === id) {
          // Mark this module as completed
          return { ...module, completed: true }
        } else if (module.locked) {
          // Find the index of the completed module
          const completedIndex = prev.findIndex((m) => m.id === id)
          // Find the index of the current module
          const currentIndex = prev.findIndex((m) => m.id === module.id)

          // If this module is the next one after the completed module, unlock it
          if (currentIndex === completedIndex + 1) {
            return { ...module, locked: false }
          }
        }
        return module
      }),
    )
  }

  const closeModuleView = () => {
    setActiveModule(null)
    setShowQuiz(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Financial Learning Path</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Master financial literacy with our structured learning modules
          </p>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {completedCount} of {modules.length} completed
          </div>
          <Progress
            value={progress}
            className="w-[180px] bg-gray-200 dark:bg-gray-800"
            indicatorClassName="bg-gradient-to-r from-purple-600 to-indigo-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((module) => (
          <Card
            key={module.id}
            className={`
              border border-gray-200 dark:border-gray-800 
              ${module.locked ? "opacity-70" : ""} 
              transition-all duration-300 hover:shadow-lg 
              ${!module.locked && "hover:border-purple-400 dark:hover:border-purple-600"}
              bg-white dark:bg-gray-900
            `}
          >
            <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-t-lg">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg text-gray-900 dark:text-gray-100">{module.title}</CardTitle>
                <Badge
                  variant={
                    module.level === "Beginner"
                      ? "default"
                      : module.level === "Intermediate"
                        ? "secondary"
                        : "destructive"
                  }
                  className={
                    module.level === "Beginner"
                      ? "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-100"
                      : module.level === "Intermediate"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"
                  }
                >
                  {module.level}
                </Badge>
              </div>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2 pt-4">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Clock className="h-4 w-4 mr-1" />
                Duration: {module.duration}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {module.locked ? (
                <Button variant="outline" disabled className="w-full border-gray-200 dark:border-gray-800">
                  <Lock className="mr-2 h-4 w-4" />
                  Locked
                </Button>
              ) : module.completed ? (
                <Button
                  variant="outline"
                  className="w-full border-green-200 text-green-700 hover:text-green-800 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20"
                  onClick={() => startModule(module)}
                >
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Review Module
                </Button>
              ) : (
                <Button
                  className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white"
                  onClick={() => startModule(module)}
                >
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Start Learning
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Module Content Dialog */}
      {activeModule && (
        <Dialog open={!!activeModule} onOpenChange={() => closeModuleView()}>
          <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <BookOpen className="h-5 w-5 text-purple-500" />
                {activeModule.title}
                <Badge
                  className={
                    activeModule.level === "Beginner"
                      ? "bg-green-100 text-green-800 ml-2"
                      : activeModule.level === "Intermediate"
                        ? "bg-blue-100 text-blue-800 ml-2"
                        : "bg-amber-100 text-amber-800 ml-2"
                  }
                >
                  {activeModule.level}
                </Badge>
              </DialogTitle>
              <DialogDescription className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-gray-500" />
                <span>{activeModule.duration}</span>
              </DialogDescription>
            </DialogHeader>

            {!showQuiz ? (
              <>
                <div className="space-y-4 py-4">
                  <div className="prose dark:prose-invert max-w-none">
                    {activeModule.content?.split("\n\n").map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={closeModuleView}>
                    Close
                  </Button>
                  {activeModule.quiz && activeModule.quiz.length > 0 && (
                    <Button
                      onClick={startQuiz}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                    >
                      Take Quiz
                    </Button>
                  )}
                </DialogFooter>
              </>
            ) : (
              <div className="space-y-6 py-4">
                {quizCompleted ? (
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                      <Award className={`h-12 w-12 ${quizScore >= 70 ? "text-green-500" : "text-amber-500"}`} />
                    </div>
                    <h3 className="text-xl font-bold">Quiz Results</h3>
                    <p className="text-lg">
                      You scored <span className="font-bold">{quizScore}%</span>
                    </p>
                    {quizScore >= 70 ? (
                      <div className="text-green-600 dark:text-green-400">
                        <p>Congratulations! You've passed this module.</p>
                        {!activeModule.completed && <p>This module has been marked as completed.</p>}
                      </div>
                    ) : (
                      <p className="text-amber-600 dark:text-amber-400">
                        You need 70% to pass. Review the material and try again.
                      </p>
                    )}
                    <div className="flex justify-center gap-4 pt-4">
                      <Button variant="outline" onClick={() => setShowQuiz(false)}>
                        Review Material
                      </Button>
                      <Button
                        onClick={closeModuleView}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold">Module Quiz</h3>
                    <p>Complete this quiz to test your knowledge and mark the module as completed.</p>

                    {activeModule.quiz?.map((question, qIndex) => (
                      <div key={qIndex} className="space-y-3 border-b border-gray-200 dark:border-gray-800 pb-6">
                        <h4 className="font-medium">
                          Question {qIndex + 1}: {question.question}
                        </h4>
                        <div className="space-y-2">
                          {question.options.map((option, oIndex) => (
                            <div
                              key={oIndex}
                              className={`
                                p-3 rounded-lg border cursor-pointer transition-colors
                                ${
                                  quizAnswers[qIndex] === oIndex
                                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                                    : "border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700"
                                }
                              `}
                              onClick={() => handleAnswerSelect(qIndex, oIndex)}
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    <Button
                      onClick={submitQuiz}
                      disabled={quizAnswers.some((a) => a === -1)}
                      className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white"
                    >
                      Submit Answers
                    </Button>
                  </>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
