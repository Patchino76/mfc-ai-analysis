"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "./DataTable";
import { ImageDisplay } from "./ImageDisplay";
import { useChat, ChatResponse } from "../hooks/useChat";
import { useState } from "react";

type MessageSender = "user" | "system";

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
    data: Record<string, any>[];
}

interface ImageMessage extends BaseMessage {
    type: "image";
    base64Data: string;
}

type ChatMessage = TextMessage | TableMessage | ImageMessage;

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
      { type: "text", text: "Справка за престоите на поток 1 и поток 2 по категории.", sender: "system" },
  ]);
  const chatMutation = useChat();
  
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
      <div className="min-h-screen p-4 bg-background">
        <div className="max-w-7xl mx-auto space-y-4">
          <ScrollArea className="h-[800px] w-full overflow-x-auto rounded-md border p-4">
            <div className="min-w-full">
              {chatHistory.map((msg, index) => (
                <div key={index} className={`mb-4 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                  {msg.type === "text" ? (
                    <div className={`inline-block p-2 rounded-lg ${
                      msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}>
                      {msg.text}
                    </div>
                  ) : msg.type === "table" ? (
                    <div className="w-full p-4 bg-muted rounded-lg">
                      <DataTable tableData={msg.data} />
                    </div>
                  ) : (
                    <div className="w-full p-4 bg-muted rounded-lg">
                      <img 
                        src={`data:image/png;base64,${msg.base64Data}`}
                        alt="Generated visualization"
                        className="max-w-full h-auto"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
  );
};

export default ChatPage