
import React, { useEffect, useState, useRef, useCallback, memo } from "react";

// Updated interface to support multiple resize directions
interface ResizeBoxProps {
  renderContent: (dimensions: {
    width: number | "auto" | string | undefined;
    height: number | "auto" | string | undefined;
  }) => React.ReactNode;
  className?: string;
  initialWidth?: number | "auto" | string | undefined;
  initialHeight?: number | "auto" | string | undefined;
  // New object-based resize configuration
  resizeDirections?: {
    top?: boolean;
    right?: boolean;
    bottom?: boolean;
    left?: boolean;
    topLeft?: boolean;
    topRight?: boolean;
    bottomLeft?: boolean;
    bottomRight?: boolean;
  };
  collapsed?: boolean;
  collapsibleDirection?: "vertical" | "horizontal"; 
  collapsedHeight?: number | string | 'auto';
  collapsedWidth?: number | string | 'auto';
}

interface Dimensions {
  width: number | "auto" | string | undefined;
  height: number | "auto" | string | undefined;
}

interface NumericDimensions {
  width: number;
  height: number;
}

// A memoized wrapper component for content
const MemoizedContent = memo(({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex flex-col items-center overflow-auto w-full h-full">
      {children}
    </div>
  );
});

MemoizedContent.displayName = "MemoizedContent";

