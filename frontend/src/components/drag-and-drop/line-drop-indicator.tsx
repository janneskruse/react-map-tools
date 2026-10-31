import React, { type ReactNode } from "react";
import type { Instruction } from "@atlaskit/pragmatic-drag-and-drop-hitbox/list-item";

export {
  type Instruction,
  type Operation,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/list-item";

type LineType = "terminal" | "no-terminal" | "terminal-no-bleed";

function TerminalCircle({
  terminalColor,
  terminalSize,
  strokeWidth,
  isVertical,
  isAfter,
  terminalPositionClass,
}: {
  terminalColor: string;
  terminalSize: number;
  strokeWidth: number;
  isVertical: boolean;
  isAfter: boolean;
  terminalPositionClass: string;
}) {
  const transform = isVertical
    ? `translateY(${isAfter ? (terminalSize - strokeWidth) / 2 : -(terminalSize - strokeWidth) / 2}px)`
    : `translateX(${isAfter ? (terminalSize - strokeWidth) / 2 : -(terminalSize - strokeWidth) / 2}px)`;

  const positioning = isVertical
    ? { left: -terminalSize / 2 }
    : { top: -terminalSize / 2 };

  return (
    <div
      className={`absolute ${terminalPositionClass} border-2 rounded-full ${terminalColor} bg-main`}
      style={{
        width: terminalSize,
        height: terminalSize,
        ...positioning,
        transform,
      }}
    />
  );
}

export function LineDropIndicator({
  instruction,
  showBorder = false,
  gap = 0,
  strokeWidth = 2,
  type = "terminal",
}: {
  instruction: Instruction;
  showBorder?: boolean;
  gap?: number;
  strokeWidth?: number;
  type?: LineType;
}): ReactNode {
  const isWarning = instruction.blocked;
  const isVertical = instruction.axis === "vertical";
  const isAfter = instruction.operation === "reorder-after";

  if (instruction.operation === "combine" && showBorder) {
    return (
      <div
        className={`absolute inset-0 pointer-events-none border-2 rounded-sm ${
          isWarning ? "border-yellow" : "border-secondary"
        }`}
      />
    );
  }

  if (
    instruction.operation === "reorder-before" ||
    instruction.operation === "reorder-after"
  ) {
    const strokeColor = isWarning ? "bg-yellow" : "bg-secondary";
    const terminalColor = isWarning ? "border-yellow" : "border-secondary";
    const showTerminal = type !== "no-terminal";
    const terminalSize = strokeWidth * 4;
    const offset = gap / 2 + strokeWidth / 2;

    const baseClasses = "absolute pointer-events-none z-10";

    if (isVertical) {
      const positionClass = isAfter ? "bottom-0" : "top-0";
      const terminalPositionClass = isAfter ? "bottom-0" : "top-0";

      return (
        <div
          className={`${baseClasses} ${positionClass} left-0 right-0 ${strokeColor}`}
          style={{
            height: strokeWidth,
            transform: `translateY(${isAfter ? offset : -offset}px)`,
          }}
        >
          {showTerminal && (
            <TerminalCircle
              terminalColor={terminalColor}
              terminalSize={terminalSize}
              strokeWidth={strokeWidth}
              isVertical={true}
              isAfter={isAfter}
              terminalPositionClass={terminalPositionClass}
            />
          )}
        </div>
      );
    } else {
      const positionClass = isAfter ? "right-0" : "left-0";
      const terminalPositionClass = isAfter ? "right-0" : "left-0";

      return (
        <div
          className={`${baseClasses} ${positionClass} top-0 bottom-0 ${strokeColor}`}
          style={{
            width: strokeWidth,
            transform: `translateX(${isAfter ? offset : -offset}px)`,
          }}
        >
          {showTerminal && (
            <TerminalCircle
              terminalColor={terminalColor}
              terminalSize={terminalSize}
              strokeWidth={strokeWidth}
              isVertical={false}
              isAfter={isAfter}
              terminalPositionClass={terminalPositionClass}
            />
          )}
        </div>
      );
    }
  }

  return null;
}
