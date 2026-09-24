import * as React from "react";

const BREAKPOINTS = {
  sm: 420,
  md: 768,
  mdd: 870,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

type TBreakpoint = keyof typeof BREAKPOINTS;

function getBreakpoint(width: number): TBreakpoint {
  if (width >= BREAKPOINTS["2xl"]) return "2xl";
  if (width >= BREAKPOINTS.xl) return "xl";
  if (width >= BREAKPOINTS.lg) return "lg";
  if (width >= BREAKPOINTS.mdd) return "mdd";
  if (width >= BREAKPOINTS.md) return "md";
  if (width >= BREAKPOINTS.sm) return "sm";
  return "sm";
}

export function useBreakpoint() {
  const width = React.useSyncExternalStore(
    subscribe,
    () => window.innerWidth,
    () => 0,
  );

  const w = width ?? 0;
  const breakpoint = getBreakpoint(w);

  return {
    breakpoint,
    width: w,
    isSm: w >= BREAKPOINTS.sm,
    isMd: w >= BREAKPOINTS.md,
    isMdd: w >= BREAKPOINTS.mdd,
    isLg: w >= BREAKPOINTS.lg,
    isXl: w >= BREAKPOINTS.xl,
    is2xl: w >= BREAKPOINTS["2xl"],
    isMobile: w < BREAKPOINTS.md,
  };
}
function subscribe(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}
