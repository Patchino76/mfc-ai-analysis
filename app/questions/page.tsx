import { DataCards } from "./DataCards"
import { dataList } from "./dataTypes"

const parameters = [
  { name: "Parameter 1", checked: false },
  { name: "Parameter 2", checked: false },
  { name: "Parameter 3", checked: false },
  { name: "Parameter 4", checked: false },
  { name: "Parameter 5", checked: false },
  { name: "Parameter 6", checked: false },
  { name: "Parameter 7", checked: false },
  { name: "Parameter 8", checked: false },
  { name: "Parameter 9", checked: false },
  { name: "Parameter 10", checked: false },
]

const exampleQuestions = [
  "What is the correlation between X and Y?",
  "How does A affect B over time?",
  "Can you visualize the distribution of C?",
  "What's the trend of D in relation to E?",
  "How do F and G compare across different categories?",
  "What's the impact of H on I and J?",
  "Can you show the relationship between K, L, and M?",
  "How does N vary with changes in O?",
  "What's the pattern of P over the last Q periods?",
  "Can you analyze the factors influencing R?",
]

export default function QuestionsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-10 px-4 max-w-7xl">
        <h1 className="text-4xl font-bold mb-10 text-center">Data Visualization Questions</h1>
        <DataCards data={dataList} parameters={parameters} exampleQuestions={exampleQuestions} />
      </div>
    </main>
  )
}

