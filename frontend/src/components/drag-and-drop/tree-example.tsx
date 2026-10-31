"use client";
import React, { useState } from "react";

import { Tree } from "./tree";

import {
  handleTreeDrop,
  removeItem,
  duplicateItem,
} from "@/utils/drag-and-drop/drag-and-drop";

import type {
  TTreeData,
  TTreeGroup,
  TTreeItem,
  TDropResult,
} from "@/types/drag-and-drop";

const initialData: TTreeData = [
  {
    id: "group-1",
    name: "🏠 Home",
    type: "group",
    draggable: false,
    items: [
      { id: "item-1", name: "📄 Document 1", type: "item" },
      { id: "item-2", name: "📸 Image 1", type: "item" },
      {
        id: "subgroup-1",
        name: "📁 Important Files",
        type: "group",
        items: [
          { id: "item-3", name: "📋 Report.pdf", type: "item" },
          { id: "item-4", name: "📊 Spreadsheet.xlsx", type: "item" },
        ],
      },
    ],
  },
  {
    id: "group-2",
    name: "💼 Work",
    type: "group",
    items: [
      { id: "item-5", name: "📝 Meeting Notes", type: "item" },
      { id: "item-6", name: "🎯 Project Plan", type: "item" },
      {
        id: "subgroup-2",
        name: "📈 Analytics",
        type: "group",
        items: [{ id: "item-7", name: "📊 Q1 Report", type: "item" }],
      },
    ],
  },
  { id: "item-9", name: "📝 Meeting Notes 2", type: "item" },
  {
    id: "group-3",
    name: "🎨 Creative",
    type: "group",
    items: [{ id: "item-8", name: "🖼️ Design Assets", type: "item" }],
  },
];

export function TreeExample() {
  const [data, setData] = useState<TTreeData>(initialData);

  const handleDrop = (result: TDropResult) => {
    console.log("Drop result:", result);
    setData((prevData) => {
      const {data:newData, beforeId:beforeId} = handleTreeDrop(prevData, result);
      console.log(
        `Moving ${result.sourceType} ${result.sourceId} to ${result.targetType} ${result.targetId} with operation: ${result.operation}`, beforeId
      );
      return newData;
    });
  };

  const handleDelete = (itemId: string) => {
    const {data: newData, beforeId} = removeItem(data, itemId);

    return new Promise<void>((resolve) => {
      console.log(`Deleting item/group with ID: ${itemId}`, beforeId);
      setData(newData);
      resolve();
    });
  }

  const handleDuplicate = (itemId: string, type: "group" | "item") => {
    const { data: newData, beforeId } = duplicateItem(data, itemId, type);

    return new Promise<void>((resolve) => {
      console.log(`Duplicated item/group with ID: ${itemId}`, beforeId);
      setData(newData);
      resolve();
    });
  };

  const handlePaste = ({
    data: newData,
  }: {
    data: TTreeData;
  }) => {
    setData(newData);
  };

  const renderGroup = (group: TTreeGroup, level: number) => (
      <div className="flex items-center gap-2">
        <span className="font-semibold">{group.name}</span>
        <span className="text-xs px-2 py-1 bg-main rounded">Level {level}</span>
      </div>
  );

  const renderItem = (item: TTreeItem) => (
      <div className="flex flex-1 items-center gap-2">
        <span>{item.name}</span>
        <span className="text-xs">#{item.id}</span>
      </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 h-full">
      <div className="mb-6">
        <h1 className="mb-2">Drag & Drop Tree Example</h1>
        <p>
          Drag items and groups around. The maximum nesting level in this
          example is 1, so groups can contain subgroups, but subgroups cannot
          contain further subgroups.
        </p>
      </div>

      <div className="bg-main rounded-sm p-4">
        <Tree
          data={data}
          maxSubGroups={1}
          onDrop={handleDrop}
          renderGroup={renderGroup}
          renderItem={renderItem}
          className="min-h-96"
          groupHandle="onHover"
          copyGroup={true}
          handleDeleteGroup={handleDelete}
          handleDuplicateGroup={(groupId: string) =>
            handleDuplicate(groupId, "group")
          }
          copyItem={true}
          handleDeleteItem={handleDelete}
          handleDuplicateItem={(itemId: string) =>
            handleDuplicate(itemId, "item")
          }
          itemGrip="onHover"
          itemHandle="onHover"
          onPaste={handlePaste}
          groupInset={"outerInset"}
          classNameItem="p-2 mb-1 rounded border border-muted hover:bg-accent/50 cursor-grab active:cursor-grabbing transition-colors"
          classNameGroupHeader="p-3 mb-2 rounded-sm border-2 border-dashed transition-colors"
          classNameRootLevelHeader="bg-secondary/10 border-secondary/20 hover:bg-secondary/30"
          classNameSubLevelHeader="bg-accent/10 border-muted hover:bg-accent/30"
        />
      </div>

      <div className="mt-6 p-4 bg-accent/50 rounded-sm">
        <h3 className="mb-2">Instructions:</h3>
        <ul className="text-sm space-y-1">
          <li>• Drag items between groups and subgroups</li>
          <li>• Drag groups to reorder them</li>
          <li>
            • Drop groups on other groups to create subgroups (max 1 level)
          </li>
          <li>• Check the console for drop events</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-secondary/10 rounded-sm">
        <h3 className="font-semibold text-secondary/80 mb-2">
          Current Data Structure:
        </h3>
        <pre className="text-xs text-secondary/70 overflow-auto max-h-32">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default TreeExample;
