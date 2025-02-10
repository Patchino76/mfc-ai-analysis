import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { apiBaseUrl } from "../config";
import { DataRow } from "../chat/page";

export interface ChatResponse {
    dataframe?: DataRow[];
    text?: string;
    image?: string;
}


export function useChat() {
    console.log("apiBaseUrl:", apiBaseUrl)
  return useMutation<ChatResponse, Error, string>({
    
      mutationFn: async (query: string) => {
          const response = await axios.get<ChatResponse>(`${apiBaseUrl}/chat`, 
              { params: { query } });
          return response.data;
      }
  });
}

export function useRawTable() {
    return useQuery<DataRow[]>({
        queryKey: ['dispatchers'],
        queryFn: async () => {
            const response = await axios.get<DataRow[]>(`${apiBaseUrl}/dispatchers`);
            return response.data;
        },
        cacheTime: 0,
        staleTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchInterval: 0 
    });
}