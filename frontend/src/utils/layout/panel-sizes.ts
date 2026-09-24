export function getLayoutPanelSizes(
  showRight: boolean,
  showSecondaryRight: boolean,
  rightSize: number,
  secondaryRightSize: number,
) {
  const secondaryRight = showSecondaryRight
    ? Math.min(35, Math.max(15, secondaryRightSize))
    : 0;
  const right = showRight
    ? Math.min(70 - secondaryRight, Math.max(15, rightSize))
    : 0;
  return { map: 100 - right - secondaryRight, right, secondaryRight };
}
