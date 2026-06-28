"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton({ fallback = "/hervoice" }: { fallback?: string }) {
  const router = useRouter();

  const onClick = () => {
    // Go back to the previous page (preserving its scroll position) when we
    // arrived here via in-app navigation; otherwise fall back to the listing.
    if (window.history.length > 1) router.back();
    else router.push(fallback);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="group text-muted-foreground hover:text-foreground mb-10 inline-flex items-center gap-2 text-sm font-medium transition-colors duration-300"
    >
      <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
      Back to HerVoice
    </button>
  );
}
