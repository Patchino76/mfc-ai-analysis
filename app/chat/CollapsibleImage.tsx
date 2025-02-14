"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { useState } from "react";
import Image from 'next/image';

interface CollapsibleImageProps {
  base64Data: string;
  onExplain: () => void;
}

export function CollapsibleImage({ base64Data, onExplain }: CollapsibleImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleExplain = () => {
    onExplain();
  };

  return (
    <Card className="h-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Графика</CardTitle>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleExplain}
              className="h-8 w-8"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            <div className="relative w-full h-[800px]">
              <Image
                src={`data:image/png;base64,${base64Data}`}
                alt="Generated graph"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
