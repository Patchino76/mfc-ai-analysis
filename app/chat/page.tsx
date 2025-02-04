"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "./DataTable";
import { ImageDisplay } from "./ImageDisplay";
import { useChat } from "../hooks/useChat";
import { useState } from "react";

const ChatPage = () => {
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState<{ text: string; sender: "user" | "system" }[]>([
      { text: "Hello! How can I help you today?", sender: "system" },
    ]);
    const chatMutation = useChat();

    const handleSubmit = () => {
        console.log("Submitted message:", message);
        chatMutation.mutate(message, {
            onSuccess: (data) => {
                console.log("Response:", data);
                setMessage("");
            }
        });
    };

  
    return (
      <div className="min-h-screen p-4 bg-background">
        <div className="max-w-7xl mx-auto space-y-4">
          Top section with table and image
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DataTable /> 
            <ImageDisplay 
              title="Preview"
              imageUrl="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba"
            />
          </div>
  
          Chat history
          <Card>
            <CardHeader>
              <CardTitle>Chat History</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] w-full pr-4">
                {chatHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`mb-4 ${
                      msg.sender === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`inline-block px-4 py-2 rounded-lg ${
                        msg.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
  
          Chat input
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-2">
                <Input 
                  placeholder="Type your message..." 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button onClick={handleSubmit}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
}

export default ChatPage