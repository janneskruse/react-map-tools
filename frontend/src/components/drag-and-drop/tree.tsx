"use client";
import React, {
  useMemo,
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";

import { ClipboardPaste } from "lucide-react";

import { TreeContext } from "./tree-context";
import { TreeGroup } from "./tree-group";
import { TreeItem } from "./tree-item";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/general-ui/context-menu";

import {
  monitorForElements,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { extractInstruction } from "@atlaskit/pragmatic-drag-and-drop-hitbox/list-item";

import {
  pasteAtTop,
  pasteAfter,
  pasteIntoGroup,
} from "@/utils/drag-and-drop/drag-and-drop";
import { cn } from "@/utils/shadcn-utils";

import type {
  TTreeData,
  TTreeGroup,
  TTreeItem,
  TDropResult,
} from "@/types/drag-and-drop";
import type {
  DropTargetRecord,
  DropTargetEventBasePayload,
  ElementDragType,
} from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";

function createElementRegistry() {
  const registry = new Map<string, HTMLElement>();

  const registerElement = (id: string, element: HTMLElement): (() => void) => {
    registry.set(id, element);
    return () => {
      registry.delete(id);
    };
  };

  return { registry, registerElement };
}

interface ITreeProps {
  data: TTreeData;
  maxSubGroups?: number;
  onDrop?: (result: TDropResult) => void;
  onPaste?: (data: { data: TTreeData }) => void;
  renderGroup?: (group: TTreeGroup, level: number) => React.ReactNode;
  renderItem?: (item: TTreeItem) => React.ReactNode;
  selectedItemId?: string;
  groupGrip?: "onHover" | "always";
  groupHandle?: "onHover" | "always";
  groupCollapsible?: "folder" | "chevron";
  copyGroup?: boolean;
  handleDuplicateGroup?: (groupId: string) => Promise<void>;
  handleDeleteGroup?: (groupId: string) => Promise<void>;
  itemGrip?: "onHover" | "always";
  itemHandle?: "onHover" | "always";
  copyItem?: boolean;
  handleDuplicateItem?: (groupId: string) => Promise<void>;
  handleDeleteItem?: (groupId: string) => Promise<void>;
  className?: string;
  classNameItem?: string;
  classNameSelectedItem?: string;
  classNameGroup?: string;
  groupInset?: number | "outerInset";
  classNameGroupHeader?: string;
  classNameRootLevel?: string;
  classNameSubLevel?: string;
  classNameRootLevelHeader?: string;
  classNameSubLevelHeader?: string;
  classNameGroupItem?: string;
}

export function Tree({
  data,
  maxSubGroups = 1,
  onDrop,
  onPaste,
  renderGroup,
  renderItem,
  selectedItemId,
  groupGrip,
  groupHandle,
  groupCollapsible,
  copyGroup = false,
  handleDuplicateGroup,
  handleDeleteGroup,
  itemGrip,
  itemHandle,
  copyItem = false,
  handleDuplicateItem,
  handleDeleteItem,
  className = "",
  classNameItem,
  classNameSelectedItem,
  classNameGroup,
  groupInset,
  classNameGroupHeader,
  classNameRootLevel,
  classNameSubLevel,
  classNameRootLevelHeader,
  classNameSubLevelHeader,
  classNameGroupItem,
}: ITreeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const groupDropRef = useRef<HTMLDivElement>(null);
  const [dropTargetState, setDropTargetState] = useState<
    "is-innermost-over" | "idle"
  >("idle");

  const [{ registry, registerElement }] = useState(createElementRegistry);
  const uniqueContextId = useMemo(() => Symbol("tree-context"), []);

  // track item clicks
  const [clickedElement, setClickedElement] = useState<{
    id: string;
    type: "item" | "group";
  } | null>(null);

  const handleItemClick = useCallback((itemId: string) => {
    setClickedElement({
      id: itemId,
      type: "item",
    });
  }, []);

  const handleGroupClick = useCallback((groupId: string) => {
    setClickedElement({
      id: groupId,
      type: "group",
    });
  }, []);

  // context values for tree
  const contextValue = useMemo(
    () => ({
      uniqueContextId,
      registerElement,
      data,
      maxSubGroups,
      onDrop,
      handleItemClick,
      handleGroupClick,
    }),
    [
      uniqueContextId,
      registerElement,
      data,
      maxSubGroups,
      onDrop,
      handleItemClick,
      handleGroupClick,
    ]
  );

  // centralized drop handling
  useEffect(() => {
    if (!containerRef.current || !groupDropRef.current) return;

    function onDropTargetChange({
      location,
      self,
    }: DropTargetEventBasePayload<ElementDragType>) {
      const [innerMost] = location.current.dropTargets.filter(
        (dropTarget: DropTargetRecord) => dropTarget.data.type === "container"
      );
      setDropTargetState(
        innerMost?.element === self.element ? "is-innermost-over" : "idle"
      );
    }

    return combine(
      monitorForElements({
        canMonitor: ({ source }) =>
          source.data.uniqueContextId === uniqueContextId,
        onDrop(args) {
          const { location, source } = args;
          if (!location.current.dropTargets.length) return;

          // find the innermost target for each type
          const itemTargets = location.current.dropTargets.filter(
            (target) => target.data.type === "item"
          );
          const groupTargets = location.current.dropTargets.filter(
            (target) => target.data.type === "group"
          );
          const groupContentTargets = location.current.dropTargets.filter(
            (target) => target.data.type === "group-content"
          );

          let result: TDropResult | null = null;

          // handle item drops
          if (itemTargets.length > 0) {
            const target = itemTargets[0]; // innermost item target
            const instruction = extractInstruction(target.data);
            if (instruction) {
              result = {
                sourceId: source.data.id as string,
                sourceType: source.data.type as "item" | "group",
                targetId: target.data.id as string,
                targetType: "item" as const,
                operation: instruction.operation,
                sourceGroupId: source.data.groupId as string,
                targetGroupId: target.data.groupId as string,
              };
            }
          }
          // handle group drops
          else if (groupTargets.length > 0) {
            const target = groupTargets[0]; // innermost group target
            const instruction = extractInstruction(target.data);
            if (instruction) {
              result = {
                sourceId: source.data.id as string,
                sourceType: source.data.type as "item" | "group",
                targetId: target.data.id as string,
                targetType: "group" as const,
                operation: instruction.operation,
                sourceGroupId: source.data.groupId as string,
                targetGroupId: target.data.id as string,
              };
            }
          }
          // handle loose drops into group content
          else if (
            groupContentTargets.length > 0 &&
            source.data.type === "item"
          ) {
            const target = groupContentTargets[0]; // innermost group content
            result = {
              sourceId: source.data.id as string,
              sourceType: "item" as const,
              targetId: target.data.groupId as string,
              targetType: "group" as const,
              operation: "combine" as const,
              sourceGroupId: source.data.groupId as string,
              targetGroupId: target.data.groupId as string,
            };
          }

          if (result) {
            onDrop?.(result);
          }
        },
      }),
      dropTargetForElements({
        element: groupDropRef.current,
        canDrop: ({ source }) =>
          // only droppable if the same tree context
          source.data.uniqueContextId === uniqueContextId,
        getData: () => ({ type: "container" }),
        onDragStart: onDropTargetChange,
        onDropTargetChange: onDropTargetChange,
        onDragLeave: () => setDropTargetState("idle"),
        onDrop: () => setDropTargetState("idle"),
      })
    );
  }, [uniqueContextId, onDrop]);

  const handleOnPaste = useCallback(
    async (event: ClipboardEvent) => {
      event.preventDefault();
      if (!onPaste) return;

      // get text from clipboard
      const clipboardData = event.clipboardData;
      let pastedText = clipboardData?.getData("text");

      console.log("Pasted text:", pastedText, event);

      if (!pastedText) {
        pastedText = await navigator.clipboard.readText();
      }
      if (!pastedText) return;

      try {
        const pastedJson = JSON.parse(pastedText);

        if (!pastedJson || !pastedJson.item) {
          console.error("Invalid pasted content. Expected an item or group.");
          return;
        }
        const item: TTreeItem | TTreeGroup = pastedJson.item;
        const beforeId = clickedElement?.id;
        const targetGroupId =
          clickedElement?.type === "group" ? clickedElement.id : undefined;
        if (!pastedJson.item) return;

        console.log(
          "Pasting item/group:",
          pastedJson.item,
          "beforeId:",
          beforeId,
          "targetGroupId:",
          targetGroupId
        );

        let newData: TTreeData;
        if (beforeId || targetGroupId) {
          if (clickedElement?.type === "group") {
            const result = pasteIntoGroup(
              data,
              item,
              // @ts-expect-error - typescript doesnt't understand the if
              targetGroupId || beforeId
            );
            newData = result.data;
          } else {
            const result = pasteAfter(
              data,
              item,
              // @ts-expect-error - typescript doesnt't understand the if
              beforeId || targetGroupId
            );
            newData = result.data;
          }
        } else {
          const result = pasteAtTop(data, item);
          newData = result.data;
        }

        if (!newData) return;

        onPaste({
          data: newData,
        });
      } catch (error) {
        console.error("Error parsing clipboard content:", error);
      }
    },
    [onPaste, clickedElement, data]
  );

  // on paste handling
  useEffect(() => {
    if (!groupDropRef.current || !handleOnPaste) return;

    groupDropRef.current.addEventListener("paste", handleOnPaste);

    return () => {
      groupDropRef?.current?.removeEventListener("paste", handleOnPaste);
    };
  }, [data, handleOnPaste]);

  return (
    <ContextMenu>
      <ContextMenuTrigger className="w-full h-full">
        <TreeContext.Provider value={contextValue}>
          <div className={`tree-container ${className}`} ref={containerRef}>
            <div ref={groupDropRef}>
              {data.map((item) => {
                if (item.type === "group") {
                  return (
                    <TreeGroup
                      key={item.id}
                      group={item}
                      level={0}
                      renderGroup={renderGroup}
                      renderItem={renderItem}
                      selectedItemId={selectedItemId}
                      grip={groupGrip}
                      handle={groupHandle}
                      collapsible={groupCollapsible}
                      copy={copyGroup}
                      handleDuplicate={handleDuplicateGroup}
                      handleDelete={handleDeleteGroup}
                      itemGrip={itemGrip}
                      itemHandle={itemHandle}
                      copyItem={copyItem}
                      handleDuplicateItem={handleDuplicateItem}
                      handleDeleteItem={handleDeleteItem}
                      classNameItem={cn(classNameItem, classNameGroupItem)}
                      classNameSelectedItem={classNameSelectedItem}
                      classNameGroup={classNameGroup}
                      groupInset={groupInset}
                      classNameGroupHeader={classNameGroupHeader}
                      classNameRootLevel={classNameRootLevel}
                      classNameSubLevel={classNameSubLevel}
                      classNameRootLevelHeader={classNameRootLevelHeader}
                      classNameSubLevelHeader={classNameSubLevelHeader}
                    />
                  );
                } else {
                  return (
                    <TreeItem
                      key={item.id}
                      item={item}
                      groupId="root"
                      renderItem={renderItem}
                      selectedItemId={selectedItemId}
                      grip={itemGrip}
                      handle={itemHandle}
                      copy={copyItem}
                      handleDuplicate={handleDuplicateItem}
                      handleDelete={handleDeleteItem}
                      className={classNameItem}
                      classNameSelected={classNameSelectedItem}
                    />
                  );
                }
              })}
            </div>
          </div>
        </TreeContext.Provider>
      </ContextMenuTrigger>
      <ContextMenuContent className={cn("w-52", !onPaste ? "hidden" : "")}>
        <ContextMenuItem
          onClick={() => handleOnPaste(new ClipboardEvent("paste"))}
        >
          <ClipboardPaste className="w-4 h-4" />
          <span>Paste</span>
          <ContextMenuShortcut>Ctrl+V</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
