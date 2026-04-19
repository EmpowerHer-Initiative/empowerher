"use client";

import { useState } from "react";
import { Sparkles, Copy, Check } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ImagePlaceholderProps {
  aspectRatio?: string;
  prompt: string;
  className?: string;
}

export function ImagePlaceholder({
  aspectRatio = "4/3",
  prompt,
  className = "",
}: ImagePlaceholderProps) {
  const [copied, setCopied] = useState(false);

  const fullPrompt = `${prompt} Aspect ratio: ${aspectRatio}.`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={className}>
      <div className="relative">
        <div
          className="w-full rounded-2xl bg-gradient-to-br from-primary/[0.06] via-muted to-primary/[0.03] border border-border overflow-hidden"
          style={{ aspectRatio }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border border-border/60 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border border-border/40" />
            </div>
          </div>
        </div>

        <Dialog>
          <DialogTrigger className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-foreground/90 text-background px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 hover:bg-foreground active:scale-[0.96] cursor-pointer">
            <Sparkles className="w-3 h-3" />
            AI Prompt
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Image Generation Prompt</DialogTitle>
              <DialogDescription>
                Copy this prompt and paste it into your AI image generator to
                create a fitting image for this section.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/50 px-2 py-1 font-mono">
                Aspect Ratio: {aspectRatio}
              </span>
            </div>
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <p className="text-sm leading-relaxed text-foreground">{fullPrompt}</p>
            </div>
            <DialogFooter>
              <button
                onClick={handleCopy}
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:opacity-90 active:scale-[0.98] cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Prompt
                  </>
                )}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
