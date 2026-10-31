import { createContext } from "react";
import type { TTreeData, TDropResult } from "@/types/drag-and-drop";

export type TreeContextValue = {
  uniqueContextId: symbol;
  registerElement: (id: string, element: HTMLElement) => () => void;
  data: TTreeData;
  maxSubGroups: number;
  onDrop?: (result: TDropResult) => void;
  handleItemClick?: (itemId: string, groupId: string) => void;
  handleGroupClick?: (groupId: string, parentGroupId?: string) => void;
};

export const TreeContext = createContext<TreeContextValue>({
  uniqueContextId: Symbol("tree-context"),
  registerElement: () => () => {},
  data: [],
  maxSubGroups: 1,
});