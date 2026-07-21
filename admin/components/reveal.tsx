"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

// Module-level state. It survives client-side (SPA) navigation but is reset on a
// full document load (first visit / hard refresh). We track which paths have
// already played their reveal so each page animates only the FIRST time it's
// visited this session — and animates again after a refresh.
const seenPaths = new Set<string>();

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type RevealProps = React.ComponentPropsWithoutRef<"div"> & {
  /** Render the styles onto the child element instead of a wrapper div. */
  asChild?: boolean;
  /** Vertical offset (px) the element animates up from. Default 48. */
  distance?: number;
  /** Animation delay in ms. Default 0. */
  delay?: number;
  /** IntersectionObserver threshold. Default 0.15. */
  threshold?: number;
  /** Reveal only once, then stop observing. Default true. */
  once?: boolean;
};

export function Reveal({
  asChild,
  distance = 48,
  delay = 0,
  threshold = 0.15,
  once = true,
  className,
  style,
  ...props
}: RevealProps) {
  const pathname = usePathname();
  // Decided once per mount: animate only if this path hasn't been revealed yet
  // this session. All Reveals on a page read this during render (before the effect
  // below marks the path seen), so they share the same first-visit decision while
  // a return visit skips. Reset on full refresh via module state.
  const [shouldAnimate] = useState(() => !seenPaths.has(pathname));
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  // Mark this path seen so navigating back to it won't replay the animation. Runs
  // after render, so sibling Reveals on the same page still animate on first visit.
  useEffect(() => {
    seenPaths.add(pathname);
  }, [pathname]);

  useIsoLayoutEffect(() => {
    // Already navigated this session → show instantly, no animation.
    if (!shouldAnimate) {
      setVis(true);
      return;
    }
    const ob = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          if (once) ob.disconnect();
        } else if (!once) {
          setVis(false);
        }
      },
      { threshold }
    );
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, [shouldAnimate, threshold, once]);

  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      ref={ref}
      className={cn(
        shouldAnimate &&
          "transition-all duration-[1.2s] ease-[cubic-bezier(0.32,0.72,0,1)]",
        className
      )}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : `translateY(${distance}px)`,
        ...(shouldAnimate ? { transitionDelay: `${delay}ms` } : null),
        ...style,
      }}
      {...props}
    />
  );
}
