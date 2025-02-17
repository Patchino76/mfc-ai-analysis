import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import ReactMarkdown from "react-markdown";

interface CollapsibleTextProps {
  text: string;
  title?: string;
}

export function CollapsibleText({ text, title = "Обяснение" }: CollapsibleTextProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="h-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            <CardTitle>{title}</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            <div className="text-sm">
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-4 text-primary" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold mt-6 mb-3 text-secondary" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-xl font-medium mt-4 mb-2 text-accent" {...props} />,
                  p: ({ node, ...props }) => <p className="mb-4 text-foreground" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4" {...props} />,
                  li: ({ node, ...props }) => <li className="mb-2" {...props} />,
                  strong: ({ node, ...props }) => <strong className="font-bold text-primary" {...props} />,
                  em: ({ node, ...props }) => <em className="italic text-secondary" {...props} />,
                }}
              >
                {text}
              </ReactMarkdown>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
