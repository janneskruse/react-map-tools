
"use client";

import type { ReactNode, Ref } from "react";

import { useLayoutTargetRef } from "@/hooks/project/use-project-layout";
import { cn } from "@/utils/shadcn-utils";

interface IMapLayoutProps {
  className?: string;
  children: ReactNode;
}

export function MapLayout({ className, children }: IMapLayoutProps) {
  const ref = useLayoutTargetRef("mapLayout");
  return (
    <div
      ref={ref}
      className={cn(
        "map-layout pointer-events-none absolute inset-0 z-2 flex items-stretch justify-between gap-2 p-2 sm:p-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default MapLayout;

interface IMapLayoutWrapperProps extends IMapLayoutProps {
  ref?: Ref<HTMLDivElement>;
}

export function MapLayoutWrapper({
  className,
  children,
  ref,
}: IMapLayoutWrapperProps) {
  return (
    <div className={cn("relative h-full w-full", className)} ref={ref}>
      {children}
    </div>
  );
}
