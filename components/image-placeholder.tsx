"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Copy, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

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
  aspectRatio: string;
  prompt: string;
  src?: string;
  alt?: string;
  className?: string;
}

export function ImagePlaceholder({
  aspectRatio,
  prompt,
  src,
  alt = "",
  className = "",
}: ImagePlaceholderProps) {
  const [copied, setCopied] = useState(false);

  const fullPrompt = `${prompt} Aspect ratio: ${aspectRatio}.`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (src) {
    return (
      <div
        className={cn("relative w-full overflow-hidden rounded-2xl", className)}
        style={{ aspectRatio }}
      >
        <Image src={src} alt={alt} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="relative">
        <div
          className="from-primary/[0.06] via-muted to-primary/[0.03] border-border w-full overflow-hidden rounded-2xl border bg-gradient-to-br"
          style={{ aspectRatio }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="border-border/60 flex h-16 w-16 items-center justify-center rounded-full border">
              <div className="border-border/40 h-8 w-8 rounded-full border" />
            </div>
          </div>
        </div>

        <Dialog>
          <DialogTrigger className="bg-foreground/90 text-background hover:bg-foreground absolute top-3 right-3 z-10 flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all duration-200 active:scale-[0.96]">
            <Sparkles className="h-3 w-3" />
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
            <div className="text-muted-foreground flex items-center gap-2 text-xs">
              <span className="border-border bg-muted/50 inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono">
                Aspect Ratio: {aspectRatio}
              </span>
            </div>
            <div className="border-border bg-muted/50 rounded-lg border p-4">
              <p className="text-foreground text-sm leading-relaxed">
                {fullPrompt}
              </p>
            </div>
            <DialogFooter>
              <button
                onClick={handleCopy}
                className="bg-primary text-primary-foreground inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
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
