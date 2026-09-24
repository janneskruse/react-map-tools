export type TProjectPanel = "right" | "secondaryRight" | "bottom";
export type TLayoutTarget =
  TProjectPanel | "mapLayout" | "mapRight" | "mapCenterUp" | "mapCenterBottom";

export interface IProjectLayoutState {
  panels: Record<TProjectPanel, boolean>;
  sizes: Record<TProjectPanel, number>;
  targets: Record<TLayoutTarget, HTMLDivElement | null>;
  showDrawer: boolean;
  setShowDrawer: (open: boolean | ((previous: boolean) => boolean)) => void;
  setPanelOpen: (panel: TProjectPanel, open: boolean) => void;
  setPanelSize: (panel: TProjectPanel, size: number) => void;
  setTarget: (target: TLayoutTarget, element: HTMLDivElement | null) => void;
}
