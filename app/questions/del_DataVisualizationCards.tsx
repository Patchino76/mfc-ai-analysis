import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart2, Table, Send } from "lucide-react"
import { DataItem } from "./dataTypes"

interface DataVisualizationCardsProps {
  data: DataItem[]
}

export const DataVisualizationCards: React.FC<DataVisualizationCardsProps> = ({ data }) => {
  const handleSend = (item: DataItem) => {
    console.log("Sending data:", item)
    // Here you would implement the actual sending logic
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {data.map((item, index) => (
        <Card
          key={index}
          className="flex flex-col shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
        >
          <CardHeader className="flex flex-row items-center justify-between py-2">
            <CardTitle className="text-sm font-medium">Question {index + 1}</CardTitle>
            {item.type === "dataframe" ? (
              <Table className="h-4 w-4 text-muted-foreground" />
            ) : (
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-2xl font-bold">{item.type === "dataframe" ? "Dataframe" : "Graph"}</div>
            <p className="text-xs text-muted-foreground mt-1">{item.question}</p>
            <CardDescription className="mt-2">
              <strong>Expected Response:</strong> {item.expectedResponse}
            </CardDescription>
            <CardDescription className="mt-1">
              <strong>Goal:</strong> {item.goal}
            </CardDescription>
          </CardContent>
          <CardFooter className="pt-2 pb-3 flex justify-end">
            <Button size="sm" onClick={() => handleSend(item)} className="px-3 py-1">
              <Send className="mr-2 h-4 w-4" /> Send
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
