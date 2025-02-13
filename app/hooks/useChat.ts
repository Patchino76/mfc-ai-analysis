import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { apiBaseUrl } from "../config";
import { DataRow } from "../chat/page";

export interface ChatResponse {
    dataframe?: DataRow[];
    text?: string;
    graph?: string;
}

export interface QuestionItem {
    question: string
    expectedResponse: string
    goal: string
    type: "dataframe" | "graph"
  }
  
export interface QuestionResponse {
    id: number
    type: "dataframe" | "graph"
    question: string
    response: string
    goal: string
}


export function useChat() {
    // console.log("apiBaseUrl:", apiBaseUrl)
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

export function useCoumnNames() {
    return useQuery<string[]>({
        queryKey: ['column_names'],
        queryFn: async () => {
            const response = await axios.get<string[]>(`${apiBaseUrl}/column_names`);
            return response.data;
        },
    });
}

// export function useQuestion(question: string, selectedParams: string) {
//     return useQuery<ChatResponse>({
//         queryKey: ['question', question, selectedParams] as const,
//         queryFn: async () => {
//             const response = await axios.get<ChatResponse>(`${apiBaseUrl}/df_questions`, 
//                 { params: { question, selectedParams } });
//             return response.data;
//         }
//     });
// }

export function useGenerateQuestion() {
    return useMutation<
    QuestionResponse[],
        Error,
        { question: string; selectedParams: string }
    >({
        mutationFn: async ({ question, selectedParams }) => {
            const response = await axios.get<QuestionResponse[]>(`${apiBaseUrl}/df_questions`, {
                params: { question, selectedParams }
            });
            return response.data;
        }
    });
}