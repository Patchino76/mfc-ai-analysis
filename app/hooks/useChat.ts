import { useMutation } from "@tanstack/react-query";
import axios from "axios";




export function useChat() {
    return useMutation({
      mutationFn: async (query: string) => {
        const response = await axios.get<string>("http://localhost:8000/chat", 
            { params: { query } });
        return response.data;
      }
    });
  }