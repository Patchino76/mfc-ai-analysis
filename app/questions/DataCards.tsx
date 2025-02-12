"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { BarChart2, Table, Send, ChevronsUpDown, Check, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Parameter } from "./page"
import { QuestionResponse, useGenerateQuestion } from "../hooks/useChat"

interface DataCardsProps {
  parameters: Parameter[]
  exampleQuestions: string[]
}

export const DataCards = ({parameters, exampleQuestions }: DataCardsProps) => {
  const [selectedQuestion, setSelectedQuestion] = useState<string>("")
  const [selectedParameters, setSelectedParameters] = useState<Parameter[]>(parameters)
  const [openParams, setOpenParams] = useState(false)
  const [customQuestions, setCustomQuestions] = useState<string[]>([])
  const [newQuestion, setNewQuestion] = useState("")
  const [activeTab, setActiveTab] = useState("example")
  const [openQuestionSelector, setOpenQuestionSelector] = useState(false)

  const { mutate: generateQuestion, data, isLoading } = useGenerateQuestion();

  useEffect(() => {
    if (data) {
      console.log("Generated questions:", data);
    }
  }, [data]);

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
    console.log("Sending data:", item)
    // Here you would implement the actual sending logic
  }

  const handleParameterChange = (parameterName: string) => {
    setSelectedParameters((prevParameters) =>
      prevParameters.map((param) => (param.name === parameterName ? { ...param, checked: !param.checked } : param)),
    )
  }

  const handleGenerate = () => {
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
    const updatedQuestions = customQuestions.filter(q => q !== questionToRemove)
    setCustomQuestions(updatedQuestions)
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
          <div className="flex items-center space-x-4">
            <Popover open={openParams} onOpenChange={setOpenParams}>
              <PopoverTrigger asChild>
                <Button
                  id="parameters"
                  variant="outline"
                  role="combobox"
                  aria-expanded={openParams}
                  className="flex-1 justify-between"
                >
                  Изберете параметри
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <div className="flex items-center justify-between p-2 border-b">
                    <CommandInput placeholder="Избор на параметри..." className="h-9" />
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
                    <CommandEmpty>Няма намерен параметър.</CommandEmpty>
                    <CommandGroup>
                      {selectedParameters.map((param) => (
                        <CommandItem key={param.name} onSelect={() => handleParameterChange(param.name)}>
                          <Checkbox
                            checked={param.checked}
                            onCheckedChange={() => handleParameterChange(param.name)}
                            className="mr-2"
                          />
                          {param.name}
                          <Check className={cn("ml-auto h-4 w-4", param.checked ? "opacity-100" : "opacity-0")} />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Button onClick={handleGenerate}>Generate</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-fr">
        {data?.map((item, index) => (
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
                <strong>Expected Response:</strong> {item.response}
              </CardDescription>
              <CardDescription className="mt-1">
                <strong>Goal:</strong> {item.goal}
              </CardDescription>
            </CardContent>
            <CardFooter className="flex justify-end pt-2">
              <Button size="sm" onClick={() => handleSend(item)} className="px-3 py-1">
                <Send className="mr-2 h-4 w-4" /> Send
              </Button>
            </CardFooter>
          </Card>
        ))}
        {!data && (
          <div className="col-span-2 text-center py-8 text-muted-foreground">
            No questions generated yet. Select parameters and generate questions to see them here.
          </div>
        )}
      </div>
    </div>
  )
}
