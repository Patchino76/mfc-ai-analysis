"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface ImageDisplayProps {
  imageUrl?: string;
  title?: string;
}

export function ImageDisplay({ imageUrl, title = "Image Display" }: ImageDisplayProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="h-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>{title}</CardTitle>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="flex items-center justify-center h-[300px]">
            {imageUrl ? (
              <div className="relative w-full h-full">
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            ) : (
              <div className="text-muted-foreground">Image Placeholder</div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}