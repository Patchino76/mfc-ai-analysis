import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { ChatMessage } from '../chat/page'

interface ChatState {
    chatHistory: ChatMessage[]
    currentMessage: string
    useMatplotlib: boolean
    setChatHistory: (history: ChatMessage[]) => void
    setCurrentMessage: (message: string) => void
    addMessage: (message: ChatMessage) => void
    clearChat: () => void
    togglePlottingPreference: () => void
    setUseMatplotlib: (value: boolean) => void
}

export const useChatStore = create<ChatState>()(
    persist(
        (set) => ({
            chatHistory: [],
            currentMessage: "",
            useMatplotlib: true,
            setChatHistory: (history) => set({ chatHistory: history }),
            setCurrentMessage: (message) => set({ currentMessage: message }),
            addMessage: (message) => 
                set((state) => ({ 
                    chatHistory: [...state.chatHistory, message]
                })),
            clearChat: () => set({ chatHistory: [], currentMessage: "" }),
            togglePlottingPreference: () => 
                set((state) => ({ useMatplotlib: !state.useMatplotlib })),
            setUseMatplotlib: (value) => set({ useMatplotlib: value })
        }),
        {
            name: 'chat-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                chatHistory: state.chatHistory,
                currentMessage: state.currentMessage,
                useMatplotlib: state.useMatplotlib
            })
        }
    )
)
