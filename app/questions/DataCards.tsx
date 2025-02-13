"use client";
import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { BarChart2, Table, Send, ChevronsUpDown, Check, Plus, Trash2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Parameter } from "./page"
import { QuestionResponse, useGenerateQuestion } from "../hooks/useChat"
import { useRouter } from 'next/navigation';
import { useQuestionStore } from "../store/questionStore"

interface DataCardsProps {
  parameters: Parameter[]
  exampleQuestions: string[]
}

export const DataCards = ({parameters, exampleQuestions }: DataCardsProps) => {
  const router = useRouter();
  const {
    selectedQuestion,
    selectedParameters,
    customQuestions,
    activeTab,
    generatedData,
    setSelectedQuestion,
    setSelectedParameters,
    setCustomQuestions,
    setActiveTab,
    setGeneratedData
  } = useQuestionStore()
  
  const [openParams, setOpenParams] = useState(false)
  const [newQuestion, setNewQuestion] = useState("")
  const [openQuestionSelector, setOpenQuestionSelector] = useState(false)

  const { mutate: generateQuestion, data, isLoading } = useGenerateQuestion();

  // Initialize parameters on first load
  useEffect(() => {
    if (selectedParameters.length === 0) {
      setSelectedParameters(parameters)
    }
  }, [parameters, selectedParameters.length, setSelectedParameters])

  useEffect(() => {
    if (data) {
      console.log("Generated questions:", data);
      setGeneratedData(data);
    }
  }, [data, setGeneratedData]);

  // Log stored data for debugging
  useEffect(() => {
    console.log("Stored generatedData:", generatedData);
  }, [generatedData]);

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setSelectedQuestion("")
  }

  const handleAddCustomQuestion = () => {
    if (newQuestion.trim()) {
      setCustomQuestions([...customQuestions, newQuestion.trim()])
      setNewQuestion("")
    }
  }

  const handleSend = (item: QuestionResponse) => {
    const question = JSON.stringify(item, (key, value) => key === "id" ? undefined : value)
    router.push(`/chat?question=${encodeURIComponent(question)}`)
  }

  const handleSendUser = (content: string) => {
    router.push(`/chat?question=${encodeURIComponent(content)}`)
  }

  const handleParameterChange = (parameterName: string) => {
    setSelectedParameters(
      selectedParameters.map((param) => 
        param.name === parameterName ? { ...param, checked: !param.checked } : param
      )
    )
  }

  const handleGenerate = () => {
    // Clear existing data first
    setGeneratedData(null);
    
    const selectedParams = selectedParameters
      .filter((p) => p.checked)
      .map((p) => p.name)
      .join(", ");
      
    generateQuestion({
      question: selectedQuestion,
      selectedParams
    });
  }

  const handleRemoveQuestion = (questionToRemove: string) => {
    setCustomQuestions(customQuestions.filter(q => q !== questionToRemove))
    if (selectedQuestion === questionToRemove) {
      setSelectedQuestion("")
    }
    setOpenQuestionSelector(false)
  }

  const handleClearParameters = () => {
    setSelectedParameters(parameters.map(param => ({ ...param, checked: false })))
  }

  const QuestionSelector = ({ 
    questions, 
    placeholder,
    allowRemove = false 
  }: { 
    questions: string[], 
    placeholder: string,
    allowRemove?: boolean 
  }) => (
    <Popover open={openQuestionSelector} onOpenChange={setOpenQuestionSelector}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between h-auto min-h-[40px] py-2"
        >
          {selectedQuestion ? (
            <div className="text-sm text-left line-clamp-2">
              {selectedQuestion}
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[600px] p-0">
        <Command>
          <CommandInput placeholder="Търсене на въпроси..." className="h-9" />
          <CommandList className="max-h-[400px] overflow-auto">
            <CommandEmpty>Няма намерени въпроси.</CommandEmpty>
            <CommandGroup>
              {questions.map((question, index) => (
                <CommandItem
                  key={index}
                  value={question}
                  onSelect={(currentValue) => {
                    setSelectedQuestion(currentValue)
                    setOpenQuestionSelector(false)
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-accent group"
                >
                  <div className="text-sm whitespace-pre-wrap pr-8 flex-1">
                    {question}
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    {selectedQuestion === question && (
                      <Check className="h-4 w-4 flex-shrink-0" />
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleSendUser(question)
                      }}
                      className="focus:outline-none"
                    >
                      <Send 
                        className="h-4 w-4 flex-shrink-0 text-primary opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity" 
                      />
                    </button>
                    {allowRemove && (
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleRemoveQuestion(question)
                        }}
                        className="focus:outline-none"
                      >
                        <Trash2 
                          className="h-4 w-4 flex-shrink-0 text-destructive opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity" 
                        />
                      </button>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Въпроси
          </label>
          <Tabs defaultValue="example" value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-2">
              <TabsTrigger value="example">Примерни въпроси</TabsTrigger>
              <TabsTrigger value="custom">Потребителски въпроси</TabsTrigger>
            </TabsList>
            <TabsContent value="example" className="mt-0">
              <QuestionSelector 
                questions={exampleQuestions} 
                placeholder="Изберете примерен въпрос"
                allowRemove={false}
              />
            </TabsContent>
            <TabsContent value="custom" className="mt-0">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Въведете вашия въпрос..."
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleAddCustomQuestion} type="button">
                    <Plus className="h-4 w-4 mr-2" />
                    Добави
                  </Button>
                </div>
                {customQuestions.length > 0 && (
                  <QuestionSelector 
                    questions={customQuestions} 
                    placeholder="Изберете потребителски въпрос"
                    allowRemove={true}
                  />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div>
          <label htmlFor="parameters" className="block text-sm font-medium text-gray-700 mb-1">
            Параметри
          </label>
          <div className="flex flex-col items-left space-y-2">
            <div className="flex gap-2">
              <Popover open={openParams} onOpenChange={setOpenParams} >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openParams}
                    className="w-full justify-between"
                  >
                    Parameters
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <div className="flex items-center justify-between p-2 border-b">
                      <CommandInput placeholder="Search parameters..." className="h-9" />
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          handleClearParameters()
                        }}
                        className="h-4 w-4 text-muted-foreground hover:text-destructive focus:outline-none"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <CommandList>
                      <CommandEmpty>No parameters found.</CommandEmpty>
                      <CommandGroup>
                        {selectedParameters.map((parameter) => (
                          <CommandItem
                            key={parameter.name}
                            onSelect={() => {
                              handleParameterChange(parameter.name)
                            }}
                          >
                            <Checkbox
                              checked={parameter.checked}
                              onCheckedChange={() => handleParameterChange(parameter.name)}
                              className="mr-2"
                            />
                            {parameter.name}
                            <Check className={cn("ml-auto h-4 w-4", parameter.checked ? "opacity-100" : "opacity-0")} />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <Button onClick={handleGenerate}>Генерирай</Button>
            </div>
            {selectedParameters.some(p => p.checked) && (
              <div className="text-sm text-muted-foreground">
                Selected: {selectedParameters.filter(p => p.checked).map(p => p.name).join(", ")}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-fr">
        {isLoading ? (
          <div className="col-span-2 flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : generatedData?.map((item, index) => (
          <Card
            key={index}
            className="shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2">
              <CardTitle className="text-sm font-medium">Question {index + 1}</CardTitle>
              {item.type === "dataframe" ? (
                <Table className="h-4 w-4 text-muted-foreground" />
              ) : (
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              )}
            </CardHeader>
            <CardContent className="py-2 flex-grow">
              <div className="text-2xl font-bold">{item.type === "dataframe" ? "Dataframe" : "Graph"}</div>
              <p className="text-xs text-muted-foreground mt-1">{item.question}</p>
              <CardDescription className="mt-2">
                <strong>Резултат:</strong> {item.response}
              </CardDescription>
              <CardDescription className="mt-1">
                <strong>Цел:</strong> {item.goal}
              </CardDescription>
            </CardContent>
            <CardFooter className="flex justify-end pt-2">
              <Button size="sm" onClick={() => handleSend(item)} className="px-3 py-1">
                <Send className="mr-2 h-4 w-4" /> Send 
              </Button>
            </CardFooter>
          </Card>
        ))}
        {!generatedData && !isLoading && (
          <div className="col-span-2 text-center py-8 text-muted-foreground">
            Все още няма генерирани въпроси. Изберете предефинирана тема, параметри и натиснете бутона "Генерирай".
          </div>
        )}
      </div>
    </div>
  )
}
