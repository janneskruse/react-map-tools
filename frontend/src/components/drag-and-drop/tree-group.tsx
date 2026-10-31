"use client";
import React, { useState, useEffect, useRef, useContext } from "react";

import { GripVertical, Folder, FolderOpen, ChevronDown } from "lucide-react";

import { TreeContext } from "./tree-context";
import { TreeItem } from "./tree-item";
import { LineDropIndicator } from "./line-drop-indicator";
import { GroupHandle } from "./group-handle";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/general-ui/collapsible";

import {
  dropTargetForElements,
  type ElementDropTargetEventBasePayload,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview";
import {
  attachInstruction,
  extractInstruction,
  type Instruction,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/list-item";
import { cn } from "@/utils/shadcn-utils";

import type { TTreeGroup, TTreeItem } from "@/types/drag-and-drop";
import type { DropTargetRecord } from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";

interface ITreeGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  group: TTreeGroup;
  level?: number;
  renderGroup?: (group: TTreeGroup, level: number) => React.ReactNode;
  renderItem?: (item: TTreeItem) => React.ReactNode;
  selectedItemId?: string;
  grip?: "onHover" | "always";
  handle?: "onHover" | "always";
  collapsible?: "folder" | "chevron";
  copy?: boolean;
  handleDuplicate?: (groupId: string) => Promise<void>;
  handleDelete?: (groupId: string) => Promise<void>;
  itemGrip?: "onHover" | "always";
  itemHandle?: "onHover" | "always";
  copyItem?: boolean;
  handleDuplicateItem?: (groupId: string) => Promise<void>;
  handleDeleteItem?: (groupId: string) => Promise<void>;
  classNameItem?: string;
  classNameSelectedItem?: string;
  classNameGroup?: string;
  groupInset?: number | "outerInset";
  classNameGroupHeader?: string;
  classNameRootLevel?: string;
  classNameSubLevel?: string;
  classNameRootLevelHeader?: string;
  classNameSubLevelHeader?: string;
}

export function TreeGroup({
  group,
  level = 0,
  renderGroup,
  renderItem,
  selectedItemId,
  grip,
  handle,
  copy = false,
  collapsible,
  handleDuplicate,
  handleDelete,
  itemGrip,
  itemHandle,
  copyItem = false,
  handleDuplicateItem,
  handleDeleteItem,
  classNameItem,
  classNameSelectedItem,
  classNameGroup = "",
  groupInset = 6,
  classNameGroupHeader = "",
  classNameRootLevel = "",
  classNameSubLevel = "",
  classNameRootLevelHeader = "",
  classNameSubLevelHeader = "",
  ...props
}: ITreeGroupProps) {
  // refs, context and states for drag and drop
  const dropRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const groupContentRef = useRef<HTMLDivElement>(null);
  const { uniqueContextId, maxSubGroups, handleGroupClick } = useContext(TreeContext);

  // states for visual feedback
  const [instruction, setInstruction] = useState<Instruction | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [groupState, setGroupState] = useState<"is-innermost-over" | "idle">(
    "idle"
  );

  // collapsible state
  const [groupOpen, setGroupOpen] = useState(group.isOpen);

  // set open state when group changes
  useEffect(()=>{
    setGroupOpen(group.isOpen);
  }, [group.isOpen]);

  /////// Drop target for group (header + combine operations) ////////
  useEffect(() => {
    const element = dropRef.current;
    if (!element) return;

    // on drag open group if holding over it for 1 second
    const timeoutRef = { current: null as NodeJS.Timeout | null };
    function onChange({ self }: ElementDropTargetEventBasePayload) {
      const instruction = extractInstruction(self.data);
      setInstruction(instruction);

      if (!groupOpen) {
        if (!timeoutRef.current) {
          timeoutRef.current = setTimeout(() => {
            setGroupOpen(true);
          }, 500);
        }
      }
    }

    function clearDragState() {
      setInstruction(null);

      // clear the timeout on drag leaves or drops
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    return dropTargetForElements({
      element,
      getData: ({ input, element }) => {
        const data = { id: group.id, type: "group", level };
        return attachInstruction(data, {
          input,
          element,
          operations: {
            combine: level < maxSubGroups - 1 ? "available" : "blocked",
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
        return (
          // only droppable if the same tree context
          source.data.uniqueContextId === uniqueContextId &&
          // and if it is not the same group
          source.data.id !== group.id &&
          // prevent dropping into own group if nested element
          !isNested &&
          // and if not exceeding max subgroups
          !(source.data.type === "group" && level >= maxSubGroups)
        );
      },
      onDragEnter: onChange,
      onDrag: onChange,
      onDragLeave: () => clearDragState(),
      onDrop: () => clearDragState(), // just clear instruction, don't handle drop here
    });
  }, [group.id, uniqueContextId, level, maxSubGroups, group, groupOpen]);

  //////// drop target for group content (loose dropping) ////////
  useEffect(() => {
    const element = groupContentRef.current;
    if (!element || !group.items.length) return;

    function onChange({ location, self }: ElementDropTargetEventBasePayload) {
      const [innerMost] = location.current.dropTargets.filter(
        (dropTarget: DropTargetRecord) =>
          dropTarget.data.type === "group-content"
      );
      setGroupState(
        innerMost?.element === self.element ? "is-innermost-over" : "idle"
      );
    }

    return dropTargetForElements({
      element,
      canDrop: ({ source, element }) => {
        // a simple contains method without the closest doesnt work here, as the pdnd is structuring the DOM differently
        // closest('[data-drop-target-for-element="true"]' finds the closest drop target
        // see https://github.com/atlassian/pragmatic-drag-and-drop/issues/113
        const isNested = source.element
          .closest('[data-drop-target-for-element="true"]')
          ?.contains(element)
          ? true
          : false;
        return (
          // only droppable if the same tree context
          source.data.uniqueContextId === uniqueContextId &&
          // and if it is not the same group
          source.data.id !== group.id &&
          // prevent dropping into own group if nested element
          !isNested &&
          // and if not exceeding max subgroups
          !(source.data.type == "group" && level >= maxSubGroups)
        );
      },
      getData: () => ({ type: "group-content", groupId: group.id }),
      getIsSticky: () => true,
      onDragStart: onChange,
      onDropTargetChange: onChange,
      onDragLeave: () => setGroupState("idle"),
      onDrop: () => setGroupState("idle"), // Just clear, don't handle here
    });
  }, [group.id, group.items.length, level, maxSubGroups, uniqueContextId]);

  /////// Draggable for the group (header) ////////
  useEffect(() => {
    const element = dragRef.current;
    if (!element || group.draggable === false) return;

    return draggable({
      element,
      getInitialData: () => ({
        id: group.id,
        type: "group",
        uniqueContextId,
        level,
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
              font-weight: 500;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
              display: flex;
              align-items: center;
              gap: 8px;
            `;

            const folderIcon = document.createElement("div");
            folderIcon.innerHTML = `
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>
              </svg>
            `;

            const text = document.createElement("span");
            text.textContent = group.name;

            preview.appendChild(folderIcon);
            preview.appendChild(text);
            container.appendChild(preview);
            return () => container.removeChild(preview);
          },
          nativeSetDragImage,
        });
      },
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    });
  }, [group.id, group.name, group.draggable, uniqueContextId, level]);

  const paddingLeft = groupInset == "outerInset" ? "auto" : `calc(${groupInset + 2 * (level + 1)} * var(--spacing)`

  return (
    <div
      className={cn(
        "mb-4 w-full relative",
        groupState === "is-innermost-over" ? "bg-accent/50" : "",
        "rounded-sm transition-colors duration-200",
        classNameGroup,
        level === 0 ? classNameRootLevel : classNameSubLevel
      )}
    >
      <div
        ref={dropRef}
        className={cn(
          "w-full relative transition-all duration-200",
          isDragging ? "opacity-50" : ""
        )}
      >
        <div
          ref={dragRef}
          className={cn(
            // note that 'group' is a tailwind class, used to style the children, so please don't remove it
            "group w-full flex items-center gap-2 justify-between",
            group.draggable !== false ? "cursor-grab" : "",
            instruction?.operation === "combine" ? "bg-accent" : "",
            classNameGroupHeader,
            level === 0 ? classNameRootLevelHeader : classNameSubLevelHeader
          )}
          onClick={(e) => {
            if (collapsible === "folder") {
              setGroupOpen((prev) => !prev);
            }

            handleGroupClick?.(group.id);
            e.stopPropagation();
          }}
          onContextMenu={(e) => {
            handleGroupClick?.(group.id);
          }}
          {...props}
        >
          <div className="flex items-center gap-2">
            {grip && group.draggable !== false && (
              <GripVertical
                className={cn(
                  "w-4 h-4 cursor-grab active:cursor-grabbing transition-opacity",
                  grip === "always"
                    ? "block"
                    : grip === "onHover"
                      ? "hidden group-hover:block"
                      : "hidden"
                )}
              />
            )}
            {collapsible === "folder" &&
              (groupOpen ? (
                <FolderOpen className="w-4 h-4" />
              ) : (
                <Folder className="w-4 h-4" />
              ))}
          </div>
          <div className="flex-1">
            {renderGroup ? (
              renderGroup(group, level)
            ) : (
              <div className="flex items-center gap-2 p-2">
                <p>{group.name}</p>
              </div>
            )}
          </div>

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
            {/* Collapsible chevron */}
            {collapsible === "chevron" && (
              <div
                className={cn(
                  "cursor-pointer transition-transform",
                  groupOpen ? "rotate-180" : ""
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setGroupOpen((prev) => !prev);
                }}
              >
                <ChevronDown className="w-4 h-4" />
              </div>
            )}
            {/* Group handle for copy, duplicate, delete */}
            {(copy || handleDuplicate || handleDelete) && (
              <GroupHandle
                group={group}
                uniqueContextId={uniqueContextId}
                copy={copy}
                handleDuplicate={handleDuplicate}
                handleDelete={handleDelete}
                className={cn(handle ? "block" : "hidden")}
              />
            )}
          </div>
        </div>

        <Collapsible open={!collapsible || groupOpen}>
          <CollapsibleContent>
            {group.items.length > 0 && (
              <div ref={groupContentRef}>
                <div className={cn("w-full",
                  groupInset === "outerInset" && "pl-4")}>
                  {group.items.map((item) => {
                    if (item.type === "group") {
                      return (
                        <TreeGroup
                          key={item.id}
                          group={item}
                          level={level + 1}
                          renderGroup={renderGroup}
                          renderItem={renderItem}
                          selectedItemId={selectedItemId}
                          grip={grip}
                          handle={handle}
                          copy={copy}
                          collapsible={collapsible}
                          handleDuplicate={handleDuplicate}
                          handleDelete={handleDelete}
                          itemGrip={itemGrip}
                          itemHandle={itemHandle}
                          copyItem={copyItem}
                          handleDuplicateItem={handleDuplicateItem}
                          handleDeleteItem={handleDeleteItem}
                          classNameItem={classNameItem}
                          classNameSelectedItem={classNameSelectedItem}
                          classNameGroup={classNameGroup}
                          groupInset={groupInset}
                          classNameGroupHeader={classNameGroupHeader}
                          classNameRootLevel={classNameRootLevel}
                          classNameSubLevel={classNameSubLevel}
                          classNameRootLevelHeader={classNameRootLevelHeader}
                          classNameSubLevelHeader={classNameSubLevelHeader}
                          style={{
                            paddingLeft: paddingLeft,
                          }}
                        />
                      );
                    } else {
                      return (
                        <TreeItem
                          key={item.id}
                          item={item}
                          groupId={group.id}
                          renderItem={renderItem}
                          selectedItemId={selectedItemId}
                          level={level}
                          grip={itemGrip}
                          handle={itemHandle}
                          copy={copyItem}
                          handleDuplicate={handleDuplicateItem}
                          handleDelete={handleDeleteItem}
                          className={classNameItem}
                          classNameSelected={classNameSelectedItem}
                          style={{
                            paddingLeft: paddingLeft,
                          }}
                        />
                      );
                    }
                  })}
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>

        {instruction && <LineDropIndicator instruction={instruction} />}
      </div>
    </div>
  );
}
