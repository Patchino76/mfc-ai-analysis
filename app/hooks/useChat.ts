import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface ChatResponse {
    dataframe?: Record<string, any>[];
    text?: string;
}

export function useChat() {
  return useMutation<ChatResponse, Error, string>({
      mutationFn: async (query: string) => {
          const response = await axios.get<ChatResponse>("http://localhost:8000/chat", 
              { params: { query } });
          return response.data;
      }
  });
}