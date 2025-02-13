import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { DataRow } from '../chat/page'

interface BaseMessage {
    sender: "user" | "system";
    type: "text" | "table" | "image";
}

interface TextMessage extends BaseMessage {
    type: "text";
    text: string;
}

interface TableMessage extends BaseMessage {
    type: "table";
    data: DataRow[];
}

interface ImageMessage extends BaseMessage {
    type: "image";
    base64Data: string;
}

type ChatMessage = TextMessage | TableMessage | ImageMessage;

interface ChatState {
    chatHistory: ChatMessage[]
    currentMessage: string
    useMatplotlib: boolean
    setChatHistory: (history: ChatMessage[]) => void
    setCurrentMessage: (message: string) => void
    addMessage: (message: ChatMessage) => void
    clearChat: () => void
    togglePlottingPreference: () => void
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
                set((state) => ({ useMatplotlib: !state.useMatplotlib }))
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