const ResizeBox: React.FC<ResizeBoxProps> = ({
  renderContent,
  className,
  initialWidth = "auto",
  initialHeight = "auto",
  // Default to right-side resizing if not specified
  resizeDirections = { right: true },
  collapsed = false,
  collapsibleDirection = "vertical",
  collapsedHeight,
  collapsedWidth,
}) => {
  const resizeContainerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: initialWidth,
    height: initialHeight,
  });
  const [isResizing, setIsResizing] = useState(false);
  const [activeDirections, setActiveDirections] = useState<string[]>([]);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [startDimensions, setStartDimensions] = useState<NumericDimensions>({
    width: 0,
    height: 0,
  });
  // For when container is positioned absolutely
  const [startCoordinates, setStartCoordinates] = useState({ left: 0, top: 0 });

  // Temporary dimensions for CSS transforms during active resize
  const tempDimensionsRef = useRef<NumericDimensions>({
    width: typeof initialWidth === "number" ? initialWidth : 0,
    height: typeof initialHeight === "number" ? initialHeight : 0,
  });

  const effectiveHeight =
    collapsed && collapsibleDirection === "vertical"
      ? (collapsedHeight ?? 40) // default header height
      : typeof dimensions.height === "number"
        ? `${dimensions.height}px`
        : dimensions.height;

  const effectiveWidth =
    collapsed && collapsibleDirection === "horizontal"
      ? (collapsedWidth ?? 60) // default collapsed width
      : typeof dimensions.width === "number"
        ? `${dimensions.width}px`
        : dimensions.width;

  // Get cursor style based on handle position
  const getCursorStyle = (directions: string | string[]) => {
    // If it's an array, join it to make a compound direction
    let direction = Array.isArray(directions)
      ? directions.join("")
      : directions;

    direction = direction.toLowerCase();

    switch (direction) {
      case "top":
        return "cursor-ns-resize";
      case "right":
        return "cursor-ew-resize";
      case "bottom":
        return "cursor-ns-resize";
      case "left":
        return "cursor-ew-resize";
      case "topleft":
        return "cursor-nwse-resize";
      case "topright":
        return "cursor-nesw-resize";
      case "bottomleft":
        return "cursor-nesw-resize";
      case "bottomright":
        return "cursor-nwse-resize";
      default:
        return "cursor-ew-resize";
    }
  };

  const handleMouseDown = (event: React.MouseEvent, handlePosition: string) => {
    event.preventDefault();
    setIsResizing(true);

    let directions: string[] = [];
    if (handlePosition === "topLeft") {
      directions = ["top", "left"];
    } else if (handlePosition === "topRight") {
      directions = ["top", "right"];
    } else if (handlePosition === "bottomLeft") {
      directions = ["bottom", "left"];
    } else if (handlePosition === "bottomRight") {
      directions = ["bottom", "right"];
    } else {
      // Single direction
      directions = [handlePosition];
    }

    setActiveDirections(directions);
    setStartPosition({ x: event.clientX, y: event.clientY });

    const currentWidth =
      typeof dimensions.width === "number"
        ? dimensions.width
        : resizeContainerRef.current
          ? resizeContainerRef.current.offsetWidth
          : 0;

    const currentHeight =
      typeof dimensions.height === "number"
        ? dimensions.height
        : resizeContainerRef.current
          ? resizeContainerRef.current.offsetHeight
          : 0;

    setStartDimensions({ width: currentWidth, height: currentHeight });
    tempDimensionsRef.current = { width: currentWidth, height: currentHeight };

    // Get current container position
    if (resizeContainerRef.current) {
      const rect = resizeContainerRef.current.getBoundingClientRect();
      setStartCoordinates({
        left: rect.left,
        top: rect.top,
      });
    }
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !resizeContainerRef.current) return;

      const deltaX = e.clientX - startPosition.x;
      const deltaY = e.clientY - startPosition.y;

      let newWidth = startDimensions.width;
      let newHeight = startDimensions.height;
      let newLeft = startCoordinates.left;
      let newTop = startCoordinates.top;
      const directions = activeDirections.join("");

      // Handle width changes
      if (directions.includes("right")) {
        newWidth = startDimensions.width + deltaX;
      }
      if (directions.includes("left")) {
        newWidth = startDimensions.width - deltaX;
        newLeft = startCoordinates.left + deltaX;
      }

      // Handle height changes
      if (directions.includes("bottom")) {
        newHeight = startDimensions.height + deltaY;
      }
      if (directions.includes("top")) {
        newHeight = startDimensions.height - deltaY;
        newTop = startCoordinates.top + deltaY;
      }

      // Apply size using CSS directly during resize
      resizeContainerRef.current.style.width = `${Math.max(newWidth, 50)}px`;
      resizeContainerRef.current.style.height = `${Math.max(newHeight, 50)}px`;

      // If using absolute positioning, update position as well
      if (
        window.getComputedStyle(resizeContainerRef.current).position ===
        "absolute"
      ) {
        if (directions.includes("left")) {
          resizeContainerRef.current.style.left = `${newLeft}px`;
        }
        if (directions.includes("top")) {
          resizeContainerRef.current.style.top = `${newTop}px`;
        }
      }

      // Update the ref for when we finish resizing
      tempDimensionsRef.current = {
        width: Math.max(newWidth, 50),
        height: Math.max(newHeight, 50),
      };
    },
    [
      isResizing,
      startPosition,
      startDimensions,
      startCoordinates,
      activeDirections,
    ]
  );

  const handleMouseUp = useCallback(() => {
    if (isResizing) {
      // Only update React state once at the end of resize
      setDimensions({
        width: tempDimensionsRef.current.width,
        height: tempDimensionsRef.current.height,
      });
    }
    setIsResizing(false);
    setActiveDirections([]);
  }, [isResizing]);

  // Add event listeners for mouse move and mouse up
  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      // Add cursor class to body during resizing
      if (activeDirections.length > 0) {
        document.body.classList.add(getCursorStyle(activeDirections));
      }
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      // Remove all cursor classes
      document.body.classList.remove(
        "cursor-ns-resize",
        "cursor-ew-resize",
        "cursor-nwse-resize",
        "cursor-nesw-resize"
      );
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp, isResizing, activeDirections]);

  // Render resize handles for enabled directions
  const renderResizeHandles = () => {
    const handles = [];

    // Edge handles
    if (resizeDirections.top) {
      handles.push(
        <div
          key="top"
          onMouseDown={(e) => handleMouseDown(e, "top")}
          className={`resize-handle absolute top-0 left-0 w-full h-[3px] z-10 ${getCursorStyle("top")} bg-transparent hover:bg-secondary`}
        />
      );
    }

    if (resizeDirections.right) {
      handles.push(
        <div
          key="right"
          onMouseDown={(e) => handleMouseDown(e, "right")}
          className={`resize-handle absolute right-0 top-0 h-full w-[3px] z-10 ${getCursorStyle("right")} bg-transparent hover:bg-secondary`}
        />
      );
    }

    if (resizeDirections.bottom) {
      handles.push(
        <div
          key="bottom"
          onMouseDown={(e) => handleMouseDown(e, "bottom")}
          className={`resize-handle absolute bottom-0 left-0 w-full h-[3px] z-10 ${getCursorStyle("bottom")} bg-transparent hover:bg-secondary`}
        />
      );
    }

    if (resizeDirections.left) {
      handles.push(
        <div
          key="left"
          onMouseDown={(e) => handleMouseDown(e, "left")}
          className={`resize-handle absolute left-0 top-0 h-full w-[3px] z-10 ${getCursorStyle("left")} bg-transparent hover:bg-secondary`}
        />
      );
    }

    // Corner handles
    if (resizeDirections.topLeft) {
      handles.push(
        <div
          key="topLeft"
          onMouseDown={(e) => handleMouseDown(e, "topLeft")}
          className={`resize-handle absolute top-0 left-0 w-[8px] h-[8px] z-20 ${getCursorStyle("topLeft")} bg-transparent hover:bg-secondary`}
        />
      );
    }

    if (resizeDirections.topRight) {
      handles.push(
        <div
          key="topRight"
          onMouseDown={(e) => handleMouseDown(e, "topRight")}
          className={`resize-handle absolute top-0 right-0 w-[8px] h-[8px] z-20 ${getCursorStyle("topRight")} bg-transparent hover:bg-secondary`}
        />
      );
    }

    if (resizeDirections.bottomLeft) {
      handles.push(
        <div
          key="bottomLeft"
          onMouseDown={(e) => handleMouseDown(e, "bottomLeft")}
          className={`resize-handle absolute bottom-0 left-0 w-[8px] h-[8px] z-20 ${getCursorStyle("bottomLeft")} bg-transparent hover:bg-secondary`}
        />
      );
    }

    if (resizeDirections.bottomRight) {
      handles.push(
        <div
          key="bottomRight"
          onMouseDown={(e) => handleMouseDown(e, "bottomRight")}
          className={`resize-handle absolute bottom-0 right-0 w-[8px] h-[8px] z-20 ${getCursorStyle("bottomRight")} bg-transparent hover:bg-secondary`}
        />
      );
    }

    return handles;
  };

  return (
    <div
      ref={resizeContainerRef}
      className={`resize-box relative flex bg-background overflow-hidden ${className}`}
      style={{
        width: effectiveWidth,
        height: effectiveHeight,
      }}
    >
      {renderResizeHandles()}
      <div className="flex flex-col items-center w-full h-full">
        <MemoizedContent>{renderContent(dimensions)}</MemoizedContent>
      </div>
    </div>
  );
};

// Utility function to memoize child components
export const memoizeComponent = <T extends object>(
  Component: React.ComponentType<T>
): React.MemoExoticComponent<React.ComponentType<T>> => {
  return memo(Component);
};

interface ResizeChildrenProps {
  children: React.ReactNode;
  className?: string;
}

const ResizeChildren = memoizeComponent(
  ({ children, className }: ResizeChildrenProps) => {
    return (
      <div
        className={`flex flex-col items-center overflow-auto h-auto w-auto ${className}`}
      >
        {children}
      </div>
    );
  }
);

export { ResizeBox, ResizeChildren };