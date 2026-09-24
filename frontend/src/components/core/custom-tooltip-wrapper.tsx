
import React, { forwardRef } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/core/tooltip";

interface TooltipWrapperProps {
  /** Optional CSS class name */
  className?: string;
  /** Optional CSS class name for the arrow */
  classNameArrow?: string;
  /** Alignment of the tooltip. Defaults to "center" */
  align?: "center" | "start" | "end";
  /** Position of the tooltip relative to the trigger element. Defaults to "right" */
  side?: "right" | "top" | "bottom" | "left";
  /** Optional offset for the tooltip position */
  sideOffset?: number;
  /** Content to be displayed in the tooltip */
  content: React.ReactNode | string;
  /** Trigger element that the tooltip will be attached to */
  children: React.ReactNode;
  /** Render no wrapper element around the trigger, for direct-child CSS composition. */
  wrapperless?: boolean;
}

/**
 * A wrapper component that adds tooltip functionality to its children
 * @type {React.ForwardRefExoticComponent<TooltipWrapperProps & React.RefAttributes<HTMLDivElement>>}
 * @see {@link TooltipWrapperProps}
 * @param {object} props - The component props
 * @param {string} [props.className] - Optional CSS class name
 * @param {string} [props.classNameArrow] - Optional CSS class name for the arrow
 * @param {("center"|"start"|"end")} [props.align="center"] - Alignment of the tooltip
 * @param {("right"|"top"|"bottom"|"left")} [props.side="right"] - Position of the tooltip
 * @param {number} [props.sideOffset] - Optional offset for the tooltip position
 * @param {React.ReactNode|string} props.content - Content to be displayed in the tooltip
 * @param {React.ReactNode} props.children - Trigger element that the tooltip will be attached to
 * @param {React.Ref<HTMLDivElement>} ref - Forward ref for the wrapper div
 */

const TooltipWrapper = forwardRef<HTMLDivElement, TooltipWrapperProps>(
  (
    {
      className,
      classNameArrow,
      align = "center",
      side = "right",
      sideOffset,
      content,
      children,
      wrapperless = false,
    },
    ref
  ) => {
    if (!content) {
      return <>{children}</>;
    }

    const tooltip = <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          sideOffset={sideOffset}
          align={align}
          className={`text-white rounded-sm w-full text-wrap ${className || ""}`}
          classNameArrow={`${classNameArrow || ""}`}
        >
          {typeof content === "string" ? <p>{content}</p> : content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>;

    if (wrapperless) return tooltip;

    return <div ref={ref} className="contents">{tooltip}</div>;
  }
);

TooltipWrapper.displayName = "TooltipWrapper";

export default TooltipWrapper;