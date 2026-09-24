
"use client";
import React from "react";

interface MapControlContainerProps {
  className?: string;
  children: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}

function MapControlContainer({ className, children, ref }: MapControlContainerProps) {
  return (
    <div
      ref={ref}
      className={`map-controlcontainer relative flex flex-col w-7 h-full items-start gap-2 rounded-sm overflow-hidden ${className || ""}`}
    >
      {children}
    </div>
  );
}

export default MapControlContainer;

interface MapControlBoxProps {
  className?: string;
  children: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}

export function MapControlBox({ className, children, ref }: MapControlBoxProps) {
  return (
    <div
      ref={ref}
      className={`map-controlbox relative bg-background flex w-full flex-col items-start overflow-hidden rounded-sm shadow-sm ${className || ""}`}
    >
      {children}
    </div>
  );
}


