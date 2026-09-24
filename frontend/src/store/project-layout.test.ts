import { expect, it } from "vitest";
import { createProjectLayoutStore } from "./project-layout";
import { getLayoutPanelSizes } from "@/utils/layout/panel-sizes";

it("isolates project panels and starts with empty portal targets", () => {
  const first = createProjectLayoutStore();
  const second = createProjectLayoutStore();
  first.getState().setPanelOpen("right", true);
  expect(second.getState().panels.right).toBe(false);
  expect(
    Object.values(first.getState().targets).every((target) => target === null),
  ).toBe(true);
});

it("preserves room for the map when both right panels open", () => {
  const sizes = getLayoutPanelSizes(true, true, 90, 90);
  expect(sizes.map).toBeGreaterThanOrEqual(30);
  expect(sizes.map + sizes.right + sizes.secondaryRight).toBe(100);
  expect(getLayoutPanelSizes(false, false, 28, 24)).toEqual({
    map: 100,
    right: 0,
    secondaryRight: 0,
  });
});
