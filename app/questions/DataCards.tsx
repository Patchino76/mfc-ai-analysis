"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { DataItem, Parameter } from "./dataTypes"
import { BarChart2, Table, Send, ChevronsUpDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface DataCardsProps {
  data: DataItem[]
  parameters: Parameter[]
  exampleQuestions: string[]
}

export const DataCards: React.FC<DataCardsProps> = ({ data, parameters, exampleQuestions }) => {
  const [selectedQuestion, setSelectedQuestion] = useState<string>("")
  const [selectedParameters, setSelectedParameters] = useState<Parameter[]>(parameters)
  const [openParams, setOpenParams] = useState(false)

  const handleSend = (item: DataItem) => {
    console.log("Sending data:", item)
    // Here you would implement the actual sending logic
  }

  const handleParameterChange = (parameterName: string) => {
    setSelectedParameters((prevParameters) =>
      prevParameters.map((param) => (param.name === parameterName ? { ...param, checked: !param.checked } : param)),
    )
  }

  const handleGenerate = () => {
    console.log("Generating with:", {
      selectedQuestion,
      selectedParameters: selectedParameters.filter((p) => p.checked).map((p) => p.name),
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="example-questions" className="block text-sm font-medium text-gray-700 mb-1">
            Примерни въпроси
          </label>
          <Popover>
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
                  <span className="text-muted-foreground">Изберете въпрос</span>
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
                    {exampleQuestions.map((question, index) => (
                      <CommandItem
                        key={index}
                        value={question}
                        onSelect={() => setSelectedQuestion(question)}
                        className="px-4 py-2 cursor-pointer hover:bg-accent"
                      >
                        <div className="text-sm whitespace-pre-wrap pr-8">
                          {question}
                        </div>
                        {selectedQuestion === question && (
                          <Check className="ml-auto h-4 w-4 flex-shrink-0" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
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
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Избор на параметри..." />
                  <CommandList>
                    <CommandEmpty>No parameter found.</CommandEmpty>
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
        {data.map((item, index) => (
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
                <strong>Expected Response:</strong> {item.expectedResponse}
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
      </div>
    </div>
  )
}
