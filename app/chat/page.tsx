"use client";
import { Textarea } from "@/components/ui/textarea"; // Add Textarea import
import { Button } from "@/components/ui/button";
import { ScrollArea} from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Send, Copy } from "lucide-react";
import { DataTable } from "./DataTable";
import { CollapsibleImage } from "./CollapsibleImage";
import { useChatStore } from "../store/chatStore";
import { useChat, ChatResponse } from "../hooks/useChat";
import { useEffect, useState } from "react";
import Image from 'next/image';

import { useSearchParams, useRouter } from 'next/navigation';


type MessageSender = "user" | "system";
export type DataRow = Record<string, string | number>;

export interface BaseMessage {
    sender: MessageSender;
    type: "text" | "dataframe" | "graph";
}

export interface TextMessage extends BaseMessage {
    type: "text";
    text: string;
}

export interface TableMessage extends BaseMessage {
    type: "dataframe";
    data: DataRow[];
}

export interface ImageMessage extends BaseMessage {
    type: "graph";
    base64Data: string;
}

export type ChatMessage = TextMessage | TableMessage | ImageMessage;

const ChatPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const question = searchParams.get("question");
  const [curMessageIndex, setCurMessageIndex] = useState(0);

  const { 
    currentMessage, 
    setCurrentMessage, 
    chatHistory, 
    addMessage,
    useMatplotlib,
    setUseMatplotlib,
    clearChat
  } = useChatStore();
  const chatMutation = useChat(useMatplotlib);
  
  useEffect(() => {
    if (question) {
      setCurrentMessage(question);
    }
  }, [question, setCurrentMessage]);

  const handleSubmit = (e?: React.FormEvent) => {
      e?.preventDefault();
      
      if (!currentMessage.trim()) return;
      
      // Add user message to chat history
      const userMessage: TextMessage = {
          type: "text",
          text: currentMessage,
          sender: "user"
      };
      addMessage(userMessage);
      
      // Function to fetch next message
      const fetchNextMessage = (messageIndex: number) => {
          chatMutation.mutate(
              { query: currentMessage, messageIndex },
              {
                  onSuccess: (response: ChatResponse) => {
                      if (!response.data) return;
                      
                      const data = response.data;
                      console.log("Received chat response:", data);
                      
                      if (data?.dataframe) {
                          const tableMessage: TableMessage = {
                              type: "dataframe",
                              data: data.dataframe,
                              sender: "system"
                          };
                          addMessage(tableMessage);
                      } else if (data?.graph) {
                          console.log("Received graph data:", {
                              hasData: !!data.graph,
                              dataLength: data.graph?.length,
                              firstChars: data.graph?.substring(0, 50)
                          });
                          const imageMessage: ImageMessage = {
                              type: "graph",
                              base64Data: data.graph,
                              sender: "system"
                          };
                          addMessage(imageMessage);
                      } else if (data?.text) {
                          const textMessage: TextMessage = {
                              type: "text",
                              text: data.text,
                              sender: "system"
                          };
                          addMessage(textMessage);
                      }
                      
                      setCurrentMessage("");
                      
                      // If there are more messages, fetch the next one
                      if (response.hasMore) {
                          fetchNextMessage(messageIndex + 1);
                      }
                  },
                  onError: (error) => {
                      console.error("Chat error:", error);
                      const errorMessage: TextMessage = {
                          type: "text",
                          text: "Error processing your request",
                          sender: "system"
                      };
                      addMessage(errorMessage);
                  }
              }
          );
      };
      
      // Start fetching messages from index 0
      fetchNextMessage(0);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">

          <div className="flex items-center justify-between px-4 py-2 border-b">
            <h1 className="text-md font-normal">История</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm">
                  {useMatplotlib ? 'matplotlib' : 'seaborn'}
                </span>
                <Switch
                  checked={useMatplotlib}
                  onCheckedChange={setUseMatplotlib}
                />
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  clearChat();
                  router.push('/chat');
                }}
              >
                Reset
              </Button>
            </div>
          </div>

            <div className="flex flex-col h-full">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {chatHistory.map((msg, index) => (
                    <div key={index} className={`mb-4 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                      {msg.type === "text" ? (
                        <div className="inline-flex items-center gap-2">
                          <div className={`inline-block p-2 rounded-lg ${
                            msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}>
                            {msg.text}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => navigator.clipboard.writeText(msg.text)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : msg.type === "dataframe" ? (
                        <div className="w-full p-4 bg-muted rounded-lg">
                          <DataTable tableData={msg.data} />
                        </div>
                      ) : (
                        <div className="w-full p-4 bg-muted rounded-lg">
                          <CollapsibleImage base64Data={msg.base64Data} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-4 border-t">
                <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                  <Textarea
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder="Въведете вашият въпрос..."
                    className="flex-1"
                    rows={3}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                  <div className="flex flex-col items-center space-y-2">
                    <Button type="submit">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </div>
            </div>
    
      </div>
    </div>
  );
};

export default ChatPage