"use client";
import { Textarea } from "@/components/ui/textarea"; // Add Textarea import
import { Button } from "@/components/ui/button";
import { ScrollArea} from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Send, Copy } from "lucide-react";
import { DataTable } from "./DataTable";
import { useChatStore } from "../store/chatStore";
import { useChat, ChatResponse } from "../hooks/useChat";
import { useEffect } from "react";
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

  const { 
    currentMessage, 
    setCurrentMessage, 
    chatHistory, 
    addMessage,
    useMatplotlib,
    togglePlottingPreference,
    clearChat
  } = useChatStore();
  const chatMutation = useChat();
  
  useEffect(() => {
    if (question) {
      try {
        const decodedQuestion = decodeURIComponent(question);
        setCurrentMessage(decodedQuestion);
      } catch (error) {
        console.error('Error decoding question parameter:', error);
      }
    }
  }, [question, setCurrentMessage]);

  const handleSubmit = (e?: React.FormEvent) => {
      e?.preventDefault();
      
      if (!currentMessage.trim()) return;
      
      // Add user message to chat history
      const userMessage: TextMessage = {
          type: "text",
          text: currentMessage + (useMatplotlib ? 
              " Use matplotlib if you need to plot." : 
              " Use seaborn library if you need to plot."),
          sender: "user"
      };
      addMessage(userMessage);
      
      chatMutation.mutate(currentMessage, {
          onSuccess: (data: ChatResponse) => {
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
                  addMessage(tableMessage);
                  addMessage(statusMessage);
              } else if (data?.image) {
                  const imageMessage: ImageMessage = {
                      type: "image",
                      base64Data: data.image,
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
      });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">

          <div className="flex items-center justify-between px-4 py-2 border-b">
            <h1 className="text-md font-normal">История</h1>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => clearChat()}
            >
              Reset
            </Button>
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
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={useMatplotlib}
                        onCheckedChange={togglePlottingPreference}
                      />
                      <span className="text-sm">
                        {useMatplotlib ? 'plt' : 'sns'}
                      </span>
                    </div>
                  </div>
                </form>
              </div>
            </div>
    
      </div>
    </div>
  );
};

export default ChatPage