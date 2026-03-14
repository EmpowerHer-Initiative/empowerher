"use client";

import { cn } from "../lib/utils";

export const BgPattern = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "absolute inset-0 -z-10 h-full w-full overflow-hidden",
        className
      )}
    >
      <div
        className="h-full w-full"
        style={{
          backgroundColor: "#e5e5f7",
          opacity: 0.05,
          backgroundImage:
            "repeating-linear-gradient(45deg, var(--primary) 25%, transparent 25%, transparent 75%, var(--primary) 75%, var(--primary)), repeating-linear-gradient(45deg, var(--primary) 25%, var(--background) 25%, var(--background) 75%, var(--primary) 75%, var(--primary))",
          backgroundPosition: "0 0, 40px 40px",
          backgroundSize: "80px 80px",
          maskImage: "linear-gradient(to top, transparent 60%, black)",
          transform: "skew(12deg) scale(1.5)",
        }}
      />
    </div>
  );
};
