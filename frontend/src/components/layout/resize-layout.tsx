"use client";

import type { ReactNode } from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/core/resizable";
import { useLayoutTargetRef } from "@/hooks/project/use-project-layout";
import { useResizeLayout } from "@/hooks/project/use-resize-layout";

interface IResizeLayoutProps {
  children: ReactNode;
}

export function ResizeLayout({ children }: IResizeLayoutProps) {
  const layout = useResizeLayout();
  const rightRef = useLayoutTargetRef("right");
  const secondaryRightRef = useLayoutTargetRef("secondaryRight");
  const bottomRef = useLayoutTargetRef("bottom");

  return (
    <div className="min-h-0 flex-1 overflow-hidden">
      <ResizablePanelGroup
        orientation="vertical"
        groupRef={layout.verticalRef}
        onLayoutChanged={layout.onVerticalLayoutChanged}
      >
        <ResizablePanel id="main" minSize="35%" defaultSize="100%">
          <ResizablePanelGroup
            orientation="horizontal"
            groupRef={layout.horizontalRef}
            onLayoutChanged={layout.onHorizontalLayoutChanged}
          >
            <ResizablePanel id="map" minSize="30%" defaultSize="100%">
              {children}
            </ResizablePanel>
            {layout.panels.right && (
              <ResizableHandle withHandle aria-label="Resize right panel" />
            )}
            <ResizablePanel
              id="right"
              collapsible
              minSize="15%"
              maxSize="70%"
              defaultSize="0%"
            >
              <div
                ref={rightRef}
                data-layout-target="right"
                className="h-full overflow-auto border-l bg-background"
                inert={!layout.panels.right}
              />
            </ResizablePanel>
            {layout.panels.secondaryRight && (
              <ResizableHandle
                withHandle
                aria-label="Resize second right panel"
              />
            )}
            <ResizablePanel
              id="secondaryRight"
              collapsible
              minSize="15%"
              maxSize="35%"
              defaultSize="0%"
            >
              <div
                ref={secondaryRightRef}
                data-layout-target="secondaryRight"
                className="h-full overflow-auto border-l bg-background"
                inert={!layout.panels.secondaryRight}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        {layout.panels.bottom && (
          <ResizableHandle withHandle aria-label="Resize bottom panel" />
        )}
        <ResizablePanel
          id="bottom"
          collapsible
          minSize="15%"
          maxSize="65%"
          defaultSize="0%"
        >
          <div
            ref={bottomRef}
            data-layout-target="bottom"
            className="h-full overflow-auto border-t bg-background"
            inert={!layout.panels.bottom}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
