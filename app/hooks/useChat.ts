import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { apiBaseUrl } from "../config";

export interface ChatResponse {
    dataframe?: Record<string, any>[];
    text?: string;
    image?: string;
}

export function useChat() {
  return useMutation<ChatResponse, Error, string>({
      mutationFn: async (query: string) => {
          const response = await axios.get<ChatResponse>(`${apiBaseUrl}/chat`, 
              { params: { query } });
          return response.data;
      }
  });
}