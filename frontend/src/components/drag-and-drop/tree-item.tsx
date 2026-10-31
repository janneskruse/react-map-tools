"use client";
import React, { useState, useEffect, useRef, useContext } from "react";

import { GripVertical } from "lucide-react";

import { LineDropIndicator } from "./line-drop-indicator";
import { ItemHandle } from "./item-handle";

import {
  draggable,
  dropTargetForElements,
  type ElementDropTargetEventBasePayload,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview";
import {
  attachInstruction,
  extractInstruction,
  type Instruction,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/list-item";
import { TreeContext } from "./tree-context";

import { cn } from "@/utils/shadcn-utils";

import type { TTreeItem } from "@/types/drag-and-drop";

interface ITreeItemProps extends React.HTMLAttributes<HTMLDivElement> {
  item: TTreeItem;
  groupId: string;
  renderItem?: (item: TTreeItem) => React.ReactNode;
  selectedItemId?: string;
  level?: number;
  grip?: "onHover" | "always";
  handle?: "onHover" | "always";
  copy?: boolean;
  handleDuplicate?: (groupId: string) => Promise<void>;
  handleDelete?: (groupId: string) => Promise<void>;
  className?: string;
  classNameSelected?: string;
}

export function TreeItem({
  item,
  groupId,
  renderItem,
  selectedItemId,
  level,
  grip,
  handle,
  copy = false,
  handleDuplicate,
  handleDelete,
  className = "",
  classNameSelected = "",
  ...props
}: ITreeItemProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [instruction, setInstruction] = useState<Instruction | null>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const { uniqueContextId, registerElement, onDrop, maxSubGroups, handleItemClick } =
  useContext(TreeContext);

  // register element
  useEffect(() => {
    const element = itemRef.current;
    if (!element) return;
    return registerElement(item.id, element);
  }, [item.id, registerElement]);

  // drop target for items
  useEffect(() => {
    const element = itemRef.current;
    if (!element) return;

    function onChange({ self }: ElementDropTargetEventBasePayload) {
      const instruction = extractInstruction(self.data);
      setInstruction(instruction);
    }

    return dropTargetForElements({
      element,
      getData: ({ input, element }) => {
        const data = { id: item.id, type: "item", groupId };
        return attachInstruction(data, {
          input,
          element,
          operations: {
            "reorder-before": "available",
            "reorder-after": "available",
          },
        });
      },
      canDrop: ({ source, element }) => {
        // a simple contains method without the closest doesnt work here, as the pdnd is structuring the DOM differently
        // closest('[data-drop-target-for-element="true"]' finds the closest drop target
        // see https://github.com/atlassian/pragmatic-drag-and-drop/issues/113
        const isNested = source.element
          .closest('[data-drop-target-for-element="true"]')
          ?.contains(element)
          ? true
          : false;

        const exceedsMaxSubGroups =
          level && source.data.type === "group" && level >= maxSubGroups
            ? true
            : false;

        return (
          // only droppable if the same tree context
          source.data.uniqueContextId === uniqueContextId &&
          // and not dropping on itself
          source.data.id !== item.id &&
          // and not nested group of the same group
          !isNested &&
          // and if not exceeding max subgroups
          !exceedsMaxSubGroups
        );
      },
      onDragEnter: onChange,
      onDrag: onChange,
      onDragLeave: () => setInstruction(null),
      onDrop: () => setInstruction(null), // Just clear instruction, don't handle drop here
    });
  }, [item.id, groupId, uniqueContextId, level, maxSubGroups]);

  // draggable for the item
  useEffect(() => {
    const element = itemRef.current;
    if (!element || item.draggable === false) return;

    return draggable({
      element,
      getInitialData: () => ({
        id: item.id,
        type: "item",
        uniqueContextId,
        groupId,
      }),
      onGenerateDragPreview: ({ nativeSetDragImage }) => {
        setCustomNativeDragPreview({
          getOffset: pointerOutsideOfPreview({ x: "16px", y: "8px" }),
          render: ({ container }) => {
            const preview = document.createElement("div");
            preview.style.cssText = `
              background: rgba(var(--main-medium), 1);
              padding: 8px 12px;
              border-radius: 6px;
              color: rgba(var(--contrast), 1);
              font-size: 14px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            `;
            preview.textContent = item.name;
            container.appendChild(preview);
            return () => container.removeChild(preview);
          },
          nativeSetDragImage,
        });
      },
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    });
  }, [item.id, item.name, item.draggable, uniqueContextId, groupId]);

  return (
    <div
      ref={itemRef}
      className={cn(
        "group relative flex w-full items-center justify-between transition-opacity",
        isDragging ? "opacity-40" : "",
        item.draggable === true ? "cursor-grab" : "",
        className, 
        selectedItemId === item.id && cn("bg-accent", classNameSelected),
      )}
      data-testid={`tree-item-${item.id}`}
      onClick={(e) => {
        e.stopPropagation();
        handleItemClick?.(item.id, groupId);
      }}
      onContextMenu={(e) => {
        handleItemClick?.(item.id, groupId);
      }}
      {...props}
    >
      {grip && item.draggable !== false && (
          <GripVertical
            className={cn(
              "w-4 h-4 cursor-grab transition-opacity",
              grip === "always"
                ? "block"
                : grip === "onHover"
                  ? "hidden group-hover:block"
                  : "hidden"
            )}
          />
      )}

      {renderItem ? (
        renderItem(item)
      ) : (
        <div className="flex items-center gap-2 p-2">
          <span>{item.name}</span>
        </div>
      )}

      <div
        className={cn(
          "flex items-center gap-2",
          "transition-opacity",
          handle === "always"
            ? "opacity-100"
            : handle === "onHover"
              ? "opacity-0 group-hover:opacity-100"
              : "opacity-0"
        )}
      >
        {/* Group handle for copy, duplicate, delete */}
        {(copy || handleDuplicate || handleDelete) && (
          <ItemHandle
            item={item}
            uniqueContextId={uniqueContextId}
            copy={copy}
            handleDuplicate={handleDuplicate}
            handleDelete={handleDelete}
            className={cn(handle ? "block" : "hidden")}
          />
        )}
      </div>

      {instruction && <LineDropIndicator instruction={instruction} />}
    </div>
  );
}
