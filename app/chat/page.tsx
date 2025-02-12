"use client";
import { Textarea } from "@/components/ui/textarea"; // Add Textarea import
import { Button } from "@/components/ui/button";
import { ScrollArea} from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Copy } from "lucide-react";
import { DataTable } from "./DataTable";
import { useChat, ChatResponse, useRawTable } from "../hooks/useChat";
import { useState, useEffect } from "react";
import Image from 'next/image';

import { useSearchParams } from 'next/navigation';


type MessageSender = "user" | "system";
export type DataRow = Record<string, string | number>;

interface BaseMessage {
    sender: MessageSender;
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

const ChatPage = () => {
  const searchParams = useSearchParams();
  const question = searchParams.get("question");

  const {data : rawTableData} = useRawTable();
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
      { type: "text", text: "Историята на чата...", sender: "system" },
  ]);
  const chatMutation = useChat();
  
  useEffect(() => {
    if (question) {
      try {
        const decodedQuestion = decodeURIComponent(question);
        setMessage(decodedQuestion);
      } catch (error) {
        console.error('Error decoding question parameter:', error);
      }
    }
  }, [question]);

  const handleSubmit = (e?: React.FormEvent) => {
      e?.preventDefault();
      
      if (!message.trim()) return;
      
      // Add user message to chat history
      const userMessage: TextMessage = {
          type: "text",
          text: message,
          sender: "user"
      };
      setChatHistory(prev => [...prev, userMessage]);
      
      chatMutation.mutate(message, {
          onSuccess: (data: ChatResponse) => {
              console.log("Response data:", data);
              
              if (data?.dataframe) {
                  const tableMessage: TableMessage = {
                      type: "table",
                      data: data.dataframe,
                      sender: "system"
                  };
                  const statusMessage: TextMessage = {
                      type: "text",
                      text: "Data table has been updated",
                      sender: "system"
                  };
                  setChatHistory(prev => [...prev, tableMessage, statusMessage]);
              } else if (data?.image) {
                  const imageMessage: ImageMessage = {
                      type: "image",
                      base64Data: data.image,
                      sender: "system"
                  };
                  setChatHistory(prev => [...prev, imageMessage]);
              } else if (data?.text) {
                  const textMessage: TextMessage = {
                      type: "text",
                      text: data.text,
                      sender: "system"
                  };
                  setChatHistory(prev => [...prev, textMessage]);
              }
              
              setMessage("");
          },
          onError: (error) => {
              console.error("Chat error:", error);
              const errorMessage: TextMessage = {
                  type: "text",
                  text: "Error processing your request",
                  sender: "system"
              };
              setChatHistory(prev => [...prev, errorMessage]);
          }
      });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">

          <div className="flex items-center justify-between px-4 py-2 border-b">

            <h1 className="text-xl font-semibold">AI Анализи</h1>
            <div className="relative h-15 w-48">
              <Image
                src="/images/em_logo.jpg"
                alt="Logo"
                fill
                className="object-contain"
              />
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
                      ) : msg.type === "table" ? (
                        <div className="w-full p-4 bg-muted rounded-lg">
                          <DataTable tableData={msg.data} />
                        </div>
                      ) : (
                        <div className="w-full p-4 bg-muted rounded-lg">
                          <div className="relative w-full h-[800px]">
                            <Image
                              src={`data:image/png;base64,${msg.base64Data}`}
                              alt="Generated visualization"
                              className="object-contain"
                              fill
                              sizes="(max-width: 768px) 100vw, 80vw"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-4 border-t">
                <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                  <Button type="submit">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
    
      </div>
    </div>
  );
};

export default ChatPage