import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Parameter } from '../questions/page'
import { QuestionResponse } from '../hooks/useChat'

interface QuestionState {
  selectedQuestion: string
  selectedParameters: Parameter[]
  customQuestions: string[]
  activeTab: string
  generatedData: QuestionResponse[] | null
  setSelectedQuestion: (question: string) => void
  setSelectedParameters: (parameters: Parameter[]) => void
  setCustomQuestions: (questions: string[]) => void
  setActiveTab: (tab: string) => void
  setGeneratedData: (data: QuestionResponse[] | null) => void
}

export const useQuestionStore = create<QuestionState>()(
  persist(
    (set) => ({
      selectedQuestion: "",
      selectedParameters: [],
      customQuestions: [],
      activeTab: "example",
      generatedData: null,
      setSelectedQuestion: (question) => set({ selectedQuestion: question }),
      setSelectedParameters: (parameters) => set({ selectedParameters: parameters }),
      setCustomQuestions: (questions) => set({ customQuestions: questions }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setGeneratedData: (data) => set({ generatedData: data })
    }),
    {
      name: 'question-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedQuestion: state.selectedQuestion,
        selectedParameters: state.selectedParameters,
        customQuestions: state.customQuestions,
        activeTab: state.activeTab,
        generatedData: state.generatedData
      })
    }
  )
)
